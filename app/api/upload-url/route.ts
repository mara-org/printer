import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const Body = z.object({
  filename: z.string().min(1).max(200),
  mime_type: z.string(),
  byte_size: z.number().int().positive().max(20 * 1024 * 1024),
});

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "bad_request", detail: (err as Error).message }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(body.mime_type)) {
    return NextResponse.json({ error: "unsupported_mime" }, { status: 400 });
  }

  const path = `${user.id}/${Date.now()}-${safeName(body.filename)}`;
  const { data, error } = await sb.storage
    .from("documents")
    .createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json(
      { error: "signed_url_failed", detail: error?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    storage_path: path,
    signed_url: data.signedUrl,
    token: data.token,
  });
}
