"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function SignOutButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [, setError] = useState<string | null>(null);

  return (
    <button
      onClick={() =>
        start(async () => {
          try {
            const { error } = await supabaseBrowser().auth.signOut();
            if (error) throw error;
            router.replace("/");
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : "sign out failed");
          }
        })
      }
      disabled={pending}
      className="text-ink/70 hover:text-ink disabled:opacity-50"
    >
      {pending ? "…" : "Sign out"}
    </button>
  );
}
