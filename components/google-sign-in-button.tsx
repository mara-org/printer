"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Spinner } from "@/components/ui/spinner";

export function GoogleSignInButton() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/upload";
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          start(async () => {
            setError(null);
            try {
              const sb = supabaseBrowser();
              const origin = window.location.origin;
              const { error } = await sb.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
                },
              });
              if (error) throw error;
            } catch (e) {
              setError(e instanceof Error ? e.message : "google sign-in failed");
            }
          })
        }
        disabled={pending}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-ink/15 bg-white text-sm font-medium hover:border-ink/30 disabled:opacity-50"
      >
        {pending ? (
          <Spinner />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </>
  );
}
