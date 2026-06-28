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

    if (!medico) return NextResponse.json({ exames: [] });

    const { data: consultas } = await supabaseAdmin
      .from("consultas")
      .select("id")
      .eq("medico_id", medico.id);

    const consultaIds = consultas?.map((c) => c.id) || [];

    const { data } = await supabaseAdmin
      .from("exames")
      .select("*, tipos_exame(nome, categoria), pacientes(nome)")
      .in("consulta_id", consultaIds)
      .order("data_pedido", { ascending: false });

    const normalized = (data || []).map((exame) => ({
      ...exame,
      consulta_id: exame.consulta_id,
      tipo_exame_nome: exame.tipos_exame?.nome || "Exame",
      tipo_exame_categoria: exame.tipos_exame?.categoria || "outros",
      paciente_nome: exame.pacientes?.nome || "Paciente não informado",
    }));

    return NextResponse.json({ exames: normalized });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json({ exames: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("exames")
      .insert({
        consulta_id: body.consulta_id,
        paciente_id: body.paciente_id,
        tipo_exame_id: body.tipo_exame_id,
        prioridade: body.prioridade || "rotina",
        indicacao_clinica: body.indicacao_clinica || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ exame: data, message: "Exame pedido" });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ error: "Erro ao pedir exame" }, { status: 500 });
  }
}
