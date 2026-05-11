import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { getProductId, isPolarConfigured, polarClient } from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  product: z.enum(["pro", "pro_yearly", "power", "power_yearly", "lifetime"]),
});

export async function POST(req: Request) {
  if (!isPolarConfigured()) {
    return NextResponse.json({ error: "polar_not_configured" }, { status: 503 });
  }

  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "bad_request", detail: (err as Error).message }, { status: 400 });
  }

  const productId = getProductId(body.product);
  if (!productId) {
    return NextResponse.json({ error: "product_not_configured" }, { status: 503 });
  }

  const origin = new URL(req.url).origin;
  try {
    const checkout = await polarClient().checkouts.create({
      products: [productId],
      successUrl: `${origin}/dashboard?upgraded=1`,
      customerEmail: user.email ?? undefined,
      externalCustomerId: user.id,
      metadata: { user_id: user.id, tier: body.product },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    return NextResponse.json(
      { error: "checkout_failed", detail: (err as Error).message },
      { status: 502 },
    );
  }
}
