import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { pickStage, sendLifecycle } from "@/lib/lifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_LIMIT = 100;

export async function GET(req: Request) {
  if (!isCronAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, skipped: "no_resend_key" });
  }

  const sb = supabaseAdmin();

  // Pull a batch of users likely to need a lifecycle email.
  // The view handles the date math; we send at most one email per user per cron run.
  const { data: rows, error } = await sb
    .from("user_lifecycle")
    .select("user_id, email, days_since_signup, days_since_last_analysis")
    .not("email", "is", null)
    .lte("days_since_signup", 90)
    .limit(BATCH_LIMIT);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!rows || rows.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, considered: 0 });
  }

  const userIds = rows.map((r) => r.user_id).filter((v): v is string => typeof v === "string");
  const { data: alreadySent } = await sb
    .from("lifecycle_sends")
    .select("user_id, stage")
    .in("user_id", userIds);

  const sentSet = new Set((alreadySent ?? []).map((r) => `${r.user_id}:${r.stage}`));

  let sent = 0;
  let skipped = 0;

  for (const r of rows) {
    if (!r.user_id || !r.email) {
      skipped++;
      continue;
    }
    const stage = pickStage(
      r.days_since_signup ?? 0,
      r.days_since_last_analysis === null ? null : (r.days_since_last_analysis ?? null),
    );
    if (!stage) {
      skipped++;
      continue;
    }
    const key = `${r.user_id}:${stage}`;
    if (sentSet.has(key)) {
      skipped++;
      continue;
    }

    const ok = await sendLifecycle(r.email, stage);
    if (!ok) continue;

    await sb.from("lifecycle_sends").upsert({ user_id: r.user_id, stage, sent_at: new Date().toISOString() });
    sent++;
  }

  return NextResponse.json({ ok: true, sent, considered: rows.length, skipped });
}
