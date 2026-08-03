import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const wanted = acceptLanguage
    .split(",")
    .map((p) => p.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);
  for (const tag of wanted) {
    if ((locales as readonly string[]).includes(tag)) return tag as Locale;
    const base = tag.split("-")[0];
    if (base === "en") return "en";
    if (base === "es") return "es";
    if (base === "pt") return "pt-br";
    if (base === "de") return "de";
    if (base === "fr") return "fr";
  }
  return defaultLocale;
}

export default function Root() {
  const acceptLang = headers().get("accept-language");
  const locale = pickLocale(acceptLang);
  redirect(`/${locale}`);
}
