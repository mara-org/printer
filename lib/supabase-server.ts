import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

function envOrThrow(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`missing env: ${key}`);
  return v;
}

// Server client bound to the user's session cookies. RLS applies as that user.
export async function supabaseServer() {
  const url = envOrThrow("NEXT_PUBLIC_SUPABASE_URL");
  const key = envOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const store = await cookies();
  return createServerClient<Database>(url, key, {
    cookies: {
      get: (name) => store.get(name)?.value,
      set: (name, value, options: CookieOptions) => {
        try {
          store.set({ name, value, ...options });
        } catch {
          // route handlers can't write cookies in some contexts; ignore
        }
      },
      remove: (name, options: CookieOptions) => {
        try {
          store.set({ name, value: "", ...options });
        } catch {
          /* noop */
        }
      },
    },
  });
}

// Service-role client. Bypasses RLS — only use server-side, never ship to client.
let _admin: ReturnType<typeof createClient<Database>> | null = null;
export function supabaseAdmin() {
  if (_admin) return _admin;
  const url = envOrThrow("NEXT_PUBLIC_SUPABASE_URL");
  const key = envOrThrow("SUPABASE_SERVICE_ROLE_KEY");
  _admin = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
