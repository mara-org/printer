import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { email, locale, source } = await req.json().catch(() => ({}));

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").insert({
    email: email.toLowerCase().trim(),
    locale: typeof locale === "string" ? locale : "en",
    source: typeof source === "string" ? source : null,
    user_agent: req.headers.get("user-agent"),
  });

  if (error) {
    // Unique violation = idempotent success from the user's POV.
    if (error.code === "23505") return NextResponse.json({ ok: true });
    console.error("waitlist insert failed", error);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
