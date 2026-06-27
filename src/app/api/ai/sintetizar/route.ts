import { NextRequest, NextResponse } from "next/server";
import { verifyToken, parseAuthHeader } from "@/lib/auth";
import { synthesizeConsultation } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { transcricao } = await req.json();

    if (!transcricao) {
      return NextResponse.json({ error: "Transcrição é obrigatória" }, { status: 400 });
    }

    const sintese = await synthesizeConsultation(transcricao);

    return NextResponse.json({ sintese: JSON.parse(sintese) });
  } catch (error) {
    console.error("Synthesis error:", error);
    return NextResponse.json({ error: "Erro na síntese" }, { status: 500 });
  }
}
