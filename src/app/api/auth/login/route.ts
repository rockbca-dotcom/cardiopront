import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = <REDACTED> (await req.json());

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha obrigatorios" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, anonKey);

    // Try signInWithPassword with explicit error handling
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log the full error for debugging
      console.error("Auth error:", JSON.stringify({
        message: error.message,
        status: error.status,
        name: error.name,
      }));

      // If it's a fetch error, try the token endpoint directly
      if (error.message.includes("fetch") || error.status === 0) {
        try {
          const tokenUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`;
          const resp = await fetch(tokenUrl, {
            method: "POST",
            headers: {
              "apikey": anonKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (resp.ok) {
            const tokenData = await resp.json();
            return NextResponse.json({
              session: {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: tokenData.expires_at,
              },
              user: { id: tokenData.user?.id, email: tokenData.user?.email },
            });
          }
        } catch (e) {
          // Fall through to error response
        }
      }

      return NextResponse.json(
        { error: error.message || "Credenciais invalidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (error) {
    console.error("Login exception:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
