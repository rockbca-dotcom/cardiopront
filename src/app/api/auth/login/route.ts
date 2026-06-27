import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    let data: { user: { id: string } | null; session: unknown };
    try {
      const result = await signIn(email, password);
      data = result as unknown as { user: { id: string } | null; session: unknown };
    } catch {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const { data: medico } = await supabaseAdmin
      .from("medicos")
      .select("id, nome, crm, crm_uf, plano")
      .eq("auth_user_id", data.user.id)
      .single();

    return NextResponse.json({
      session: data.session,
      user: { id: data.user.id },
      medico,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
