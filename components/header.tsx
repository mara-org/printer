import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/sign-out-button";
import { LocaleSwitcher } from "@/components/locale-switcher";

export async function Header({
  locale,
  pathForLocaleSwitch,
}: {
  locale?: string;
  pathForLocaleSwitch?: string;
} = {}) {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  return (
    <header className="border-b border-ink/10 bg-paper/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-base font-semibold tracking-tight">
          PaperLens
        </Link>
        <nav className="flex items-center gap-4 text-sm md:gap-6">
          {locale && pathForLocaleSwitch && (
            <LocaleSwitcher current={locale} path={pathForLocaleSwitch} />
          )}
          {user ? (
            <>
              <Link href="/upload" className="hidden text-ink/70 hover:text-ink sm:inline">
                Upload
              </Link>
              <Link href="/dashboard" className="text-ink/70 hover:text-ink">
                Dashboard
              </Link>
              <Link href="/pricing" className="hidden text-ink/70 hover:text-ink sm:inline">
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
