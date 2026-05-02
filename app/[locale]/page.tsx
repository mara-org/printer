import { notFound } from "next/navigation";
import { copy, locales, type Locale } from "@/lib/i18n";
import { WaitlistForm } from "@/components/waitlist-form";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();
  const t = copy[locale];

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">PaperLens</span>
        <nav className="flex gap-2 text-sm text-ink/60">
          {locales.map((l) => (
            <a
              key={l}
              href={`/${l}`}
              className={l === locale ? "font-semibold text-ink" : "hover:text-ink"}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </nav>
      </header>

      <section className="mb-14">
        <h1 className="mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
          {t.hero}
        </h1>
        <p className="max-w-xl text-lg text-ink/70">{t.sub}</p>
      </section>

      <section className="mb-14">
        <WaitlistForm cta={t.cta} placeholder={t.emailPlaceholder} locale={locale} />
      </section>

      <section className="mb-14 grid gap-6 md:grid-cols-3">
        {t.steps.map((step, i) => (
          <div key={i} className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
              {i + 1}
            </div>
            <p className="text-sm text-ink/80">{step}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-ink/10 pt-8 text-xs text-ink/50">
        <p className="mb-2">{t.trust}</p>
        <p>{t.legal}</p>
      </footer>
    </main>
  );
}
