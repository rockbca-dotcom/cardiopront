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

    if (!medico) return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });

    const { data } = await supabaseAdmin
      .from("pacientes")
      .select("*")
      .eq("id", id)
      .eq("medico_id", medico.id)
      .single();

    if (!data) return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });

    return NextResponse.json({ paciente: data });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 });
  }
}
