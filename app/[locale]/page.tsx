import Link from "next/link";
import { notFound } from "next/navigation";
import { copy, locales, type Locale } from "@/lib/i18n";
import { WaitlistForm } from "@/components/waitlist-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroDemo } from "@/components/hero-demo";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseServer } from "@/lib/supabase-server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();
  const t = copy[locale];

  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const primaryHref = user ? "/upload" : `/sign-in?next=/upload`;
  const primaryLabel = user ? t.authedCta : t.primaryCta;

  return (
    <>
      <Header locale={locale} pathForLocaleSwitch={`/${locale}`} />
      <main>
        {/* Hero with demo */}
        <section className="mx-auto max-w-6xl px-6 pt-12 pb-12 md:pt-20">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 md:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{t.hero}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">{t.heroSub}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-ink px-6 text-base font-medium text-paper transition hover:bg-ink/85"
                >
                  {primaryLabel} →
                </Link>
                <a
                  href="#demo"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-ink/15 bg-white px-6 text-base font-medium hover:border-ink/30"
                >
                  {t.secondaryCta}
                </a>
              </div>
              <p className="mt-4 text-xs text-ink/50">
                Free for 3 documents per month. No credit card.
              </p>
            </div>
            <div id="demo" className="md:pl-4">
              <HeroDemo videoSrc="/demo.mp4" />
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-ink/10 bg-white">
          <div className="mx-auto grid max-w-5xl gap-6 px-6 py-8 sm:grid-cols-2 md:grid-cols-4">
            {t.stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-semibold tracking-tight">{s.number}</p>
                <p className="mt-1 text-sm text-ink/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What PaperLens actually finds */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">{t.promiseHeading}</h2>
          <p className="mb-8 max-w-2xl text-base text-ink/60">
            Concrete things, not generic promises. Every analysis returns these by default.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {t.promises.map((p, i) => (
              <div key={i} className="rounded-2xl border border-ink/10 bg-white p-5">
                <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live example */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight">{t.exampleHeading}</h2>
          <p className="mb-6 text-sm text-ink/60">{t.exampleSub}</p>
          <Card>
            <CardBody className="space-y-5 py-6">
              <div>
                <Badge tone="accent">Lease</Badge>
                <p className="mt-2 text-xs uppercase tracking-wider text-ink/50">
                  {t.exampleSummaryLabel}
                </p>
                <p className="mt-2 text-base leading-relaxed text-ink/85">
                  {locale === "en"
                    ? "12-month residential lease starting March 1. Monthly rent $2,150 with $4,300 security deposit. Auto-renews on month-to-month basis unless either party gives 60 days' written notice. Tenant pays utilities; landlord pays HOA. Pets allowed with $400 non-refundable fee."
                    : locale === "es"
                      ? "Contrato de arrendamiento de 12 meses desde el 1 de marzo. Renta mensual $2,150 con depósito de $4,300. Se renueva automáticamente mes a mes salvo aviso escrito con 60 días. El inquilino paga servicios; el propietario paga la HOA. Mascotas permitidas con tarifa no reembolsable de $400."
                      : locale === "pt-br"
                        ? "Contrato de aluguel residencial de 12 meses a partir de 1º de março. Aluguel mensal de US$ 2.150 com caução de US$ 4.300. Renovação automática mês a mês, exceto com aviso por escrito de 60 dias. Pets permitidos com taxa não reembolsável de US$ 400."
                        : locale === "de"
                          ? "12-monatiger Wohnungsmietvertrag ab dem 1. März. Monatliche Miete 2.150 $, Kaution 4.300 $. Verlängert sich automatisch monatlich, sofern keine Partei 60 Tage schriftlich kündigt. Haustiere mit nicht erstattbarer Gebühr von 400 $ erlaubt."
                          : "Bail d'habitation de 12 mois à partir du 1er mars. Loyer mensuel 2 150 $ avec dépôt de 4 300 $. Renouvellement mensuel tacite sauf préavis écrit de 60 jours. Animaux autorisés avec frais non remboursables de 400 $."}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50">{t.exampleRisksLabel}</p>
                <ul className="mt-3 space-y-3">
                  <li className="border-l-2 border-amber-300 pl-3">
                    <div className="flex items-center gap-2">
                      <Badge tone="medium">Medium</Badge>
                      <span className="text-sm font-medium">Auto-renewal at month-to-month</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/70">
                      Lease auto-renews unless 60 days notice given. Easy to forget; sets up an
                      involuntary stay-on past the year.
                    </p>
                  </li>
                  <li className="border-l-2 border-red-300 pl-3">
                    <div className="flex items-center gap-2">
                      <Badge tone="high">High</Badge>
                      <span className="text-sm font-medium">Non-refundable pet fee</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/70">
                      $400 fee not held in escrow and not returned even if the unit is left
                      undamaged. Restricted in California, Oregon, and others.
                    </p>
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Why Pro pays you back */}
        <section className="border-t border-ink/10 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight">{t.whyPayHeading}</h2>
            <p className="mb-8 max-w-2xl text-base text-ink/60">{t.whyPaySub}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {t.whyPayExamples.map((ex, i) => (
                <Card key={i}>
                  <CardBody className="space-y-3 py-5">
                    <Badge>{ex.docType}</Badge>
                    <p className="text-sm font-semibold tracking-tight">PaperLens finds:</p>
                    <p className="text-sm leading-relaxed text-ink/75">{ex.finds}</p>
                    <p className="border-t border-ink/5 pt-3 text-xs text-ink/55">
                      ↳ {ex.saved}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-xs text-ink/50">{t.whyPayCaveat}</p>
            <div className="mt-6">
              <Link
                href={primaryHref}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-ink px-5 text-sm font-medium text-paper transition hover:bg-ink/85"
              >
                {primaryLabel} →
              </Link>
            </div>
          </div>
        </section>

        {/* Doc-types row → links to PSEO pages */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">{t.docTypesHeading}</h2>
          <div className="flex flex-wrap gap-2">
            {t.docTypes.map((d) => (
              <Link
                key={d.slug}
                href={`/${locale}/explain/${d.slug}`}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium hover:border-ink/30"
              >
                {d.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Pricing teaser */}
        <section className="border-t border-ink/10 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight">{t.pricingHeading}</h2>
              <p className="mt-2 text-sm text-ink/60">{t.pricingSub}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardBody className="space-y-2">
                  <h3 className="text-base font-semibold">Free</h3>
                  <p className="text-2xl font-semibold">$0</p>
                  <p className="text-sm text-ink/60">3 documents per month</p>
                </CardBody>
              </Card>
              <Card className="border-accent/40 ring-2 ring-accent/20">
                <CardBody className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Pro</h3>
                    <Badge tone="accent">Most popular</Badge>
                  </div>
                  <p className="text-2xl font-semibold">
                    $6.99<span className="text-sm font-normal text-ink/50"> / mo</span>
                  </p>
                  <p className="text-sm text-ink/60">Unlimited documents + follow-up Q&A</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="space-y-2">
                  <h3 className="text-base font-semibold">Lifetime</h3>
                  <p className="text-2xl font-semibold">
                    $79<span className="text-sm font-normal text-ink/50"> once</span>
                  </p>
                  <p className="text-sm text-ink/60">All Pro features, no recurring billing</p>
                </CardBody>
              </Card>
            </div>
            <Link
              href="/pricing"
              className="mt-6 inline-block text-sm text-accent hover:underline"
            >
              {t.pricingSeeAll}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">{t.faqHeading}</h2>
          <div className="space-y-3">
            {t.faq.map((item, i) => (
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

        {/* Waitlist (locale rollout updates) */}
        <section className="border-t border-ink/10 bg-white">
          <div className="mx-auto max-w-2xl px-6 py-12">
            <h2 className="text-lg font-semibold tracking-tight">{t.waitlistHeading}</h2>
            <p className="mt-1 mb-4 text-sm text-ink/60">{t.waitlistSub}</p>
            <WaitlistForm cta={t.waitlistCta} placeholder={t.emailPlaceholder} locale={locale} />
          </div>
        </section>
      </main>
      <Footer />
      <div className="mx-auto max-w-5xl px-6 pb-8 text-xs text-ink/50">
        <p className="mb-2">{t.trust}</p>
        <p>{t.legal}</p>
      </div>
    </>
  );
}
