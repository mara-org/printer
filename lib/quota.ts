import { supabaseAdmin } from "./supabase-server";
import type { Tier } from "./ai/types";

export const FREE_DOCS_PER_MONTH = 3;

export type QuotaCheck =
  | { ok: true; tier: Tier; consumedFree: boolean }
  | { ok: false; reason: "quota_exhausted" | "kill_switch" | "analyze_paused"; tier: Tier };

export async function getTier(userId: string): Promise<Tier> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.rpc("get_user_tier", { p_user_id: userId });
  if (error || !data) return "free";
  return data as Tier;
}

export async function getKillSwitches(): Promise<{ kill: boolean; analyzePaused: boolean }> {
  const sb = supabaseAdmin();
  const { data } = await sb.from("app_config").select("key,value").in("key", ["kill_switch", "analyze_paused"]);
  const kill = data?.find((r) => r.key === "kill_switch")?.value;
  const paused = data?.find((r) => r.key === "analyze_paused")?.value;
  return { kill: kill === true, analyzePaused: paused === true };
}

export async function checkAndConsume(userId: string): Promise<QuotaCheck> {
  const { kill, analyzePaused } = await getKillSwitches();
  const tier = await getTier(userId);
  if (kill) return { ok: false, reason: "kill_switch", tier };
  if (analyzePaused && tier === "free") return { ok: false, reason: "analyze_paused", tier };

  if (tier !== "free") return { ok: true, tier, consumedFree: false };

  const sb = supabaseAdmin();
  const { data, error } = await sb.rpc("try_consume_free_quota", {
    p_user_id: userId,
    p_limit: FREE_DOCS_PER_MONTH,
  });
  if (error) return { ok: false, reason: "quota_exhausted", tier };
  if (!data) return { ok: false, reason: "quota_exhausted", tier };
  return { ok: true, tier, consumedFree: true };
}
