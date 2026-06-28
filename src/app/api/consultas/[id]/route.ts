import { NextRequest, NextResponse } from "next/server";

import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { id } = await params;

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from("consultas")
      .select("*, pacientes(id, nome, nascimento, sexo, cpf, telefone, email)")
      .eq("id", id)
      .eq("medico_id", medico.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Consulta não encontrada" }, { status: 404 });

    return NextResponse.json({ consulta: data });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return NextResponse.json({ error: "Erro ao buscar consulta" }, { status: 500 });
  }
}
