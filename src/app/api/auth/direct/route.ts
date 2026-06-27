import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = <REDACTED> (await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, anonKey);

    // Get user from auth.users table using RPC or direct query
    // Since we can't query auth.users directly with anon key, 
    // we'll use the medicos table which has auth_user_id
    const { data: medico } = await supabase
      .from("medicos")
      .select("id, nome, crm, crm_uf, plano, auth_user_id")
      .filter("email", "eq", email)
      .maybeSingle();

    if (!medico) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
    }

    // We need to verify the password against auth.users
    // Since we can't access auth.users with anon key,
    // let's try a different approach: use the GoTrue API directly
    
    // Actually, the simplest approach is to try signInWithPassword with
    // a timeout wrapper. But since that's failing, let's try the
    // /auth/v1/token?grant_type=password endpoint directly
    
    const tokenUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`;
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        gotrue_meta_security: {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error_description || errorData.message || "Falha no login" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      session: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      },
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error) {
    console.error("Direct login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro de rede" },
      { status: 500 }
    );
  }
}
