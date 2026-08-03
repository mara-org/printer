import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isCronAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = supabaseAdmin();

  const { data: spendData, error: spendErr } = await sb.rpc("get_today_spend_usd");
  if (spendErr) return NextResponse.json({ error: spendErr.message }, { status: 500 });
  const today = Number(spendData ?? 0);

  const { data: cap } = await sb.from("app_config").select("value").eq("key", "daily_spend_cap_usd").single();
  const dailyCap = Number(cap?.value ?? 1);

  const overBudget = today > dailyCap;

  // Flip analyze_paused if we're over; clear it if we're under.
  await sb
    .from("app_config")
    .upsert({ key: "analyze_paused", value: overBudget, updated_at: new Date().toISOString() });

  return NextResponse.json({
    today_spend_usd: today,
    daily_cap_usd: dailyCap,
    analyze_paused: overBudget,
  });
}
