import { Polar } from "@polar-sh/sdk";
import type { Tier } from "@/lib/ai/types";

export type PolarProductSlug =
  | "pro"
  | "pro_yearly"
  | "power"
  | "power_yearly"
  | "lifetime";

export const POLAR_PRODUCT_SLUGS: readonly PolarProductSlug[] = [
  "pro",
  "pro_yearly",
  "power",
  "power_yearly",
  "lifetime",
] as const;

const PRODUCT_ENV_VAR: Record<PolarProductSlug, string> = {
  pro: "NEXT_PUBLIC_POLAR_PRODUCT_PRO",
  pro_yearly: "NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY",
  power: "NEXT_PUBLIC_POLAR_PRODUCT_POWER",
  power_yearly: "NEXT_PUBLIC_POLAR_PRODUCT_POWER_YEARLY",
  lifetime: "NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME",
};

const SLUG_TO_TIER: Record<PolarProductSlug, Tier> = {
  pro: "pro",
  pro_yearly: "pro",
  power: "power",
  power_yearly: "power",
  lifetime: "lifetime",
};

export function getProductId(slug: PolarProductSlug): string | null {
  return process.env[PRODUCT_ENV_VAR[slug]] ?? null;
}

export function tierFromProductId(productId: string): Tier | null {
  for (const slug of POLAR_PRODUCT_SLUGS) {
    if (process.env[PRODUCT_ENV_VAR[slug]] === productId) return SLUG_TO_TIER[slug];
  }
  return null;
}

export function isPolarConfigured(): boolean {
  if (!process.env.POLAR_ACCESS_TOKEN) return false;
  return POLAR_PRODUCT_SLUGS.some((slug) => Boolean(getProductId(slug)));
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
