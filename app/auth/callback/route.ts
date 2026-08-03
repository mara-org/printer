import { NextResponse } from "next/server";
import { supabaseServer, supabaseAdmin } from "@/lib/supabase-server";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/upload";

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=missing_code", url.origin));
  }

  const sb = await supabaseServer();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  // Ensure a profile row exists for this user; send welcome on first sign-in.
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (user) {
    const admin = supabaseAdmin();
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (!existing) {
      await admin.from("profiles").insert({
        id: user.id,
        email: user.email ?? null,
      });
      if (user.email) {
        await sendWelcomeEmail(user.email);
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
