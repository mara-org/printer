import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PricingTiers } from "@/components/pricing-tiers";
import { supabaseServer } from "@/lib/supabase-server";
import { isPolarConfigured } from "@/lib/polar";

export const metadata = {
  title: "Pricing — PaperLens",
  description:
    "PaperLens plans. Free for 3 docs/month; Pro at $6.99/month (or $67/year, save 20%); Power and Lifetime tiers.",
};

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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Simple pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Free for the casual case. Pro when you read documents weekly. Power for the
            heavy users. All tiers use the same Gemini 2.5 Flash analysis engine.
          </p>
        </div>

        <PricingTiers authed={Boolean(user)} configured={configured} />

        <p className="mt-10 text-center text-sm text-ink/50">
          Payments processed by Polar.sh as Merchant of Record. VAT/sales tax handled in
          80+ countries. Yearly plans save 20%. Cancel anytime.
        </p>
      </main>
      <Footer />
    </>
  );
}
