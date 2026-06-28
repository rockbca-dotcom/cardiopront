import { NextRequest, NextResponse } from "next/server";

import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { id: consultaId } = await params;

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    const { data: consulta, error: consultaError } = await supabaseAdmin
      .from("consultas")
      .select(
        "id, data_consulta, tipo, motivo_consulta, queixa_principal, diagnostico, conduta, orientacoes, pacientes(id, nome, nascimento, sexo, cpf, telefone, email)",
      )
      .eq("id", consultaId)
      .eq("medico_id", medico.id)
      .maybeSingle();

    if (consultaError) throw consultaError;
    if (!consulta) {
      return NextResponse.json({ error: "Consulta não encontrada" }, { status: 404 });
    }

    const { data: prescricoes, error } = await supabaseAdmin
      .from("prescricoes")
      .select("*")
      .eq("consulta_id", consultaId)
      .order("data_prescricao", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ consulta, prescricoes: prescricoes || [] });
  } catch (error) {
    console.error("Error fetching prescription bundle:", error);
    return NextResponse.json({ error: "Erro ao buscar prescrição" }, { status: 500 });
  }
}
