import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer, supabaseAdmin } from "@/lib/supabase-server";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rate-limit";
import { checkAndConsume } from "@/lib/quota";
import { analyzeWithFallback } from "@/lib/ai/router";
import { DocTypeEnum } from "@/lib/ai/types";

export const runtime = "nodejs"; // we use Node Buffer for base64
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

const Body = z.object({
  storage_path: z.string().min(1).max(500),
  output_locale: z.string().min(2).max(20),
  hinted_doc_type: DocTypeEnum.optional(),
  turnstile_token: z.string().min(1).max(2000).optional(),
});

function ipFrom(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const ip = ipFrom(req);

  // 1. Rate limit per IP.
  const rl = await rateLimit(`analyze:ip:${ip}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited", retry_after_sec: rl.resetSec },
      { status: 429, headers: { "Retry-After": String(rl.resetSec) } },
    );
  }

  // 2. Parse body.
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "bad_request", detail: (err as Error).message }, { status: 400 });
  }

  // 3. Turnstile (skipped in dev; required in prod).
  const tsOk = await verifyTurnstile(body.turnstile_token, ip);
  if (!tsOk) return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });

  // 4. Auth.
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // 5. Quota / kill switches.
  const quota = await checkAndConsume(user.id);
  if (!quota.ok) {
    const status = quota.reason === "quota_exhausted" ? 402 : 503;
    return NextResponse.json({ error: quota.reason, tier: quota.tier }, { status });
  }

  // 6. Fetch the file from Storage. Path must be under the user's folder
  //    (RLS enforces this, but double-check defensively).
  if (!body.storage_path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "forbidden_path" }, { status: 403 });
  }

  const dl = await sb.storage.from("documents").download(body.storage_path);
  if (dl.error || !dl.data) {
    return NextResponse.json({ error: "file_not_found" }, { status: 404 });
  }
  const arrayBuf = await dl.data.arrayBuffer();
  if (arrayBuf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large", max_bytes: MAX_BYTES }, { status: 413 });
  }
  const fileBytes = new Uint8Array(arrayBuf);
  const mimeType = dl.data.type || "application/pdf";

  // 7. Insert a `documents` row (admin client; RLS would also allow it but we already verified ownership).
  // Set purge_at tighter for free tier (1 day) than paid (30 days) so the storage-purge cron
  // recovers space quickly from abuse / casual one-off uploads.
  const purgeDays = quota.tier === "free" ? 1 : 30;
  const purgeAt = new Date(Date.now() + purgeDays * 24 * 60 * 60 * 1000).toISOString();
  const admin = supabaseAdmin();
  const { data: docRow, error: docErr } = await admin
    .from("documents")
    .insert({
      user_id: user.id,
      storage_path: body.storage_path,
      mime_type: mimeType,
      byte_size: arrayBuf.byteLength,
      source_locale: body.output_locale,
      status: "analyzing",
      purge_at: purgeAt,
    })
    .select("id")
    .single();
  if (docErr || !docRow) {
    return NextResponse.json({ error: "db_insert_failed", detail: docErr?.message }, { status: 500 });
  }

  // 8. Run the AI provider chain.
  let out;
  try {
    out = await analyzeWithFallback({
      fileBytes,
      mimeType,
      outputLocale: body.output_locale,
      hintedDocType: body.hinted_doc_type,
    });
  } catch (err) {
    await admin
      .from("analyze_calls")
      .insert({
        user_id: user.id,
        document_id: docRow.id,
        provider: "gemini",
        model: "gemini-2.5-flash",
        tier: quota.tier,
        ok: false,
        error: (err as Error).message.slice(0, 500),
      });
    await admin.from("documents").update({ status: "failed" }).eq("id", docRow.id);
    return NextResponse.json({ error: "analyze_failed", detail: (err as Error).message }, { status: 502 });
  }

  // 9. Persist the analysis + cost-tracking row.
  const a = out.analysis;
  await admin.from("analyses").insert({
    document_id: docRow.id,
    user_id: user.id,
    output_locale: body.output_locale,
    summary: a.summary,
    risks: a.risks,
    questions: a.questions,
    key_terms: a.key_terms,
    model: out.modelUsed,
    input_tokens: out.inputTokens,
    output_tokens: out.outputTokens,
    cost_usd: out.costUsd,
  });
  await admin.from("documents").update({ status: "ready", detected_type: a.document_type }).eq("id", docRow.id);
  await admin.from("analyze_calls").insert({
    user_id: user.id,
    document_id: docRow.id,
    provider: out.provider,
    model: out.modelUsed,
    tier: quota.tier,
    input_tokens: out.inputTokens,
    output_tokens: out.outputTokens,
    cost_usd: out.costUsd,
    ok: true,
    duration_ms: out.durationMs,
  });

  return NextResponse.json({
    document_id: docRow.id,
    analysis: a,
    provider: out.provider,
    model: out.modelUsed,
  });
}
