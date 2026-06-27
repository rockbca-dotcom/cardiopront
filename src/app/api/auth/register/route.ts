import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, crm, crm_uf, password } = await req.json();

    if (!nome || !email || !crm || !crm_uf || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    let user: { id: string } | null = null;
    let session: unknown = null;

    try {
      const result = await signUp(nome, email, password, crm, crm_uf);
      user = (result.user as { id: string } | null) ?? null;
      session = result.session;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar conta";
      if (message.includes("already registered") || message.includes("already exists")) {
        return NextResponse.json(
          { error: "Este e-mail já está cadastrado" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Erro ao criar conta" },
        { status: 400 }
      );
    }

    await supabaseAdmin.from("medicos").insert({
      auth_user_id: user.id,
      nome,
      crm,
      crm_uf: crm_uf,
      trial_fim: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    return NextResponse.json({
      session,
      user: { id: user.id },
      message: "Conta criada com sucesso",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
