import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) return NextResponse.json({ pacientes: 0, consultas: 0, exames: 0 });

    const [{ count: pacientes }, { count: consultas }, { data: consultaIds }] = await Promise.all([
      supabaseAdmin.from("pacientes").select("*", { count: "exact", head: true }).eq("medico_id", medico.id),
      supabaseAdmin.from("consultas").select("*", { count: "exact", head: true }).eq("medico_id", medico.id),
      supabaseAdmin.from("consultas").select("id").eq("medico_id", medico.id),
    ]);

    const { count: examesCount } = await supabaseAdmin
      .from("exames")
      .select("*", { count: "exact", head: true })
      .in("consulta_id", consultaIds?.map(c => c.id) || []);

    return NextResponse.json({
      pacientes: pacientes || 0,
      consultas: consultas || 0,
      exames: examesCount || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ pacientes: 0, consultas: 0, exames: 0 });
  }
}
