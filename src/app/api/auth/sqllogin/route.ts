import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = <REDACTED> (await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, anonKey);

    // Try the standard login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("SQLLogin error:", JSON.stringify(error));
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (e) {
    console.error("Login exception:", e);
    return NextResponse.json(
      { error: "Network error - " + (e instanceof Error ? e.message : "unknown") },
      { status: 500 }
    );
  }
}
