import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import {
  formatAuthUser,
  hashPassword,
  normalizeEmail,
  setAuthCookie,
  type MedicoAuthRow,
} from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const nome = String(body.nome ?? "").trim();
    const email = normalizeEmail(String(body.email ?? ""));
    const crm = String(body.crm ?? "").trim();
    const crmUf = String(body.crm_uf ?? body.crmUf ?? "").trim().toUpperCase();
    const password = String(body.password ?? "");

    if (!nome || !email || !crm || !crmUf || !password) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail, CRM, UF e senha" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha precisa ter pelo menos 6 caracteres" },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 },
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 409 },
      );
    }

    const authUserId = randomUUID();
    const senhaHash = hashPassword(password);
    const trialFim = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const { data: medico, error } = await supabaseAdmin
      .from("medicos")
      .insert({
        auth_user_id: authUserId,
        nome,
        email,
        senha_hash: senhaHash,
        crm,
        crm_uf: crmUf,
        especialidade: "Cardiologia",
        plano: "trial",
        trial_fim: trialFim,
      })
      .select(
        "id, auth_user_id, nome, email, crm, crm_uf, especialidade, telefone, assinatura_data_url, plano, trial_fim",
      )
      .single();

    if (error || !medico) {
      return NextResponse.json(
        { error: error?.message || "Erro ao criar conta" },
        { status: 500 },
      );
    }

    const response = NextResponse.json(
      {
        message: "Conta criada com sucesso",
        user: formatAuthUser(medico as MedicoAuthRow),
      },
      { status: 201 },
    );

    setAuthCookie(response, authUserId);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 },
    );
  }
}
