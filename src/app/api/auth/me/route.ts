import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id, nome, crm, crm_uf, plano, trial_fim")
      .eq("auth_user_id", user.id)
      .single();

    if (!medico) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user: { ...user, medico } });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
