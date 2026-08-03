import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH = 200;

export async function GET(req: Request) {
  if (!isCronAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = supabaseAdmin();
  const now = new Date().toISOString();

  // Documents whose purge_at is in the past and that have an analysis row OR failed status.
  // Keep documents that are still pending (not yet analyzed) so we don't delete in-flight uploads.
  const { data: docs, error } = await sb
    .from("documents")
    .select("id, storage_path, status")
    .lte("purge_at", now)
    .in("status", ["ready", "failed"])
    .limit(BATCH);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!docs || docs.length === 0) return NextResponse.json({ ok: true, deleted: 0 });

  const paths = docs.map((d) => d.storage_path).filter((p): p is string => typeof p === "string");
  let storageRemoved = 0;
  if (paths.length > 0) {
    const { data: removed } = await sb.storage.from("documents").remove(paths);
    storageRemoved = removed?.length ?? 0;
  }

  // Mark rows purged (don't delete; we keep the analyses row for user history).
  const ids = docs.map((d) => d.id);
  await sb.from("documents").update({ status: "purged", storage_path: "" }).in("id", ids);

  return NextResponse.json({ ok: true, considered: docs.length, storageRemoved });
}
