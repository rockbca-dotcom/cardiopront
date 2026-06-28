import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function normalizeSupabaseUrl(rawUrl: string) {
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);
    if (url.hostname.startsWith("db.")) {
      url.hostname = url.hostname.replace(/^db\./, "");
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return rawUrl.replace(/^https:\/\/db\./, "https://");
  }
}

function getClient(): SupabaseClient {
  if (!_client) {
    const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    _client = createClient(url, key);
  }
  return _client;
}

// Proxy that lazily creates the client on first access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});

export const supabaseAdmin = supabase;

export default supabase;
