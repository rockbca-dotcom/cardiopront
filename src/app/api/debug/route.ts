import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Check if env vars exist (don't expose the actual values)
  return NextResponse.json({
    hasUrl: !!url,
    hasKey: !!key,
    urlPrefix: url.substring(0, 10) + "...",
    keyPrefix: key.substring(0, 10) + "...",
  });
}

export async function POST() {
  // Direct login attempt
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    return NextResponse.json({ error: "Env vars missing" });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "demo@cardiopront.com.br",
    password: "CardioDemo2026!",
  });

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      status: error.status,
    });
  }

  return NextResponse.json({
    success: true,
    user: { id: data.user.id, email: data.user.email },
    sessionExpiresAt: data.session?.expires_at,
  });
}
