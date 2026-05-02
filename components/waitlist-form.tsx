"use client";

import { useState } from "react";

export function WaitlistForm({
  cta,
  placeholder,
  locale,
}: {
  cta: string;
  placeholder: string;
  locale: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 text-sm">
        Thanks. You are on the list.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-ink/15 bg-white px-4 py-3 text-base outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-xl bg-ink px-5 py-3 text-base font-medium text-paper transition hover:bg-ink/85 disabled:opacity-50"
      >
        {state === "loading" ? "..." : cta}
      </button>
    </form>
  );
}
