import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { isPolarConfigured, polarClient } from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isPolarConfigured()) {
    return NextResponse.json({ error: "polar_not_configured" }, { status: 503 });
  }

  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  try {
    const session = await polarClient().customerSessions.create({
      externalCustomerId: user.id,
    });
    return NextResponse.json({ url: session.customerPortalUrl });
  } catch (err) {
    return NextResponse.json(
      { error: "portal_failed", detail: (err as Error).message },
      { status: 502 },
    );
  }
}
