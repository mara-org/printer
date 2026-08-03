import { NextResponse } from "next/server";
import { Webhook, WebhookVerificationError } from "standardwebhooks";
import { supabaseAdmin } from "@/lib/supabase-server";
import { tierFromProductId } from "@/lib/polar";
import type { Database } from "@/lib/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubStatus = Database["public"]["Enums"]["sub_status"];

const ALLOWED_STATUS = new Set<SubStatus>([
  "trialing",
  "active",
  "past_due",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "unpaid",
  "paused",
]);

function normalizeStatus(s: unknown): SubStatus | null {
  if (typeof s !== "string") return null;
  const lower = s.toLowerCase().replace(/\s+/g, "_") as SubStatus;
  return ALLOWED_STATUS.has(lower) ? lower : null;
}

function getUserId(metadata: unknown, externalCustomerId: unknown): string | null {
  if (metadata && typeof metadata === "object" && "user_id" in metadata) {
    const v = (metadata as Record<string, unknown>).user_id;
    if (typeof v === "string") return v;
  }
  if (typeof externalCustomerId === "string") return externalCustomerId;
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    headers[k] = v;
  });

  let event: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(Buffer.from(secret, "utf8").toString("base64"));
    event = wh.verify(body, headers) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "bad_signature" }, { status: 400 });
    }
    return NextResponse.json({ error: "verify_failed" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  switch (event.type) {
    case "subscription.created":
    case "subscription.updated":
    case "subscription.active":
    case "subscription.canceled":
    case "subscription.revoked": {
      const sub = event.data as Record<string, unknown>;
      const productId = (sub.productId ?? sub.product_id) as string | undefined;
      const tier = productId ? tierFromProductId(productId) : null;
      const userId = getUserId(sub.metadata, sub.customerExternalId ?? sub.customer_external_id);
      const status =
        normalizeStatus(sub.status) ??
        (event.type === "subscription.canceled" || event.type === "subscription.revoked"
          ? "canceled"
          : "active");
      const periodEnd =
        (sub.currentPeriodEnd ?? sub.current_period_end) as string | null | undefined;
      const cancelAtPeriodEnd = Boolean(sub.cancelAtPeriodEnd ?? sub.cancel_at_period_end);

      if (!userId || !tier) {
        return NextResponse.json({ ok: true, skipped: "missing_user_or_tier" });
      }

      await sb.from("subscriptions").upsert(
        {
          user_id: userId,
          provider: "polar",
          provider_customer_id: (sub.customerId ?? sub.customer_id ?? null) as string | null,
          provider_subscription_id: (sub.id ?? null) as string | null,
          price_id: productId ?? null,
          tier,
          status,
          current_period_end: periodEnd ?? null,
          cancel_at_period_end: cancelAtPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      break;
    }

    case "order.created":
    case "order.paid": {
      const order = event.data as Record<string, unknown>;
      const productId = (order.productId ?? order.product_id) as string | undefined;
      const tier = productId ? tierFromProductId(productId) : null;
      const userId = getUserId(
        order.metadata,
        order.customerExternalId ?? order.customer_external_id,
      );
      // One-time products (Lifetime) only: skip subscription orders.
      const billingType = order.billingReason ?? order.billing_reason ?? "purchase";
      if (!userId || !tier || tier !== "lifetime" || billingType !== "purchase") {
        return NextResponse.json({ ok: true, skipped: "not_lifetime_purchase" });
      }
      await sb.from("subscriptions").upsert(
        {
          user_id: userId,
          provider: "polar",
          provider_customer_id: (order.customerId ?? order.customer_id ?? null) as string | null,
          provider_subscription_id: (order.id ?? null) as string | null,
          price_id: productId ?? null,
          tier,
          status: "active",
          current_period_end: null,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      break;
    }

    default:
      // ignore other events; Polar fires many we don't need
      break;
  }

  return NextResponse.json({ ok: true });
}
