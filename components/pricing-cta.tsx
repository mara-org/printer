"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function PricingCTA({
  product,
  label,
  highlight,
  authed,
  configured,
}: {
  product: "pro" | "pro_yearly" | "power" | "power_yearly" | "lifetime";
  label: string;
  highlight?: boolean;
  authed: boolean;
  configured: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    return (
      <button
        disabled
        className="mt-auto inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl border border-ink/15 bg-white text-sm font-medium opacity-60"
      >
        Coming soon
      </button>
    );
  }

  function go() {
    if (!authed) {
      router.push(`/sign-in?next=/pricing`);
      return;
    }
    start(async () => {
      setError(null);
      try {
        const res = await fetch("/api/polar/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `checkout failed (${res.status})`);
        }
        const { url } = (await res.json()) as { url: string };
        window.location.href = url;
      } catch (e) {
        setError(e instanceof Error ? e.message : "checkout failed");
      }
    });
  }

  return (
    <>
      <button
        onClick={go}
        disabled={pending}
        className={cn(
          "mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
          highlight
            ? "bg-accent text-white hover:bg-accent/90"
            : "border border-ink/15 bg-white hover:border-ink/30",
        )}
      >
        {pending ? <Spinner /> : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </>
  );
}
