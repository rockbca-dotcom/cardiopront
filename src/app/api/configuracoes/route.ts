import { NextRequest, NextResponse } from "next/server";

import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";
import {
  mapMedicoToConfiguracoesProfile,
  normalizeConfiguracoesInput,
} from "@/lib/configuracoes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: medico, error } = await supabaseAdmin
      .from("medicos")
      .select("id, nome, email, crm, crm_uf, especialidade, telefone, plano, trial_fim, atualizado_em")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!medico) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ configuracoes: mapMedicoToConfiguracoesProfile(medico) });
  } catch (error) {
    console.error("Error loading settings:", error);
    return NextResponse.json({ error: "Erro ao carregar configurações" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const payload = normalizeConfiguracoesInput(body);

    const { data: medicoAtual, error: lookupError } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (!medicoAtual) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    const { data: medico, error } = await supabaseAdmin
      .from("medicos")
      .update({
        nome: payload.nome,
        email: payload.email,
        crm: payload.crm,
        crm_uf: payload.crm_uf,
        especialidade: payload.especialidade || null,
        telefone: payload.telefone || null,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", medicoAtual.id)
      .select("id, nome, email, crm, crm_uf, especialidade, telefone, plano, trial_fim, atualizado_em")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({
      message: "Configurações salvas com sucesso",
      configuracoes: mapMedicoToConfiguracoesProfile(medico),
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    const message = error instanceof Error ? error.message : "Erro ao salvar configurações";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
