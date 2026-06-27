import { NextRequest, NextResponse } from "next/server";
import { verifyToken, parseAuthHeader } from "@/lib/auth";
import { transcribeAudio } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum áudio enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const transcription = await transcribeAudio(buffer);

    return NextResponse.json({ transcricao: transcription });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Erro na transcrição" }, { status: 500 });
  }
}
