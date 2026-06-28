import { NextRequest, NextResponse } from "next/server";

import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });

    const { data } = await supabaseAdmin
      .from("consultas")
      .select("*, pacientes(nome)")
      .eq("medico_id", medico.id)
      .order("data_consulta", { ascending: false });

    return NextResponse.json({ consultas: data || [] });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json({ consultas: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });

    const body = await req.json();

    let imc = null;
    if (body.peso_kg && body.altura_cm) {
      const altura_m = body.altura_cm / 100;
      imc = parseFloat((body.peso_kg / (altura_m * altura_m)).toFixed(1));
    }

    const { data, error } = await supabaseAdmin
      .from("consultas")
      .insert({
        paciente_id: body.paciente_id,
        medico_id: medico.id,
        data_consulta: body.data_consulta,
        tipo: body.tipo || "presencial",
        motivo_consulta: body.motivo_consulta || null,
        queixa_principal: body.queixa_principal || null,
        pa_sistolica: body.pa_sistolica || null,
        pa_diastolica: body.pa_diastolica || null,
        fc: body.fc || null,
        fr: body.fr || null,
        saturacao_o2: body.saturacao_o2 || null,
        peso_kg: body.peso_kg || null,
        altura_cm: body.altura_cm || null,
        imc,
        temp_celsius: body.temp_celsius || null,
        exame_fisico_geral: body.exame_fisico_geral || null,
        diagnostico: body.diagnostico || null,
        cid10: body.cid10 || null,
        conduta: body.conduta || null,
        orientacoes: body.orientacoes || null,
        audio_url: body.audio_url || null,
        transcricao_completa: body.transcricao_completa || null,
        sintese_ia: body.sintese_ia || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ consulta: data, message: "Consulta salva" });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json({ error: "Erro ao salvar consulta" }, { status: 500 });
  }
}
