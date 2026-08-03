import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingCTA } from "@/components/pricing-cta";
import { cn } from "@/lib/utils";
import { supabaseServer } from "@/lib/supabase-server";
import { isPolarConfigured } from "@/lib/polar";

export const metadata = {
  title: "Pricing — PaperLens",
  description:
    "PaperLens plans. Free for 3 docs/month; Pro at $6.99/month for unlimited; Power and Lifetime tiers.",
};

type Tier = {
  name: string;
  product?: "pro" | "power" | "lifetime";
  price: string;
  period: string;
  highlight?: boolean;
  features: string[];
  ctaLabel: string;
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
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
    product: "pro",
    price: "$6.99",
    period: "/ month",
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
    product: "power",
    price: "$14.99",
    period: "/ month",
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
    product: "lifetime",
    price: "$79",
    period: "one time",
    features: ["All Pro features", "No recurring billing, ever", "Pay once, use forever"],
    ctaLabel: "Buy Lifetime",
  },
];

export default async function PricingPage() {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const configured = isPolarConfigured();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Simple pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Free for the casual case. Pro when you read documents weekly. Power for the
            heavy users. All tiers use the same Gemini 2.5 Flash analysis engine.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
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
                      <span className="text-3xl font-semibold tracking-tight">{tier.price}</span>
                      <span className="text-sm text-ink/50">{tier.period}</span>
                    </div>
                  </div>
                  {tier.highlight && <Badge tone="accent">Most popular</Badge>}
                </div>

                <ul className="space-y-2 text-sm text-ink/80">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {tier.product ? (
                  <PricingCTA
                    product={tier.product}
                    label={tier.ctaLabel}
                    highlight={tier.highlight}
                    authed={Boolean(user)}
                    configured={configured}
                  />
                ) : (
                  <a
                    href={user ? "/upload" : "/sign-in"}
                    className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl border border-ink/15 bg-white text-sm font-medium hover:border-ink/30"
                  >
                    {user ? "Go to upload" : tier.ctaLabel}
                  </a>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink/50">
          Payments processed by Polar.sh as Merchant of Record. VAT/sales tax handled in 80+
          countries. Cancel anytime.
        </p>
      </main>
      <Footer />
    </>
  );
}
