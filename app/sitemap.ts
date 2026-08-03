import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { PSEO_TYPES, listExistingPseoPages } from "@/lib/pseo";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printer-olive.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sign-in`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const localizedLanding: MetadataRoute.Sitemap = locales.map((l) => ({
    url: `${BASE}/${l}`,
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: {
      languages: Object.fromEntries(locales.map((x) => [x, `${BASE}/${x}`])),
    },
  }));

  const existing = listExistingPseoPages();
  const pseoPaths: MetadataRoute.Sitemap = existing.map(({ locale, type }) => ({
    url: `${BASE}/${locale}/explain/${type}`,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        locales.map((x) => [x, `${BASE}/${x}/explain/${type}`]),
      ),
    },
  }));

  // Even if a locale doesn't have a generated page yet, the route renders a
  // placeholder; include all combos so Google discovers them as the cron fills in.
  const placeholderPaths: MetadataRoute.Sitemap = [];
  for (const l of locales) {
    for (const t of PSEO_TYPES) {
      if (existing.find((e) => e.locale === l && e.type === t)) continue;
      placeholderPaths.push({
        url: `${BASE}/${l}/explain/${t}`,
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
  }

  return [...staticPaths, ...localizedLanding, ...pseoPaths, ...placeholderPaths];
}
