import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { consulta_id, paciente_id, score_type, score_value, risk } = await req.json();

    if (!consulta_id || !paciente_id || !score_type || score_value === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });

    const { data, error } = await supabaseAdmin
      .from("scores_cardiovasculares")
      .insert({
        consulta_id,
        paciente_id,
        medico_id: medico.id,
        tipo_score: score_type,
        valor: score_value,
        risco: risk,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ score: data });
  } catch (error) {
    console.error("Score save error:", error);
    return NextResponse.json({ error: "Erro ao salvar escore" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const paciente_id = searchParams.get("paciente_id");

    if (!paciente_id) {
      return NextResponse.json({ error: "Paciente ID é obrigatório" }, { status: 400 });
    }

    const { data } = await supabaseAdmin
      .from("scores_cardiovasculares")
      .select("*")
      .eq("paciente_id", paciente_id)
      .order("calculado_em", { ascending: false });

    return NextResponse.json({ scores: data || [] });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json({ scores: [] });
  }
}
