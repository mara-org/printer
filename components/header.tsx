import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/sign-out-button";

export async function Header() {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  return (
    <header className="border-b border-ink/10 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-base font-semibold tracking-tight">
          PaperLens
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link href="/upload" className="text-ink/70 hover:text-ink">
                Upload
              </Link>
              <Link href="/dashboard" className="text-ink/70 hover:text-ink">
                Dashboard
              </Link>
              <Link href="/pricing" className="text-ink/70 hover:text-ink">
                Pricing
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/pricing" className="text-ink/70 hover:text-ink">
                Pricing
              </Link>
              <Link
                href="/sign-in"
                className="rounded-xl bg-ink px-3 py-1.5 text-paper hover:bg-ink/85"
              >
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
