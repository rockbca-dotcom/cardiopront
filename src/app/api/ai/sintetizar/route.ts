import { NextRequest, NextResponse } from "next/server";

import { getServerUser } from "@/lib/auth-server";
import { synthesizeConsultation } from "@/lib/openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const transcricao = typeof body?.transcricao === "string" ? body.transcricao : "";

    if (!transcricao.trim()) {
      return NextResponse.json({ error: "Transcrição é obrigatória" }, { status: 400 });
    }

    const sintese = await synthesizeConsultation(transcricao);

    return NextResponse.json({ sintese });
  } catch (error) {
    console.error("Synthesis error:", error);
    const message = error instanceof Error ? error.message : "Erro na síntese";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
