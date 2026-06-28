import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = "https://czgbasechqyalahimidu.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_bkVMAe8lLHLQbBhMxsTVCA_qlwFzzTK";

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

function resolveSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const normalized = normalizeSupabaseUrl(rawUrl);

  if (!normalized) return DEFAULT_SUPABASE_URL;

  try {
    const host = new URL(normalized).hostname;
    const defaultHost = new URL(DEFAULT_SUPABASE_URL).hostname;
    if (host === defaultHost) {
      return normalized;
    }
  } catch {
    // fall through to the known-good project URL
  }

  return DEFAULT_SUPABASE_URL;
}

function resolveSupabaseKey() {
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (rawKey === DEFAULT_SUPABASE_KEY) {
    return rawKey;
  }

  // The production project uses a publishable public key. If the env var is
  // missing, stale, or points at another project, fall back to the known-good
  // key for the CardioPront Supabase project.
  return DEFAULT_SUPABASE_KEY;
}

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(resolveSupabaseUrl(), resolveSupabaseKey());
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
