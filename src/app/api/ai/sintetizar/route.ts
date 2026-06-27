import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { synthesizeConsultation } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

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
