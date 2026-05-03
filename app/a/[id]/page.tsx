import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseServer } from "@/lib/supabase-server";
import { AnalysisSchema } from "@/lib/ai/types";
import type { z } from "zod";

type Risk = z.infer<typeof AnalysisSchema>["risks"][number];
type KeyTerm = z.infer<typeof AnalysisSchema>["key_terms"][number];

const SEVERITY_LABEL: Record<Risk["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const DOC_TYPE_LABEL: Record<string, string> = {
  lease: "Lease / Rental",
  employment_contract: "Employment contract",
  nda: "Non-disclosure agreement",
  health_insurance: "Health insurance",
  auto_insurance: "Auto insurance",
  life_insurance: "Life insurance",
  medical_bill: "Medical bill",
  eob: "Explanation of benefits",
  tax_letter: "Tax letter",
  mortgage: "Mortgage",
  terms_of_service: "Terms of service",
  privacy_policy: "Privacy policy",
  other: "Document",
};

export default async function AnalysisPage({ params }: { params: { id: string } }) {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) notFound();

  const { data: doc } = await sb
    .from("documents")
    .select("id, status, detected_type, original_filename, mime_type, created_at")
    .eq("id", params.id)
    .maybeSingle();

  if (!doc) notFound();

  const { data: row } = await sb
    .from("analyses")
    .select("summary, risks, questions, key_terms, output_locale, model")
    .eq("document_id", params.id)
    .maybeSingle();

  // Show a "still processing" state if the row isn't ready yet.
  if (!row) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-12">
          <Card>
            <CardBody className="py-16 text-center">
              <p className="text-sm text-ink/60">
                {doc.status === "failed"
                  ? "This analysis could not be completed."
                  : "We're still working on this. Refresh in a moment."}
              </p>
              <Link href="/dashboard" className="mt-4 inline-block text-sm text-accent hover:underline">
                Back to dashboard
              </Link>
            </CardBody>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const risks = (row.risks as Risk[] | null) ?? [];
  const questions = (row.questions as string[] | null) ?? [];
  const keyTerms = (row.key_terms as KeyTerm[] | null) ?? [];
  const docTypeLabel =
    DOC_TYPE_LABEL[doc.detected_type ?? "other"] ?? "Document";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge tone="accent">{docTypeLabel}</Badge>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {doc.original_filename ?? "Document analysis"}
            </h1>
            <p className="mt-1 text-sm text-ink/50">
              {new Date(doc.created_at).toLocaleString()} · {row.output_locale}
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-ink/15 bg-white px-5 text-base font-medium transition hover:border-ink/30"
          >
            Analyze another
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardBody className="prose prose-sm max-w-none whitespace-pre-line text-base leading-relaxed text-ink/85">
            {row.summary ?? "No summary available."}
          </CardBody>
        </Card>

        {risks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Risks flagged</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4">
                {risks.map((r, i) => (
                  <li key={i} className="border-l-2 border-ink/10 pl-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={r.severity}>{SEVERITY_LABEL[r.severity]}</Badge>
                      <span className="font-medium">{r.title}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink/75">{r.explanation}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Questions to ask before you sign</CardTitle>
            </CardHeader>
            <CardBody>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/85">
                {questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </CardBody>
          </Card>
        )}

        {keyTerms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key terms in this document</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="space-y-3 text-sm">
                {keyTerms.map((kt, i) => (
                  <div key={i}>
                    <dt className="font-medium">{kt.term}</dt>
                    <dd className="mt-0.5 text-ink/70">{kt.definition}</dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>
        )}

        <p className="rounded-xl border border-ink/10 bg-ink/[0.02] p-4 text-xs text-ink/60">
          PaperLens explains what your document says. It is <strong>not</strong> legal, medical,
          tax, or financial advice. For decisions that matter, talk to a qualified professional.
        </p>
      </main>
      <Footer />
    </>
  );
}
