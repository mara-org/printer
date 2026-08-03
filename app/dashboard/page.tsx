import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { supabaseServer } from "@/lib/supabase-server";
import { isPolarConfigured } from "@/lib/polar";

export const metadata = {
  title: "Dashboard — PaperLens",
  description: "Your document analyses.",
};

const DOC_TYPE_LABEL: Record<string, string> = {
  lease: "Lease / Rental",
  employment_contract: "Employment contract",
  nda: "NDA",
  health_insurance: "Health insurance",
  auto_insurance: "Auto insurance",
  life_insurance: "Life insurance",
  medical_bill: "Medical bill",
  eob: "EOB",
  tax_letter: "Tax letter",
  mortgage: "Mortgage",
  terms_of_service: "Terms of service",
  privacy_policy: "Privacy policy",
  other: "Document",
};

const STATUS_TONE: Record<string, "default" | "low" | "medium" | "high" | "accent"> = {
  ready: "low",
  analyzing: "accent",
  pending: "default",
  failed: "high",
};

export default async function DashboardPage() {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: docs }, { data: sub }] = await Promise.all([
    sb
      .from("profiles")
      .select("free_docs_used, free_docs_reset_at")
      .eq("id", user.id)
      .maybeSingle(),
    sb
      .from("documents")
      .select("id, original_filename, mime_type, status, detected_type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    sb
      .from("subscriptions")
      .select("tier, status, current_period_end, cancel_at_period_end")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const used = profile?.free_docs_used ?? 0;
  const remaining = Math.max(0, 3 - used);
  const resetAt = profile?.free_docs_reset_at
    ? new Date(profile.free_docs_reset_at).toLocaleDateString()
    : null;
  const tier = sub?.tier ?? "free";
  const isPaid = tier !== "free" && (sub?.status === "active" || sub?.status === "trialing");
  const polarOn = isPolarConfigured();
  const tierLabel: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    power: "Power",
    lifetime: "Lifetime",
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Your analyses</h1>
              <Badge tone={isPaid ? "accent" : "default"}>{tierLabel[tier]}</Badge>
            </div>
            <p className="mt-1 text-sm text-ink/60">
              {isPaid ? (
                <>Unlimited analyses on the {tierLabel[tier]} plan.</>
              ) : remaining > 0 ? (
                <>
                  {remaining} of 3 free analyses remaining this month
                  {resetAt ? ` · resets ${resetAt}` : ""}
                </>
              ) : (
                <>
                  Free quota used.{" "}
                  <Link href="/pricing" className="text-accent hover:underline">
                    Upgrade for unlimited
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPaid && polarOn && <ManageSubscriptionButton />}
            <Link
              href="/upload"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-ink px-5 text-base font-medium text-paper transition hover:bg-ink/85"
            >
              New analysis
            </Link>
          </div>
        </div>

        {!docs || docs.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <p className="text-sm text-ink/60">
                No analyses yet.{" "}
                <Link href="/upload" className="text-accent hover:underline">
                  Upload your first document
                </Link>
                .
              </p>
            </CardBody>
          </Card>
        ) : (
          <ul className="space-y-3">
            {docs.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/a/${d.id}`}
                  className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-5 py-4 transition hover:border-ink/30"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {d.original_filename ?? "Document"}
                    </p>
                    <p className="text-xs text-ink/50">
                      {DOC_TYPE_LABEL[d.detected_type ?? "other"] ?? "Document"} ·{" "}
                      {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[d.status] ?? "default"}>{d.status}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
