import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { locales, type Locale } from "@/lib/i18n";

export const PSEO_TYPES = [
  "lease",
  "employment-contract",
  "nda",
  "health-insurance",
  "auto-insurance",
  "life-insurance",
  "medical-bill",
  "tax-letter",
  "mortgage",
  "terms-of-service",
  "privacy-policy",
] as const;
export type PseoType = (typeof PSEO_TYPES)[number];

export const PseoPageSchema = z.object({
  meta_title: z.string().min(1).max(80),
  meta_description: z.string().min(1).max(220),
  h1: z.string().min(1).max(120),
  intro: z.string().min(1).max(800),
  sections: z
    .array(
      z.object({
        heading: z.string().min(1).max(140),
        body: z.string().min(1).max(1200),
      }),
    )
    .min(3)
    .max(10),
  faq: z
    .array(
      z.object({
        q: z.string().min(1).max(160),
        a: z.string().min(1).max(800),
      }),
    )
    .min(3)
    .max(8),
  cta_label: z.string().min(1).max(60),
  related_types: z.array(z.enum(PSEO_TYPES)).max(4),
  generated_at: z.string(),
  generated_by: z.string(),
});
export type PseoPage = z.infer<typeof PseoPageSchema>;

export const DOC_TYPE_LABEL: Record<PseoType, Record<Locale, string>> = {
  lease: {
    en: "Lease",
    es: "Contrato de arrendamiento",
    "pt-br": "Contrato de aluguel",
    de: "Mietvertrag",
    fr: "Bail",
  },
  "employment-contract": {
    en: "Employment contract",
    es: "Contrato de trabajo",
    "pt-br": "Contrato de trabalho",
    de: "Arbeitsvertrag",
    fr: "Contrat de travail",
  },
  nda: {
    en: "Non-disclosure agreement",
    es: "Acuerdo de confidencialidad",
    "pt-br": "Acordo de confidencialidade",
    de: "Geheimhaltungsvereinbarung",
    fr: "Accord de confidentialité",
  },
  "health-insurance": {
    en: "Health insurance",
    es: "Seguro médico",
    "pt-br": "Plano de saúde",
    de: "Krankenversicherung",
    fr: "Mutuelle santé",
  },
  "auto-insurance": {
    en: "Auto insurance",
    es: "Seguro de auto",
    "pt-br": "Seguro auto",
    de: "Kfz-Versicherung",
    fr: "Assurance auto",
  },
  "life-insurance": {
    en: "Life insurance",
    es: "Seguro de vida",
    "pt-br": "Seguro de vida",
    de: "Lebensversicherung",
    fr: "Assurance vie",
  },
  "medical-bill": {
    en: "Medical bill",
    es: "Factura médica",
    "pt-br": "Conta médica",
    de: "Arztrechnung",
    fr: "Facture médicale",
  },
  "tax-letter": {
    en: "Tax letter",
    es: "Carta de impuestos",
    "pt-br": "Carta da Receita",
    de: "Steuerbescheid",
    fr: "Avis d'imposition",
  },
  mortgage: {
    en: "Mortgage",
    es: "Hipoteca",
    "pt-br": "Hipoteca",
    de: "Hypothek",
    fr: "Prêt immobilier",
  },
  "terms-of-service": {
    en: "Terms of service",
    es: "Términos de servicio",
    "pt-br": "Termos de uso",
    de: "Nutzungsbedingungen",
    fr: "Conditions d'utilisation",
  },
  "privacy-policy": {
    en: "Privacy policy",
    es: "Política de privacidad",
    "pt-br": "Política de privacidade",
    de: "Datenschutzerklärung",
    fr: "Politique de confidentialité",
  },
};

const PSEO_DIR = path.join(process.cwd(), "data", "pseo");

export function pseoFilePath(locale: Locale, type: PseoType): string {
  return path.join(PSEO_DIR, locale, `${type}.json`);
}

export function loadPseoPage(locale: Locale, type: PseoType): PseoPage | null {
  const file = pseoFilePath(locale, type);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return PseoPageSchema.parse(raw);
  } catch {
    return null;
  }
}

export function listExistingPseoPages(): { locale: Locale; type: PseoType }[] {
  const result: { locale: Locale; type: PseoType }[] = [];
  for (const locale of locales) {
    const dir = path.join(PSEO_DIR, locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const type = file.slice(0, -5) as PseoType;
      if ((PSEO_TYPES as readonly string[]).includes(type)) {
        result.push({ locale, type });
      }
    }
  }
  return result;
}
