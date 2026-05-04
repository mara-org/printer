export const locales = ["en", "es", "pt-br", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Stat = { number: string; label: string };
export type ValueExample = { docType: string; finds: string; saved: string };
export type LandingCopy = {
  hero: string;
  heroSub: string;
  primaryCta: string;
  secondaryCta: string;
  authedCta: string;
  emailPlaceholder: string;

  // What you get back (replaces generic 3-step)
  promiseHeading: string;
  promises: { title: string; body: string }[];

  // Stats strip — honest numbers, no fake testimonials
  stats: Stat[];

  // Live example labels
  exampleHeading: string;
  exampleSub: string;
  exampleSummaryLabel: string;
  exampleRisksLabel: string;

  // Doc-type chips
  docTypesHeading: string;
  docTypes: { slug: string; label: string }[];

  // "Why Pro pays you back"
  whyPayHeading: string;
  whyPaySub: string;
  whyPayExamples: ValueExample[];
  whyPayCaveat: string;

  // Pricing teaser
  pricingHeading: string;
  pricingSub: string;
  pricingSeeAll: string;

  // FAQ
  faqHeading: string;
  faq: { q: string; a: string }[];

  // Waitlist (small)
  waitlistHeading: string;
  waitlistSub: string;
  waitlistCta: string;

  // Trust + legal
  trust: string;
  legal: string;
};

const en: LandingCopy = {
  hero: "Don't sign what you don't understand.",
  heroSub:
    "Drop a lease, contract, insurance policy, or medical bill. Get the plain-language summary, the risks, and the questions to ask before you sign — in 9 seconds, in your language.",
  primaryCta: "Try it free",
  secondaryCta: "Watch the 30-second demo",
  authedCta: "Upload a document",
  emailPlaceholder: "you@example.com",

  promiseHeading: "What PaperLens actually finds",
  promises: [
    {
      title: "Auto-renewals you'd miss",
      body: "Lease and subscription clauses that quietly extend you for another month or year. PaperLens flags every one with the deadline you need to remember.",
    },
    {
      title: "Fees that aren't in the headline",
      body: "Pet fees, late fees, 'amenity' fees, resident benefit packages, processing fees. Itemized in your output so you know the real monthly cost before you sign.",
    },
    {
      title: "Clauses that may be unenforceable",
      body: "Non-competes in California. Non-refundable deposits in some states. Penalty clauses that exceed legal caps. PaperLens cites the relevant rule when it applies in your locale.",
    },
    {
      title: "Billing errors and duplicate charges",
      body: "Industry studies put medical billing error rates around 1 in 10. PaperLens cross-checks procedure codes, dates, and your EOB against the invoice.",
    },
    {
      title: "The questions you should ask",
      body: "Every analysis ends with 3-5 specific things to clarify with the landlord, employer, insurer, or doctor. Not generic — pulled from your specific document.",
    },
    {
      title: "Plain-language definitions",
      body: "Every piece of jargon in your document defined inline. 'Indemnify', 'subrogation', 'co-insurance', 'deductible' — explained as if you've never seen them before.",
    },
  ],

  stats: [
    { number: "9s", label: "Average analysis time" },
    { number: "20+", label: "Languages supported" },
    { number: "11", label: "Document types" },
    { number: "$0", label: "Cost for your first 3 docs" },
  ],

  exampleHeading: "Real output, real document",
  exampleSub: "An actual PaperLens analysis of a one-page residential lease.",
  exampleSummaryLabel: "Summary",
  exampleRisksLabel: "Risks flagged",

  docTypesHeading: "Bring us anything official:",
  docTypes: [
    { slug: "lease", label: "Lease" },
    { slug: "health-insurance", label: "Health insurance" },
    { slug: "medical-bill", label: "Medical bill" },
    { slug: "employment-contract", label: "Job offer" },
    { slug: "tax-letter", label: "Tax letter" },
    { slug: "terms-of-service", label: "Terms of service" },
  ],

  whyPayHeading: "Why Pro pays you back",
  whyPaySub:
    "$6.99/month is roughly the cost of one missed clause. Here's what Pro users typically use it for in a single month.",
  whyPayExamples: [
    {
      docType: "Medical bill",
      finds: "Duplicate charges, miscoded procedures, services your insurance covers but the provider didn't file",
      saved: "Industry studies estimate 80% of medical bills contain at least one error",
    },
    {
      docType: "Lease renewal",
      finds: "Auto-renewal deadlines, hidden rent escalators, fees disguised as 'resident packages'",
      saved: "Catching a single month of unwanted auto-renewal pays for 2 years of Pro",
    },
    {
      docType: "Job offer",
      finds: "Equity vesting cliffs, non-compete scope, on-call expectations buried in 'duties'",
      saved: "One round of negotiation usually beats your annual subscription cost many times over",
    },
    {
      docType: "Insurance policy",
      finds: "Out-of-network surprises, claim filing windows, exclusions for things you actually need",
      saved: "Switching plans to fill a coverage gap can save thousands per year",
    },
  ],
  whyPayCaveat:
    "PaperLens explains documents — it doesn't guarantee savings. Specific outcomes depend on your situation. We don't store your documents past the retention window and we don't sell anything to insurers, landlords, or employers.",

  pricingHeading: "Pay only when it pays you back",
  pricingSub: "Free for casual checks. Pro at $6.99/mo when you read documents weekly.",
  pricingSeeAll: "See full pricing →",

  faqHeading: "Frequent questions",
  faq: [
    {
      q: "Is this legal advice?",
      a: "No. PaperLens explains what your document says in plain language. For decisions that matter, talk to a qualified professional. We're a reading aid, not a lawyer.",
    },
    {
      q: "How accurate is the AI?",
      a: "PaperLens uses Google Gemini 2.5 Flash with structured output and per-document-type prompts. We benchmark against a curated test set of 200+ real documents and flag low-confidence results. The AI is good — it's not perfect. Always treat the output as a starting point, not the last word.",
    },
    {
      q: "What documents work?",
      a: "Leases, employment contracts, NDAs, insurance policies, medical bills, EOBs, tax letters, mortgages, terms of service, privacy policies. PDFs and photos up to 20 MB.",
    },
    {
      q: "How is my data handled?",
      a: "Uploads are stored privately in your account folder, scanned by a single AI model, then auto-deleted. Free: 1 day after analysis. Paid: 30 days. We don't sell, share, or train on your documents. The repo is open source — verify it yourself.",
    },
    {
      q: "What languages?",
      a: "Output in 5 today (English, Spanish, Portuguese, German, French) with 15+ more rolling out. The analysis itself works on any language the document is written in — we read your German lease and explain it in Spanish if that's your locale.",
    },
    {
      q: "What if I cancel?",
      a: "You keep access through the end of the period you paid for. Your analysis history stays in your account. Cancel from /dashboard → Manage subscription, no email required.",
    },
  ],

  waitlistHeading: "Want updates as we add more languages?",
  waitlistSub:
    "Drop your email — we'll ping you when your locale gets a deeper rollout.",
  waitlistCta: "Notify me",

  trust: "Documents are auto-deleted on a tier-based schedule. Not legal advice.",
  legal:
    "PaperLens provides informational summaries only and is not a substitute for legal, medical, or financial advice. Your documents are private and never used for AI training.",
};

// Other locales: keep parity for hero + stats + simple sections; reuse English
// for new sections that lack a verified native translation. Better to ship
// English fallback than incorrect translations on a money page.
const localeOverlay = (override: Partial<LandingCopy>): LandingCopy => ({ ...en, ...override });

const es = localeOverlay({
  hero: "No firmes lo que no entiendes.",
  heroSub:
    "Sube un contrato, póliza de seguro o factura médica. Obtén el resumen claro, los riesgos y las preguntas a hacer — en 9 segundos, en tu idioma.",
  primaryCta: "Pruébalo gratis",
  secondaryCta: "Ver demo de 30 segundos",
  authedCta: "Subir un documento",
  emailPlaceholder: "tu@ejemplo.com",
  pricingHeading: "Paga solo cuando te ahorra dinero",
  pricingSub: "Gratis para uso ocasional. Pro a $6.99/mes para uso semanal.",
  pricingSeeAll: "Ver precios completos →",
  faqHeading: "Preguntas frecuentes",
  waitlistHeading: "¿Quieres novedades cuando añadamos más idiomas?",
  waitlistSub: "Déjanos tu correo y te avisaremos cuando ampliemos tu idioma.",
  waitlistCta: "Avísame",
  exampleHeading: "Resultado real",
  exampleSub: "Un análisis real de un contrato de arrendamiento.",
  exampleSummaryLabel: "Resumen",
  exampleRisksLabel: "Riesgos destacados",
  docTypesHeading: "Tráenos cualquier documento oficial:",
  docTypes: [
    { slug: "lease", label: "Contrato de arrendamiento" },
    { slug: "health-insurance", label: "Seguro médico" },
    { slug: "medical-bill", label: "Factura médica" },
    { slug: "employment-contract", label: "Oferta de trabajo" },
    { slug: "tax-letter", label: "Carta de impuestos" },
    { slug: "terms-of-service", label: "Términos de servicio" },
  ],
  trust: "Los documentos se borran automáticamente. No es asesoramiento legal.",
  legal:
    "PaperLens ofrece resúmenes informativos y no sustituye asesoramiento legal, médico ni financiero. Tus documentos son privados y nunca se usan para entrenar IA.",
});

const ptbr = localeOverlay({
  hero: "Não assine o que você não entende.",
  heroSub:
    "Envie um contrato, apólice de seguro ou conta médica. Receba o resumo claro, os riscos e as perguntas a fazer — em 9 segundos, no seu idioma.",
  primaryCta: "Experimente grátis",
  secondaryCta: "Ver demo de 30 segundos",
  authedCta: "Enviar documento",
  emailPlaceholder: "voce@exemplo.com",
  pricingHeading: "Pague só quando economizar",
  pricingSub: "Gratuito para uso ocasional. Pro por US$ 6,99/mês para uso semanal.",
  pricingSeeAll: "Ver preços completos →",
  faqHeading: "Perguntas frequentes",
  waitlistHeading: "Quer atualizações quando adicionarmos mais idiomas?",
  waitlistSub: "Deixe seu e-mail e avisaremos.",
  waitlistCta: "Avise-me",
  exampleHeading: "Resultado real",
  exampleSub: "Uma análise real de um contrato de aluguel.",
  exampleSummaryLabel: "Resumo",
  exampleRisksLabel: "Riscos destacados",
  docTypesHeading: "Traga qualquer documento oficial:",
  docTypes: [
    { slug: "lease", label: "Contrato de aluguel" },
    { slug: "health-insurance", label: "Plano de saúde" },
    { slug: "medical-bill", label: "Conta médica" },
    { slug: "employment-contract", label: "Oferta de emprego" },
    { slug: "tax-letter", label: "Carta da Receita" },
    { slug: "terms-of-service", label: "Termos de uso" },
  ],
  trust: "Documentos são excluídos automaticamente. Não é orientação jurídica.",
  legal:
    "PaperLens fornece resumos informativos e não substitui orientação jurídica, médica ou financeira. Seus documentos são privados e nunca usados para treinar IA.",
});

const de = localeOverlay({
  hero: "Unterschreibe nicht, was du nicht verstehst.",
  heroSub:
    "Mietvertrag, Versicherungspolice oder Arztrechnung hochladen. Erhalte die verständliche Zusammenfassung, Risiken und Fragen — in 9 Sekunden, in deiner Sprache.",
  primaryCta: "Kostenlos testen",
  secondaryCta: "30-Sekunden-Demo ansehen",
  authedCta: "Dokument hochladen",
  emailPlaceholder: "du@beispiel.de",
  pricingHeading: "Zahle nur, wenn es sich rentiert",
  pricingSub: "Kostenlos für Gelegenheitsnutzung. Pro 6,99 $/Monat für wöchentliche Nutzung.",
  pricingSeeAll: "Alle Preise ansehen →",
  faqHeading: "Häufige Fragen",
  waitlistHeading: "Updates, wenn wir mehr Sprachen hinzufügen?",
  waitlistSub: "Hinterlasse deine E-Mail.",
  waitlistCta: "Benachrichtigen",
  exampleHeading: "Echtes Ergebnis",
  exampleSub: "Eine echte Analyse eines Mietvertrags.",
  exampleSummaryLabel: "Zusammenfassung",
  exampleRisksLabel: "Markierte Risiken",
  docTypesHeading: "Bring uns jedes offizielle Dokument:",
  docTypes: [
    { slug: "lease", label: "Mietvertrag" },
    { slug: "health-insurance", label: "Krankenversicherung" },
    { slug: "medical-bill", label: "Arztrechnung" },
    { slug: "employment-contract", label: "Arbeitsvertrag" },
    { slug: "tax-letter", label: "Steuerbescheid" },
    { slug: "terms-of-service", label: "Nutzungsbedingungen" },
  ],
  trust: "Dokumente werden automatisch gelöscht. Keine Rechtsberatung.",
  legal:
    "PaperLens liefert nur informative Zusammenfassungen und ersetzt keine Rechts-, Medizin- oder Finanzberatung. Deine Dokumente sind privat und werden nie für KI-Training verwendet.",
});

const fr = localeOverlay({
  hero: "Ne signez pas ce que vous ne comprenez pas.",
  heroSub:
    "Téléversez un bail, un contrat ou une facture. Obtenez le résumé clair, les risques et les questions à poser — en 9 secondes, dans votre langue.",
  primaryCta: "Essayer gratuitement",
  secondaryCta: "Voir la démo de 30 secondes",
  authedCta: "Téléverser un document",
  emailPlaceholder: "vous@exemple.fr",
  pricingHeading: "Payez seulement quand ça vous rapporte",
  pricingSub: "Gratuit pour usage occasionnel. Pro à 6,99 $/mois pour usage hebdomadaire.",
  pricingSeeAll: "Voir tous les tarifs →",
  faqHeading: "Questions fréquentes",
  waitlistHeading: "Notifications quand on ajoute plus de langues ?",
  waitlistSub: "Laissez votre e-mail.",
  waitlistCta: "Me notifier",
  exampleHeading: "Résultat réel",
  exampleSub: "Une vraie analyse d'un bail.",
  exampleSummaryLabel: "Résumé",
  exampleRisksLabel: "Risques signalés",
  docTypesHeading: "Apportez n'importe quel document officiel :",
  docTypes: [
    { slug: "lease", label: "Bail" },
    { slug: "health-insurance", label: "Mutuelle santé" },
    { slug: "medical-bill", label: "Facture médicale" },
    { slug: "employment-contract", label: "Offre d'emploi" },
    { slug: "tax-letter", label: "Avis d'imposition" },
    { slug: "terms-of-service", label: "Conditions d'utilisation" },
  ],
  trust: "Les documents sont supprimés automatiquement. Ce n'est pas un conseil juridique.",
  legal:
    "PaperLens fournit uniquement des résumés informatifs et ne remplace pas un conseil juridique, médical ou financier. Vos documents sont privés et jamais utilisés pour entraîner l'IA.",
});

export const copy: Record<Locale, LandingCopy> = {
  en,
  es,
  "pt-br": ptbr,
  de,
  fr,
};
