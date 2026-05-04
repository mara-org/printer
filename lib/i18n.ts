export const locales = ["en", "es", "pt-br", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type LandingCopy = {
  hero: string;
  sub: string;
  primaryCta: string;
  secondaryCta: string;
  authedCta: string;
  emailPlaceholder: string;
  steps: [string, string, string];
  trust: string;
  legal: string;
  // New sections
  trustStrip: [string, string, string];
  exampleHeading: string;
  exampleSub: string;
  exampleSummaryLabel: string;
  exampleRisksLabel: string;
  docTypesHeading: string;
  docTypes: { slug: string; label: string }[];
  pricingHeading: string;
  pricingSub: string;
  pricingSeeAll: string;
  faqHeading: string;
  faq: { q: string; a: string }[];
  waitlistHeading: string;
  waitlistSub: string;
  waitlistCta: string;
};

const en: LandingCopy = {
  hero: "Understand any document.",
  sub: "Snap a lease, contract, insurance policy, or medical bill. Get a plain-language explanation, with risks flagged — in your language.",
  primaryCta: "Try it free",
  secondaryCta: "See pricing",
  authedCta: "Upload a document",
  emailPlaceholder: "you@example.com",
  steps: [
    "Snap a photo or upload a PDF",
    "Read the plain-language summary",
    "Ask follow-up questions",
  ],
  trust: "Documents are auto-deleted after 30 days. Not legal advice.",
  legal:
    "PaperLens provides informational summaries only and is not a substitute for legal, medical, or financial advice.",
  trustStrip: [
    "Privacy by default — uploads auto-deleted",
    "20+ languages — explained in yours",
    "Free for 3 documents per month",
  ],
  exampleHeading: "What you get back",
  exampleSub: "A real PaperLens analysis of a one-page residential lease, in 9 seconds.",
  exampleSummaryLabel: "Summary",
  exampleRisksLabel: "Risks flagged",
  docTypesHeading: "PaperLens reads:",
  docTypes: [
    { slug: "lease", label: "Lease" },
    { slug: "health-insurance", label: "Health insurance" },
    { slug: "medical-bill", label: "Medical bill" },
    { slug: "employment-contract", label: "Job offer" },
    { slug: "tax-letter", label: "Tax letter" },
    { slug: "terms-of-service", label: "Terms of service" },
  ],
  pricingHeading: "Pay only when it pays you back",
  pricingSub: "Free for casual checks. Pro at $6.99/mo when you read documents weekly.",
  pricingSeeAll: "See full pricing →",
  faqHeading: "Frequent questions",
  faq: [
    {
      q: "Is this legal advice?",
      a: "No. PaperLens explains what your document says in plain language. For decisions that matter, talk to a qualified professional.",
    },
    {
      q: "What documents work?",
      a: "Leases, employment contracts, NDAs, insurance policies, medical bills, EOBs, tax letters, mortgages, terms of service, and privacy policies. PDFs and photos up to 20 MB.",
    },
    {
      q: "How is my data handled?",
      a: "Uploads are stored privately in your account folder, scanned by a single AI model, then auto-deleted. Free tier: 1 day after analysis. Paid: 30 days. You can delete sooner.",
    },
    {
      q: "What languages?",
      a: "5 today (English, Spanish, Portuguese, German, French) with 15+ more rolling out. The analysis itself works on any language the document is written in.",
    },
  ],
  waitlistHeading: "Want updates as we add more languages?",
  waitlistSub:
    "Drop your email — we'll ping you when your locale gets a deeper rollout.",
  waitlistCta: "Notify me",
};

const es: LandingCopy = {
  hero: "Entiende cualquier documento.",
  sub: "Saca una foto a un contrato, póliza de seguro o factura médica. Obtén una explicación clara, con los riesgos resaltados — en tu idioma.",
  primaryCta: "Pruébalo gratis",
  secondaryCta: "Ver precios",
  authedCta: "Subir un documento",
  emailPlaceholder: "tu@ejemplo.com",
  steps: [
    "Toma una foto o sube un PDF",
    "Lee el resumen en lenguaje claro",
    "Haz preguntas de seguimiento",
  ],
  trust: "Los documentos se borran automáticamente después de 30 días. No es asesoramiento legal.",
  legal:
    "PaperLens ofrece resúmenes informativos y no sustituye asesoramiento legal, médico ni financiero.",
  trustStrip: [
    "Privacidad por defecto — borrado automático",
    "20+ idiomas — explicado en el tuyo",
    "Gratis 3 documentos al mes",
  ],
  exampleHeading: "Lo que recibes",
  exampleSub: "Un análisis real de un contrato de arrendamiento, en 9 segundos.",
  exampleSummaryLabel: "Resumen",
  exampleRisksLabel: "Riesgos destacados",
  docTypesHeading: "PaperLens entiende:",
  docTypes: [
    { slug: "lease", label: "Contrato de arrendamiento" },
    { slug: "health-insurance", label: "Seguro médico" },
    { slug: "medical-bill", label: "Factura médica" },
    { slug: "employment-contract", label: "Oferta de trabajo" },
    { slug: "tax-letter", label: "Carta de impuestos" },
    { slug: "terms-of-service", label: "Términos de servicio" },
  ],
  pricingHeading: "Paga solo cuando te ahorra dinero",
  pricingSub: "Gratis para uso ocasional. Pro a $6.99/mes para uso semanal.",
  pricingSeeAll: "Ver precios completos →",
  faqHeading: "Preguntas frecuentes",
  faq: [
    {
      q: "¿Esto es asesoramiento legal?",
      a: "No. PaperLens explica lo que dice tu documento en lenguaje claro. Para decisiones importantes, habla con un profesional cualificado.",
    },
    {
      q: "¿Qué documentos funcionan?",
      a: "Contratos de arrendamiento, ofertas de trabajo, NDAs, pólizas de seguro, facturas médicas, EOBs, cartas fiscales, hipotecas, términos de servicio y políticas de privacidad. PDFs y fotos hasta 20 MB.",
    },
    {
      q: "¿Cómo se trata mi información?",
      a: "Las subidas se guardan en tu carpeta privada, las analiza un único modelo de IA, y luego se borran. Plan gratis: 1 día tras el análisis. De pago: 30 días.",
    },
    {
      q: "¿En qué idiomas?",
      a: "5 hoy (inglés, español, portugués, alemán, francés) con más de 15 en camino. El análisis funciona en cualquier idioma del documento.",
    },
  ],
  waitlistHeading: "¿Quieres novedades cuando añadamos más idiomas?",
  waitlistSub: "Déjanos tu correo y te avisaremos cuando ampliemos tu idioma.",
  waitlistCta: "Avísame",
};

const ptbr: LandingCopy = {
  hero: "Entenda qualquer documento.",
  sub: "Tire uma foto de um contrato, apólice de seguro ou conta médica. Receba uma explicação clara, com riscos destacados — no seu idioma.",
  primaryCta: "Experimente grátis",
  secondaryCta: "Ver preços",
  authedCta: "Enviar documento",
  emailPlaceholder: "voce@exemplo.com",
  steps: [
    "Tire uma foto ou envie um PDF",
    "Leia o resumo em linguagem clara",
    "Faça perguntas de acompanhamento",
  ],
  trust: "Documentos são excluídos automaticamente após 30 dias. Não é orientação jurídica.",
  legal:
    "PaperLens fornece resumos informativos e não substitui orientação jurídica, médica ou financeira.",
  trustStrip: [
    "Privacidade padrão — exclusão automática",
    "20+ idiomas — explicado no seu",
    "Gratuito para 3 documentos por mês",
  ],
  exampleHeading: "O que você recebe",
  exampleSub: "Uma análise real de um contrato de aluguel, em 9 segundos.",
  exampleSummaryLabel: "Resumo",
  exampleRisksLabel: "Riscos destacados",
  docTypesHeading: "PaperLens entende:",
  docTypes: [
    { slug: "lease", label: "Contrato de aluguel" },
    { slug: "health-insurance", label: "Plano de saúde" },
    { slug: "medical-bill", label: "Conta médica" },
    { slug: "employment-contract", label: "Oferta de emprego" },
    { slug: "tax-letter", label: "Carta da Receita" },
    { slug: "terms-of-service", label: "Termos de uso" },
  ],
  pricingHeading: "Pague só quando economizar",
  pricingSub: "Gratuito para uso ocasional. Pro por US$ 6,99/mês para uso semanal.",
  pricingSeeAll: "Ver preços completos →",
  faqHeading: "Perguntas frequentes",
  faq: [
    {
      q: "Isto é orientação jurídica?",
      a: "Não. PaperLens explica o que está no documento em linguagem clara. Para decisões importantes, fale com um profissional qualificado.",
    },
    {
      q: "Que documentos funcionam?",
      a: "Aluguel, oferta de emprego, NDAs, planos, contas médicas, cartas da Receita, hipotecas, termos de uso e políticas de privacidade. PDFs e fotos até 20 MB.",
    },
    {
      q: "Como meus dados são tratados?",
      a: "Os envios ficam na sua pasta privada, são analisados por um único modelo de IA, e depois excluídos. Plano gratuito: 1 dia após análise. Pago: 30 dias.",
    },
    {
      q: "Quais idiomas?",
      a: "5 hoje (inglês, espanhol, português, alemão, francês) com mais de 15 a caminho. A análise funciona em qualquer idioma do documento.",
    },
  ],
  waitlistHeading: "Quer atualizações quando adicionarmos mais idiomas?",
  waitlistSub: "Deixe seu e-mail e avisaremos quando ampliarmos seu idioma.",
  waitlistCta: "Avise-me",
};

const de: LandingCopy = {
  hero: "Verstehe jedes Dokument.",
  sub: "Mietvertrag, Versicherungspolice oder Arztrechnung abfotografieren. Erhalte eine verständliche Erklärung mit markierten Risiken — in deiner Sprache.",
  primaryCta: "Kostenlos testen",
  secondaryCta: "Preise ansehen",
  authedCta: "Dokument hochladen",
  emailPlaceholder: "du@beispiel.de",
  steps: [
    "Foto machen oder PDF hochladen",
    "Verständliche Zusammenfassung lesen",
    "Rückfragen stellen",
  ],
  trust: "Dokumente werden nach 30 Tagen automatisch gelöscht. Keine Rechtsberatung.",
  legal:
    "PaperLens liefert nur informative Zusammenfassungen und ersetzt keine Rechts-, Medizin- oder Finanzberatung.",
  trustStrip: [
    "Privatsphäre standardmäßig — automatische Löschung",
    "20+ Sprachen — in deiner erklärt",
    "Kostenlos für 3 Dokumente pro Monat",
  ],
  exampleHeading: "Was du zurückbekommst",
  exampleSub: "Eine echte Analyse eines Mietvertrags, in 9 Sekunden.",
  exampleSummaryLabel: "Zusammenfassung",
  exampleRisksLabel: "Markierte Risiken",
  docTypesHeading: "PaperLens versteht:",
  docTypes: [
    { slug: "lease", label: "Mietvertrag" },
    { slug: "health-insurance", label: "Krankenversicherung" },
    { slug: "medical-bill", label: "Arztrechnung" },
    { slug: "employment-contract", label: "Arbeitsvertrag" },
    { slug: "tax-letter", label: "Steuerbescheid" },
    { slug: "terms-of-service", label: "Nutzungsbedingungen" },
  ],
  pricingHeading: "Zahle nur, wenn es sich rentiert",
  pricingSub: "Kostenlos für Gelegenheitsnutzung. Pro 6,99 $/Monat für wöchentliche Nutzung.",
  pricingSeeAll: "Alle Preise ansehen →",
  faqHeading: "Häufige Fragen",
  faq: [
    {
      q: "Ist das Rechtsberatung?",
      a: "Nein. PaperLens erklärt, was in deinem Dokument steht — in verständlicher Sprache. Für wichtige Entscheidungen frage einen qualifizierten Profi.",
    },
    {
      q: "Welche Dokumente funktionieren?",
      a: "Mietverträge, Arbeitsverträge, NDAs, Versicherungspolicen, Arztrechnungen, Steuerbescheide, Hypotheken, Nutzungsbedingungen, Datenschutzerklärungen. PDFs und Fotos bis 20 MB.",
    },
    {
      q: "Wie werden meine Daten verarbeitet?",
      a: "Uploads liegen privat in deinem Account-Ordner, werden von einem einzigen KI-Modell analysiert und dann gelöscht. Free: 1 Tag nach Analyse. Bezahlt: 30 Tage.",
    },
    {
      q: "Welche Sprachen?",
      a: "5 heute (Englisch, Spanisch, Portugiesisch, Deutsch, Französisch) — 15+ weitere kommen. Die Analyse funktioniert in jeder Dokumentsprache.",
    },
  ],
  waitlistHeading: "Updates, wenn wir mehr Sprachen hinzufügen?",
  waitlistSub: "Hinterlasse deine E-Mail — wir melden uns bei der nächsten Sprachrolle.",
  waitlistCta: "Benachrichtigen",
};

const fr: LandingCopy = {
  hero: "Comprenez n'importe quel document.",
  sub: "Photographiez un bail, un contrat, une police d'assurance ou une facture médicale. Obtenez une explication claire, avec les risques signalés — dans votre langue.",
  primaryCta: "Essayer gratuitement",
  secondaryCta: "Voir les tarifs",
  authedCta: "Téléverser un document",
  emailPlaceholder: "vous@exemple.fr",
  steps: [
    "Prenez une photo ou téléversez un PDF",
    "Lisez le résumé en langage clair",
    "Posez des questions de suivi",
  ],
  trust: "Les documents sont supprimés automatiquement après 30 jours. Ce n'est pas un conseil juridique.",
  legal:
    "PaperLens fournit uniquement des résumés informatifs et ne remplace pas un conseil juridique, médical ou financier.",
  trustStrip: [
    "Confidentialité par défaut — suppression automatique",
    "20+ langues — expliqué dans la vôtre",
    "Gratuit pour 3 documents par mois",
  ],
  exampleHeading: "Ce que vous recevez",
  exampleSub: "Une vraie analyse d'un bail d'habitation, en 9 secondes.",
  exampleSummaryLabel: "Résumé",
  exampleRisksLabel: "Risques signalés",
  docTypesHeading: "PaperLens comprend :",
  docTypes: [
    { slug: "lease", label: "Bail" },
    { slug: "health-insurance", label: "Mutuelle santé" },
    { slug: "medical-bill", label: "Facture médicale" },
    { slug: "employment-contract", label: "Offre d'emploi" },
    { slug: "tax-letter", label: "Avis d'imposition" },
    { slug: "terms-of-service", label: "Conditions d'utilisation" },
  ],
  pricingHeading: "Payez seulement quand ça vous rapporte",
  pricingSub: "Gratuit pour usage occasionnel. Pro à 6,99 $/mois pour usage hebdomadaire.",
  pricingSeeAll: "Voir tous les tarifs →",
  faqHeading: "Questions fréquentes",
  faq: [
    {
      q: "Est-ce un conseil juridique ?",
      a: "Non. PaperLens explique ce que dit votre document en langage clair. Pour des décisions importantes, consultez un professionnel qualifié.",
    },
    {
      q: "Quels documents fonctionnent ?",
      a: "Baux, contrats de travail, NDAs, polices d'assurance, factures médicales, avis d'imposition, hypothèques, CGU, politiques de confidentialité. PDFs et photos jusqu'à 20 Mo.",
    },
    {
      q: "Comment mes données sont-elles traitées ?",
      a: "Les téléversements restent dans votre dossier privé, sont analysés par un seul modèle d'IA, puis supprimés. Gratuit : 1 jour après analyse. Payant : 30 jours.",
    },
    {
      q: "Quelles langues ?",
      a: "5 aujourd'hui (anglais, espagnol, portugais, allemand, français) avec plus de 15 à venir. L'analyse fonctionne dans n'importe quelle langue du document.",
    },
  ],
  waitlistHeading: "Notifications quand on ajoute plus de langues ?",
  waitlistSub: "Laissez votre e-mail — on vous prévient à chaque ouverture.",
  waitlistCta: "Me notifier",
};

export const copy: Record<Locale, LandingCopy> = {
  en,
  es,
  "pt-br": ptbr,
  de,
  fr,
};
