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

    if (!medico) return NextResponse.json({ prescricoes: [] });

    const { data: consultas } = await supabaseAdmin
      .from("consultas")
      .select("id")
      .eq("medico_id", medico.id);

    const consultaIds = consultas?.map((c) => c.id) || [];

    const { data } = await supabaseAdmin
      .from("prescricoes")
      .select("*, pacientes(nome)")
      .in("consulta_id", consultaIds)
      .order("data_prescricao", { ascending: false });

    const normalized = (data || []).map((prescricao) => ({
      ...prescricao,
      paciente_nome: prescricao.pacientes?.nome || "Paciente não informado",
    }));

    return NextResponse.json({ prescricoes: normalized });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ prescricoes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("prescricoes")
      .insert({
        consulta_id: body.consulta_id,
        paciente_id: body.paciente_id,
        medicamento: body.medicamento,
        principio_ativo: body.principio_ativo || null,
        dose: body.dose || null,
        unidade: body.unidade || null,
        frequencia: body.frequencia || null,
        posologia: body.posologia || null,
        via: body.via || null,
        advertencias: body.advertencias || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ prescricao: data, message: "Prescrição salva" });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Erro ao salvar prescrição" }, { status: 500 });
  }
}
