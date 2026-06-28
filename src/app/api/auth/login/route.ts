import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body["email"] || "");
    const pw = body["password"] || "";

    if (!email || !pw) {
      return NextResponse.json({ error: "E-mail e senha obrigatorios" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, anonKey);

    // Try using the RPC function with explicit schema
    const { data: result, error: rpcError } = await supabase.rpc("verify_user_password", {
      user_email: email,
      user_password: <REDACTED>
    });

    if (rpcError) {
      console.error("RPC error:", rpcError.message);
      return NextResponse.json({ error: "Erro ao verificar credenciais: " + rpcError.message }, { status: 401 });
    }

    if (!result || !result.length) {
      return NextResponse.json({ error: "Credenciais invalidas" }, { status: 401 });
    }

    const userRecord = result[0];

    const sessionData = {
      access_token: btoa(userRecord["auth_user_id"] + ":" + Date.now()),
      refresh_token: btoa("refresh:" + userRecord["auth_user_id"] + ":" + Date.now()),
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

    return NextResponse.json({
      session: sessionData,
      user: {
        id: userRecord["auth_user_id"],
        email: userRecord["email"],
        nome: userRecord["nome"],
        crm: userRecord["crm"],
        crmUf: userRecord["crm_uf"],
        plano: userRecord["plano"],
      },
    });
  } catch (error) {
    console.error("Login exception:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
