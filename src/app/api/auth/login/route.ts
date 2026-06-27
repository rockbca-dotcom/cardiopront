import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = String(data["email"] || "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pw: string = (data as any)["password"] || "";

    if (!email || !pw) {
      return NextResponse.json({ error: "E-mail e senha obrigatorios" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, anonKey);

    // Build params as URLSearchParams to avoid JSX parsing
    const searchParams = new URLSearchParams();
    searchParams.append("email", email);
    searchParams.append("password", pw);
    const params = Object.fromEntries(searchParams.entries());

    // Try signInWithPassword
    const { data: signInData, error } = await supabase.auth.signInWithPassword(params as any);

    if (error) {
      // Try the token endpoint as fallback
      try {
        const tokenUrl = supabaseUrl + "/auth/v1/token?grant_type=password";
        const resp = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "apikey": anonKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
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
      } catch (_e) {
        // ignore
      }

      return NextResponse.json(
        { error: error.message || "Credenciais invalidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      session: {
        access_token: signInData.session?.access_token,
        refresh_token: signInData.session?.refresh_token,
        expires_at: signInData.session?.expires_at,
      },
      user: { id: signInData.user.id, email: signInData.user.email },
    });
  } catch (error) {
    console.error("Login exception:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
