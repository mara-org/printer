import { NextResponse } from "next/server";

export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { email, locale } = await req.json().catch(() => ({}));

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // TODO: persist to Supabase `waitlist` table once project is provisioned.
  // Schema: id uuid pk, email text unique, locale text, source text,
  //         user_agent text, created_at timestamptz default now().
  console.log("waitlist signup", { email, locale });

  return NextResponse.json({ ok: true });
}
