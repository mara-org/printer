"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type State = "idle" | "loading" | "sent" | "error";

export function SignInForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/upload";

  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      const sb = supabaseBrowser();
      const origin = window.location.origin;
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6">
        <p className="text-sm">
          Check <strong>{email}</strong> for a sign-in link. It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <Button type="submit" disabled={state === "loading"} className="w-full">
        {state === "loading" ? (
          <>
            <Spinner /> Sending link…
          </>
        ) : (
          "Send sign-in link"
        )}
      </Button>
      {state === "error" && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-center text-xs text-ink/50">
        We send a one-time link. No password, no Google sign-in necessary.
      </p>
    </form>
  );
}
