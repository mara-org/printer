"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingCTA } from "@/components/pricing-cta";
import { cn } from "@/lib/utils";

type ProductSlug =
  | "pro"
  | "pro_yearly"
  | "power"
  | "power_yearly"
  | "lifetime";

type BillingPeriod = "monthly" | "yearly";

type Tier = {
  name: string;
  monthlyProduct?: Exclude<ProductSlug, "pro_yearly" | "power_yearly" | "lifetime">;
  yearlyProduct?: Extract<ProductSlug, "pro_yearly" | "power_yearly">;
  oneTimeProduct?: Extract<ProductSlug, "lifetime">;
  monthlyPrice: string;
  monthlyPeriod: string;
  yearlyPrice?: string;
  yearlyPeriod?: string;
  yearlyEffective?: string;
  yearlySavings?: string;
  highlight?: boolean;
  features: string[];
  ctaLabel: string;
};

const tiers: Tier[] = [
  {
    name: "Free",
    monthlyPrice: "$0",
    monthlyPeriod: "forever",
    features: [
      "3 documents per month",
      "1 follow-up question per analysis",
      "Watermarked export",
      "Standard queue",
    ],
    ctaLabel: "Sign in to start",
  },
  {
    name: "Pro",
    monthlyProduct: "pro",
    yearlyProduct: "pro_yearly",
    monthlyPrice: "$6.99",
    monthlyPeriod: "/ month",
    yearlyPrice: "$67",
    yearlyPeriod: "/ year",
    yearlyEffective: "~$5.59/mo, billed yearly",
    yearlySavings: "Save $17",
    highlight: true,
    features: [
      "Unlimited document analyses",
      "Unlimited follow-up questions",
      "Multilingual export, no watermark",
      "Priority queue",
      "Analysis history search",
    ],
    ctaLabel: "Upgrade to Pro",
  },
  {
    name: "Power",
    monthlyProduct: "power",
    yearlyProduct: "power_yearly",
    monthlyPrice: "$14.99",
    monthlyPeriod: "/ month",
    yearlyPrice: "$144",
    yearlyPeriod: "/ year",
    yearlyEffective: "~$12/mo, billed yearly",
    yearlySavings: "Save $36",
    features: [
      "Everything in Pro",
      "50+ page documents",
      "Bulk upload (10 at once)",
      "API access",
      "Side-by-side document compare",
    ],
    ctaLabel: "Upgrade to Power",
  },
  {
    name: "Lifetime",
    oneTimeProduct: "lifetime",
    monthlyPrice: "$79",
    monthlyPeriod: "one time",
    features: [
      "All Pro features",
      "No recurring billing, ever",
      "Pay once, use forever",
    ],
    ctaLabel: "Buy Lifetime",
  },
];

export function PricingTiers({
  authed,
  configured,
}: {
  authed: boolean;
  configured: boolean;
}) {
  const [period, setPeriod] = useState<BillingPeriod>("yearly");

  return (
    <>
      <div className="mb-8 flex justify-center">
        <div
          role="tablist"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white p-1 text-sm"
        >
          <button
            role="tab"
            aria-selected={period === "monthly"}
            onClick={() => setPeriod("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 transition",
              period === "monthly"
                ? "bg-ink text-white"
                : "text-ink/70 hover:text-ink",
            )}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={period === "yearly"}
            onClick={() => setPeriod("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 transition",
              period === "yearly"
                ? "bg-ink text-white"
                : "text-ink/70 hover:text-ink",
            )}
          >
            Yearly
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                period === "yearly" ? "bg-white/20 text-white" : "bg-accent/10 text-accent",
              )}
            >
              −20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const showYearly =
            period === "yearly" && tier.yearlyProduct && tier.yearlyPrice;
          const product = showYearly
            ? tier.yearlyProduct
            : tier.monthlyProduct ?? tier.oneTimeProduct;
          const price = showYearly ? tier.yearlyPrice! : tier.monthlyPrice;
          const periodLabel = showYearly ? tier.yearlyPeriod! : tier.monthlyPeriod;

          return (
            <Card
              key={tier.name}
              className={cn(
                "flex flex-col",
                tier.highlight && "border-accent/40 ring-2 ring-accent/20",
              )}
            >
              <CardBody className="flex flex-1 flex-col gap-5 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{tier.name}</h2>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight">
                        {price}
                      </span>
                      <span className="text-sm text-ink/50">{periodLabel}</span>
                    </div>
                    {showYearly && tier.yearlyEffective && (
                      <p className="mt-1 text-xs text-ink/55">
                        {tier.yearlyEffective}
                      </p>
                    )}
                  </div>
                  {showYearly && tier.yearlySavings ? (
                    <Badge tone="accent">{tier.yearlySavings}</Badge>
                  ) : tier.highlight ? (
                    <Badge tone="accent">Most popular</Badge>
                  ) : null}
                </div>

                <ul className="space-y-2 text-sm text-ink/80">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {product ? (
                  <PricingCTA
                    product={product}
                    label={tier.ctaLabel}
                    highlight={tier.highlight}
                    authed={authed}
                    configured={configured}
                  />
                ) : (
                  <Link
                    href={authed ? "/upload" : "/sign-in"}
                    className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl border border-ink/15 bg-white text-sm font-medium hover:border-ink/30"
                  >
                    {authed ? "Go to upload" : tier.ctaLabel}
                  </Link>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
