export const locales = ["en", "es", "pt-br", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const copy: Record<Locale, {
  hero: string;
  sub: string;
  cta: string;
  emailPlaceholder: string;
  steps: [string, string, string];
  trust: string;
  legal: string;
}> = {
  en: {
    hero: "Understand any document.",
    sub: "Snap a lease, contract, insurance policy, or medical bill. Get a plain-language explanation, with risks flagged — in your language.",
    cta: "Join the waitlist",
    emailPlaceholder: "you@example.com",
    steps: [
      "Snap a photo or upload a PDF",
      "Read the plain-language summary",
      "Ask follow-up questions",
    ],
    trust: "Documents are auto-deleted after 30 days. Not legal advice.",
    legal: "PaperLens provides informational summaries only and is not a substitute for legal, medical, or financial advice.",
  },
  es: {
    hero: "Entiende cualquier documento.",
    sub: "Saca una foto a un contrato, póliza de seguro o factura médica. Obtén una explicación clara, con los riesgos resaltados — en tu idioma.",
    cta: "Únete a la lista de espera",
    emailPlaceholder: "tu@ejemplo.com",
    steps: [
      "Toma una foto o sube un PDF",
      "Lee el resumen en lenguaje claro",
      "Haz preguntas de seguimiento",
    ],
    trust: "Los documentos se borran automáticamente después de 30 días. No es asesoramiento legal.",
    legal: "PaperLens ofrece resúmenes informativos y no sustituye asesoramiento legal, médico ni financiero.",
  },
  "pt-br": {
    hero: "Entenda qualquer documento.",
    sub: "Tire uma foto de um contrato, apólice de seguro ou conta médica. Receba uma explicação clara, com riscos destacados — no seu idioma.",
    cta: "Entrar na lista de espera",
    emailPlaceholder: "voce@exemplo.com",
    steps: [
      "Tire uma foto ou envie um PDF",
      "Leia o resumo em linguagem clara",
      "Faça perguntas de acompanhamento",
    ],
    trust: "Documentos são excluídos automaticamente após 30 dias. Não é orientação jurídica.",
    legal: "PaperLens fornece resumos informativos e não substitui orientação jurídica, médica ou financeira.",
  },
  de: {
    hero: "Verstehe jedes Dokument.",
    sub: "Mietvertrag, Versicherungspolice oder Arztrechnung abfotografieren. Erhalte eine verständliche Erklärung mit markierten Risiken — in deiner Sprache.",
    cta: "Auf die Warteliste",
    emailPlaceholder: "du@beispiel.de",
    steps: [
      "Foto machen oder PDF hochladen",
      "Verständliche Zusammenfassung lesen",
      "Rückfragen stellen",
    ],
    trust: "Dokumente werden nach 30 Tagen automatisch gelöscht. Keine Rechtsberatung.",
    legal: "PaperLens liefert nur informative Zusammenfassungen und ersetzt keine Rechts-, Medizin- oder Finanzberatung.",
  },
  fr: {
    hero: "Comprenez n'importe quel document.",
    sub: "Photographiez un bail, un contrat, une police d'assurance ou une facture médicale. Obtenez une explication claire, avec les risques signalés — dans votre langue.",
    cta: "Rejoindre la liste d'attente",
    emailPlaceholder: "vous@exemple.fr",
    steps: [
      "Prenez une photo ou téléversez un PDF",
      "Lisez le résumé en langage clair",
      "Posez des questions de suivi",
    ],
    trust: "Les documents sont supprimés automatiquement après 30 jours. Ce n'est pas un conseil juridique.",
    legal: "PaperLens fournit uniquement des résumés informatifs et ne remplace pas un conseil juridique, médical ou financier.",
  },
};
