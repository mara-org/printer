import { Polar } from "@polar-sh/sdk";
import type { Tier } from "@/lib/ai/types";

export type PolarProductSlug = "pro" | "power" | "lifetime";

const PRODUCT_ENV_VAR: Record<PolarProductSlug, string> = {
  pro: "NEXT_PUBLIC_POLAR_PRODUCT_PRO",
  power: "NEXT_PUBLIC_POLAR_PRODUCT_POWER",
  lifetime: "NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME",
};

const SLUG_TO_TIER: Record<PolarProductSlug, Tier> = {
  pro: "pro",
  power: "power",
  lifetime: "lifetime",
};

export function getProductId(slug: PolarProductSlug): string | null {
  return process.env[PRODUCT_ENV_VAR[slug]] ?? null;
}

export function tierFromProductId(productId: string): Tier | null {
  for (const slug of ["pro", "power", "lifetime"] as const) {
    if (process.env[PRODUCT_ENV_VAR[slug]] === productId) return SLUG_TO_TIER[slug];
  }
  return null;
}

export function isPolarConfigured(): boolean {
  return Boolean(
    process.env.POLAR_ACCESS_TOKEN &&
      (getProductId("pro") || getProductId("power") || getProductId("lifetime")),
  );
}

let _client: Polar | null = null;
export function polarClient(): Polar {
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) throw new Error("POLAR_ACCESS_TOKEN not set");
  if (_client) return _client;
  _client = new Polar({
    accessToken: token,
    server: (process.env.POLAR_SERVER as "production" | "sandbox" | undefined) ?? "production",
  });
  return _client;
}
