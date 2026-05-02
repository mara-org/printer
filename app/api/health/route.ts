import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "paperlens",
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    region: process.env.VERCEL_REGION ?? "local",
    ts: Date.now(),
  });
}
