#!/usr/bin/env node
// Generate up to N missing PSEO pages using Gemini and write JSON files under
// data/pseo/<locale>/<type>.json. Skips existing pages. Designed to run on a
// GitHub Actions runner that has GEMINI_API_KEY in env.
//
// Usage:
//   GEMINI_API_KEY=... node scripts/pseo-generate.mjs --max 5
//
// The script always exits 0 (best effort). Caller decides what to do with the
// produced files — typically the cron commits them on a branch and opens a PR.

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const LOCALES = ["en", "es", "pt-br", "de", "fr"];
const TYPES = [
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
];

const LOCALE_NAMES = {
  en: "English",
  es: "Spanish",
  "pt-br": "Brazilian Portuguese",
  de: "German",
  fr: "French",
};

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith("--") ? [s.slice(2), a[i + 1]] : null))
    .filter(Boolean),
);
const MAX = parseInt(args.max ?? "5", 10);
const PSEO_DIR = path.join(process.cwd(), "data", "pseo");

function exists(locale, type) {
  return fs.existsSync(path.join(PSEO_DIR, locale, `${type}.json`));
}

function pickMissing(limit) {
  const missing = [];
  for (const type of TYPES) {
    for (const locale of LOCALES) {
      if (!exists(locale, type)) missing.push({ locale, type });
      if (missing.length >= limit) return missing;
    }
  }
  return missing;
}

const SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    meta_title: { type: SchemaType.STRING },
    meta_description: { type: SchemaType.STRING },
    h1: { type: SchemaType.STRING },
    intro: { type: SchemaType.STRING },
    sections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          heading: { type: SchemaType.STRING },
          body: { type: SchemaType.STRING },
        },
        required: ["heading", "body"],
      },
    },
    faq: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          q: { type: SchemaType.STRING },
          a: { type: SchemaType.STRING },
        },
        required: ["q", "a"],
      },
    },
    cta_label: { type: SchemaType.STRING },
    related_types: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        format: "enum",
        enum: TYPES,
      },
    },
  },
  required: ["meta_title", "meta_description", "h1", "intro", "sections", "faq", "cta_label", "related_types"],
};

const SYSTEM = (locale, type) =>
  [
    "You write programmatic-SEO landing pages for PaperLens — an AI document",
    "explainer that reads everyday official documents (leases, insurance, medical",
    "bills, tax letters, contracts) and explains them in plain language.",
    "",
    `Your job: produce a single page about reading a "${type}" document, written`,
    `in ${LOCALE_NAMES[locale]} for native speakers. The page should be useful`,
    "as a standalone guide, not a sales pitch.",
    "",
    "Rules:",
    "- Output strictly valid JSON matching the supplied schema.",
    "- Write fluent native-level prose. Don't translate from English literally.",
    "- 5–7 sections. Each section: 100–250 words of practical, specific advice.",
    "- 4–6 FAQ entries. Each Q is a real question someone would Google.",
    "- Avoid 'we will help you'. The reader does the work; PaperLens is a tool.",
    "- Reference jurisdiction-specific norms only when broadly relevant for the locale.",
    "  E.g. for de: Schönheitsreparaturen-Klausel; for es-mx: cláusula de UDIS;",
    "  for pt-br: reajuste por IGP-M.",
    "- Do NOT give legal advice. Describe what the document typically says, why",
    "  it matters, and what to ask. Add a short disclaimer where natural.",
    `- meta_title: 50–70 chars, ends with " — PaperLens".`,
    "- meta_description: 140–200 chars.",
    "- cta_label: 4–8 words, action-oriented.",
    "- related_types: 3–4 type slugs from the enum, NOT including the current type.",
  ].join("\n");

async function generateOne(locale, type) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM(locale, type),
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      temperature: 0.4,
    },
  });
  const result = await model.generateContent([
    {
      text: `Write the PSEO page for type=${type} in locale=${locale} (${LOCALE_NAMES[locale]}). Return JSON only.`,
    },
  ]);
  const json = JSON.parse(result.response.text());
  // Filter related_types to remove self.
  json.related_types = (json.related_types ?? []).filter((t) => t !== type).slice(0, 4);
  json.generated_at = new Date().toISOString();
  json.generated_by = "gemini-2.5-flash";
  return json;
}

async function main() {
  const missing = pickMissing(MAX);
  if (missing.length === 0) {
    console.log("no missing PSEO pages — nothing to do");
    return;
  }
  console.log(`generating ${missing.length} page(s):`);
  for (const { locale, type } of missing) {
    process.stdout.write(`  ${locale}/${type}: `);
    try {
      const json = await generateOne(locale, type);
      const dir = path.join(PSEO_DIR, locale);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${type}.json`), JSON.stringify(json, null, 2));
      console.log("ok");
    } catch (err) {
      console.log("fail:", err?.message ?? err);
    }
  }
}

main().catch((err) => {
  console.error("pseo-generate fatal:", err);
  process.exit(0);
});
