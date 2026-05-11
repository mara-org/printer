import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  POWER_UPSELL_MIN_ANALYSES_30D,
  pickStage,
  sendLifecycle,
} from "@/lib/lifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_LIMIT = 100;
const POWER_UPSELL_BATCH_LIMIT = 50;

type CronResult = { sent: number; considered: number; skipped: number };

async function runSignupAgeStage(sb: ReturnType<typeof supabaseAdmin>): Promise<CronResult> {
  const result: CronResult = { sent: 0, considered: 0, skipped: 0 };

  const { data: rows, error } = await sb
    .from("user_lifecycle")
    .select("user_id, email, days_since_signup, days_since_last_analysis")
    .not("email", "is", null)
    .lte("days_since_signup", 90)
    .limit(BATCH_LIMIT);

  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return result;

  result.considered = rows.length;
  const userIds = rows
    .map((r) => r.user_id)
    .filter((v): v is string => typeof v === "string");

  const { data: alreadySent } = await sb
    .from("lifecycle_sends")
    .select("user_id, stage")
    .in("user_id", userIds);

  const sentSet = new Set((alreadySent ?? []).map((r) => `${r.user_id}:${r.stage}`));

  for (const r of rows) {
    if (!r.user_id || !r.email) {
      result.skipped++;
      continue;
    }
    const stage = pickStage(
      r.days_since_signup ?? 0,
      r.days_since_last_analysis === null ? null : (r.days_since_last_analysis ?? null),
    );
    if (!stage) {
      result.skipped++;
      continue;
    }
    const key = `${r.user_id}:${stage}`;
    if (sentSet.has(key)) {
      result.skipped++;
      continue;
    }

    const ok = await sendLifecycle(r.email, stage);
    if (!ok) continue;

    await sb
      .from("lifecycle_sends")
      .upsert({ user_id: r.user_id, stage, sent_at: new Date().toISOString() });
    result.sent++;
  }

  return result;
}

// Behavioral trigger: any active Pro user who analyzed ≥3 docs in the last
// 30 days gets the Power upsell exactly once.
async function runPowerUpsell(sb: ReturnType<typeof supabaseAdmin>): Promise<CronResult> {
  const result: CronResult = { sent: 0, considered: 0, skipped: 0 };

  const { data: proSubs } = await sb
    .from("subscriptions")
    .select("user_id")
    .eq("tier", "pro")
    .in("status", ["active", "trialing"])
    .limit(POWER_UPSELL_BATCH_LIMIT);

  if (!proSubs || proSubs.length === 0) return result;

  const userIds = proSubs
    .map((s) => s.user_id)
    .filter((v): v is string => typeof v === "string");

  if (userIds.length === 0) return result;

  // Exclude anyone who already received this stage.
  const { data: alreadySent } = await sb
    .from("lifecycle_sends")
    .select("user_id")
    .eq("stage", "power_upsell")
    .in("user_id", userIds);

  const excluded = new Set(
    (alreadySent ?? [])
      .map((r) => r.user_id)
      .filter((v): v is string => typeof v === "string"),
  );

  const candidates = userIds.filter((id) => !excluded.has(id));
  if (candidates.length === 0) return result;

  // Count analyses in the last 30 days per candidate.
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await sb
    .from("analyses")
    .select("user_id, created_at")
    .gte("created_at", since)
    .in("user_id", candidates);

  const counts = new Map<string, number>();
  for (const row of recent ?? []) {
    if (!row.user_id) continue;
    counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);
  }

  const targets = candidates.filter(
    (id) => (counts.get(id) ?? 0) >= POWER_UPSELL_MIN_ANALYSES_30D,
  );
  result.considered = targets.length;
  if (targets.length === 0) return result;

  // Look up emails from profiles.
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, email")
    .in("id", targets);

  for (const p of profiles ?? []) {
    if (!p.id || !p.email) {
      result.skipped++;
      continue;
    }
    const ok = await sendLifecycle(p.email, "power_upsell");
    if (!ok) continue;
    await sb.from("lifecycle_sends").upsert({
      user_id: p.id,
      stage: "power_upsell",
      sent_at: new Date().toISOString(),
    });
    result.sent++;
  }

  return result;
}

export async function GET(req: Request) {
  if (!isCronAuthorized(req))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, skipped: "no_resend_key" });
  }

  const sb = supabaseAdmin();

  let signupAge: CronResult;
  let powerUpsell: CronResult;
  try {
    signupAge = await runSignupAgeStage(sb);
    powerUpsell = await runPowerUpsell(sb);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    signup_age: signupAge,
    power_upsell: powerUpsell,
    sent: signupAge.sent + powerUpsell.sent,
  });
}
