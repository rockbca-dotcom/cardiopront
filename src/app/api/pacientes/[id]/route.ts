import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";
import { attachConsultationDates } from "@/lib/patient-history";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { id } = await params;
    const pacienteId = String(id || "");
    if (!pacienteId) {
      return NextResponse.json({ error: "Paciente inválido" }, { status: 400 });
    }

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });

    const { data: paciente, error: pacienteError } = await supabaseAdmin
      .from("pacientes")
      .select("id, medico_id, nome, nascimento, sexo, cpf, telefone, email, tipo_sanguineo, peso_kg, altura_cm, alergias")
      .eq("id", pacienteId)
      .eq("medico_id", medico.id)
      .maybeSingle();

    if (pacienteError) throw pacienteError;
    if (!paciente) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });

    const [consultasResult, examesResult, prescricoesResult] = await Promise.all([
      supabaseAdmin
        .from("consultas")
        .select("id, data_consulta, tipo, motivo_consulta, queixa_principal, historia_doenca_atual, historia_familiar_cardiovascular, pa_sistolica, pa_diastolica, fc, fr, temp_celsius, saturacao_o2, peso_kg, altura_cm, imc, exame_fisico_geral, diagnostico, cid10, conduta, orientacoes, audio_url, transcricao_completa, sintese_ia, criado_em")
        .eq("paciente_id", paciente.id)
        .eq("medico_id", medico.id)
        .order("data_consulta", { ascending: false }),
      supabaseAdmin
        .from("exames")
        .select("id, consulta_id, paciente_id, tipo_exame_id, prioridade, indicacao_clinica, data_pedido, data_resultado, resultado_texto, resultado_valores, status, tipos_exame(nome, categoria)")
        .eq("paciente_id", paciente.id)
        .order("data_pedido", { ascending: false }),
      supabaseAdmin
        .from("prescricoes")
        .select("id, consulta_id, paciente_id, data_prescricao, validade_dias, medicamento, principio_ativo, dose, unidade, frequencia, posologia, via, advertencias")
        .eq("paciente_id", paciente.id)
        .order("data_prescricao", { ascending: false }),
    ]);

    if (consultasResult.error) throw consultasResult.error;
    if (examesResult.error) throw examesResult.error;
    if (prescricoesResult.error) throw prescricoesResult.error;

    const consultas = consultasResult.data || [];
    const exames = attachConsultationDates(examesResult.data || [], consultas);
    const prescricoes = attachConsultationDates(prescricoesResult.data || [], consultas);

    return NextResponse.json({
      paciente,
      historico: {
        consultas,
        exames,
        prescricoes,
      },
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 });
  }
}
