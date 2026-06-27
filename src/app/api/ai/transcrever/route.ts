import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { transcribeAudio } from "@/lib/openai";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

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
