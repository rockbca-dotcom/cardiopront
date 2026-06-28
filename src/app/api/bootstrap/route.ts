import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
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

const DEMO_EMAIL = "demo@cardiopront.com.br";
const DEMO_PASSWORD = "CardioDemo2026!";
const DEMO_NAME = "Dr. Demo Cardiologista";
const DEMO_CRM = "000000";
const DEMO_CRM_UF = "SP";

export async function POST() {
  try {
    const email = normalizeEmail(DEMO_EMAIL);
    const senhaHash = hashPassword(DEMO_PASSWORD);

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("medicos")
      .select(
        "id, auth_user_id, nome, email, crm, crm_uf, especialidade, telefone, plano, trial_fim",
      )
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { success: false, error: existingError.message },
        { status: 500 },
      );
    }

    let medico = existing;

    if (existing) {
      const { data: updated, error } = await supabaseAdmin
        .from("medicos")
        .update({
          nome: DEMO_NAME,
          email,
          senha_hash: senhaHash,
          crm: DEMO_CRM,
          crm_uf: DEMO_CRM_UF,
          especialidade: "Cardiologia",
          plano: "trial",
        })
        .eq("auth_user_id", existing.auth_user_id)
        .select(
          "id, auth_user_id, nome, email, crm, crm_uf, especialidade, telefone, plano, trial_fim",
        )
        .single();

      if (error || !updated) {
        return NextResponse.json(
          { success: false, error: error?.message || "Erro ao atualizar conta demo" },
          { status: 500 },
        );
      }

      medico = updated;
    } else {
      const authUserId = randomUUID();
      const { data: inserted, error } = await supabaseAdmin
        .from("medicos")
        .insert({
          auth_user_id: authUserId,
          nome: DEMO_NAME,
          email,
          senha_hash: senhaHash,
          crm: DEMO_CRM,
          crm_uf: DEMO_CRM_UF,
          especialidade: "Cardiologia",
          plano: "trial",
          trial_fim: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        })
        .select(
          "id, auth_user_id, nome, email, crm, crm_uf, especialidade, telefone, plano, trial_fim",
        )
        .single();

      if (error || !inserted) {
        return NextResponse.json(
          { success: false, error: error?.message || "Erro ao criar conta demo" },
          { status: 500 },
        );
      }

      medico = inserted;
    }

    const response = NextResponse.json({
      success: true,
      message: "Conta demo pronta",
      user: formatAuthUser(medico as MedicoAuthRow),
    });

    setAuthCookie(response, medico.auth_user_id);
    return response;
  } catch (error) {
    console.error("Bootstrap error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao preparar conta demo" },
      { status: 500 },
    );
  }
}
