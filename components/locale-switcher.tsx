"use client";

import { useState } from "react";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  "pt-br": "PT",
  de: "DE",
  fr: "FR",
};

export function LocaleSwitcher({ current, path }: { current: string; path: string }) {
  const [open, setOpen] = useState(false);

  // Strip the locale segment from `path` if present so we can swap it.
  const pathWithoutLocale = (() => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
      return "/" + segments.slice(1).join("/");
    }
    return path;
  })();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-xs font-medium hover:border-ink/30"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {LABELS[current as Locale] ?? current.toUpperCase()}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-40 mt-1 w-28 overflow-hidden rounded-xl border border-ink/10 bg-white py-1 text-sm shadow-lg"
        >
          {locales.map((l) => (
            <li key={l}>
              <a
                href={`/${l}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 hover:bg-ink/5",
                  l === current && "font-semibold",
                )}
              >
                <span>{LABELS[l]}</span>
                <span className="text-ink/40">{l === "pt-br" ? "Português" : l === "en" ? "English" : l === "es" ? "Español" : l === "de" ? "Deutsch" : "Français"}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
