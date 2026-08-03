import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { copy, locales, type Locale } from "@/lib/i18n";
import { DOC_TYPE_LABEL, PSEO_TYPES, loadPseoPage, type PseoType } from "@/lib/pseo";
import { supabaseServer } from "@/lib/supabase-server";

export function generateStaticParams() {
  const params: { locale: string; type: string }[] = [];
  for (const locale of locales) {
    for (const type of PSEO_TYPES) {
      params.push({ locale, type });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, type: rawType } = await params;
  const locale = rawLocale as Locale;
  const type = rawType as PseoType;
  if (!locales.includes(locale) || !(PSEO_TYPES as readonly string[]).includes(type)) {
    return {};
  }
  const page = loadPseoPage(locale, type);
  if (!page) {
    const label = DOC_TYPE_LABEL[type][locale];
    return {
      title: `How to read a ${label} — PaperLens`,
      description: `Plain-language explanation of ${label} clauses, common risks, and questions to ask before signing.`,
    };
  }
  return {
    title: page.meta_title,
    description: page.meta_description,
    alternates: {
      canonical: `/${locale}/explain/${type}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/explain/${type}`]),
      ),
    },
  };
}

export default async function ExplainPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale: rawLocale, type: rawType } = await params;
  const locale = rawLocale as Locale;
  const type = rawType as PseoType;
  if (!locales.includes(locale) || !(PSEO_TYPES as readonly string[]).includes(type)) {
    notFound();
  }
  const page = loadPseoPage(locale, type);
  const t = copy[locale];
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const primaryHref = user ? "/upload" : "/sign-in?next=/upload";
  const primaryLabel = user ? t.authedCta : t.primaryCta;
  const docLabel = DOC_TYPE_LABEL[type][locale];

  // If we don't have a generated page yet, render a clean placeholder so the
  // route still works and Google still gets a useful page. The cron will fill
  // it in next run.
  const h1 = page?.h1 ?? `How to read a ${docLabel}`;
  const intro = page?.intro ??
    `${docLabel} documents are full of language designed by lawyers for lawyers. PaperLens reads yours in seconds and explains every clause in plain language. Below is a guide to what to look for, in ${locale === "en" ? "English" : "your language"}.`;
  const sections = page?.sections ?? [];
  const faq = page?.faq ?? t.faq;
  const ctaLabel = page?.cta_label ?? t.primaryCta;
  const related = page?.related_types ?? PSEO_TYPES.filter((p) => p !== type).slice(0, 4);

  // Schema.org Article + FAQPage JSON-LD
  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: h1,
    inLanguage: locale,
    author: { "@type": "Organization", name: "PaperLens" },
    publisher: {
      "@type": "Organization",
      name: "PaperLens",
      url: "https://printer-olive.vercel.app",
    },
  };
  const ldFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header locale={locale} pathForLocaleSwitch={`/${locale}/explain/${type}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }} />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav aria-label="breadcrumb" className="mb-4 text-xs text-ink/50">
          <Link href={`/${locale}`} className="hover:text-ink">
            PaperLens
          </Link>
          <span className="mx-1">/</span>
          <span>{docLabel}</span>
        </nav>

        <Badge tone="accent">{docLabel}</Badge>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{h1}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">{intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-ink px-6 text-base font-medium text-paper transition hover:bg-ink/85"
          >
            {ctaLabel} →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-ink/15 bg-white px-6 text-base font-medium hover:border-ink/30"
          >
            {t.secondaryCta}
          </Link>
        </div>

        {sections.length > 0 && (
          <section className="mt-12 space-y-8">
            {sections.map((s, i) => (
              <article key={i}>
                <h2 className="mb-3 text-2xl font-semibold tracking-tight">{s.heading}</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-ink/85">{s.body}</p>
              </article>
            ))}
          </section>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">{t.faqHeading}</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-ink/10 bg-white p-5 open:bg-ink/[0.02]"
              >
                <summary className="cursor-pointer list-none text-base font-medium">
                  <span className="flex items-center justify-between">
                    {item.q}
                    <span className="ml-3 text-ink/40 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 text-base font-semibold">Related explainers</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r}
                  href={`/${locale}/explain/${r}`}
                  className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium hover:border-ink/30"
                >
                  {DOC_TYPE_LABEL[r][locale]}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <h3 className="text-lg font-semibold">{t.exampleHeading}</h3>
          <p className="mt-1 text-sm text-ink/70">{t.exampleSub}</p>
          <Link
            href={primaryHref}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-5 text-sm font-medium text-white hover:bg-accent/90"
          >
            {primaryLabel} →
          </Link>
        </section>

        <Card className="mt-12">
          <CardBody className="text-xs text-ink/60">
            {t.legal}
          </CardBody>
        </Card>
      </main>
      <Footer />
    </>
  );
}
