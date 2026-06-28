import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import {
  formatAuthUser,
  normalizeEmail,
  setAuthCookie,
  verifyPassword,
  type MedicoAuthRow,
} from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Informe e-mail e senha" },
        { status: 400 },
      );
    }

    const { data: medico, error } = await supabaseAdmin
      .from("medicos")
      .select(
        "id, auth_user_id, nome, email, crm, crm_uf, especialidade, telefone, assinatura_data_url, plano, trial_fim, senha_hash",
      )
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    if (!medico || !medico.senha_hash || !verifyPassword(password, medico.senha_hash)) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: formatAuthUser(medico as MedicoAuthRow),
    });

    setAuthCookie(response, medico.auth_user_id);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 },
    );
  }
}
