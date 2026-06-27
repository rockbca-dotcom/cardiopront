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
      .from("pacientes")
      .select("*")
      .eq("medico_id", medico.id)
      .order("nome");

    return NextResponse.json({ pacientes: data || [] });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ pacientes: [] });
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

    const { data, error } = await supabaseAdmin
      .from("pacientes")
      .insert({
        medico_id: medico.id,
        nome: body.nome,
        nascimento: body.nascimento,
        sexo: body.sexo || null,
        cpf: body.cpf || null,
        telefone: body.telefone || null,
        email: body.email || null,
        tipo_sanguineo: body.tipo_sanguineo || null,
        peso_kg: body.peso_kg || null,
        altura_cm: body.altura_cm || null,
        alergias: body.alergias || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ paciente: data, message: "Paciente cadastrado" });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: "Erro ao cadastrar paciente" }, { status: 500 });
  }
}
