"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ManageSubscriptionButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function go() {
    start(async () => {
      setError(null);
      try {
        const res = await fetch("/api/polar/portal", { method: "POST" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `portal failed (${res.status})`);
        }
        const { url } = (await res.json()) as { url: string };
        window.location.href = url;
      } catch (e) {
        setError(e instanceof Error ? e.message : "portal failed");
      }
    });
  }

  return (
    <>
      <button
        onClick={go}
        disabled={pending}
        className="inline-flex h-9 items-center justify-center rounded-xl border border-ink/15 bg-white px-4 text-sm font-medium hover:border-ink/30 disabled:opacity-50"
      >
        {pending ? <Spinner /> : "Manage subscription"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}
