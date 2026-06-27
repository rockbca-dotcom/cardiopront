import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client for browser and server-side (RLS is disabled for MVP)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Alias for backward compatibility
export const supabaseAdmin = supabase;

export default supabase;
