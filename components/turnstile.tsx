"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render(
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ): string;
      reset(widgetId?: string): void;
    };
  }
}

export function Turnstile({
  onToken,
  className,
}: {
  onToken: (token: string | null) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const devMode = !sitekey;

  // Auto-emit a placeholder token in dev (no widget rendered).
  useEffect(() => {
    if (devMode) onToken("dev");
  }, [devMode, onToken]);

  useEffect(() => {
    if (devMode || !ready || !ref.current || !sitekey || !window.turnstile) return;
    const id = window.turnstile.render(ref.current, {
      sitekey,
      theme: "light",
      callback: (token) => onToken(token),
      "error-callback": () => onToken(null),
      "expired-callback": () => onToken(null),
    });
    return () => {
      try {
        window.turnstile?.reset(id);
      } catch {
        /* noop */
      }
    };
  }, [devMode, ready, sitekey, onToken]);

  if (devMode) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div ref={ref} className={className} />
    </>
  );
}
