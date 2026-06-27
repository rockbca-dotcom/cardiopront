import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, parseAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { id } = await params;

    const [rows] = await db.execute(
      "SELECT * FROM pacientes WHERE id = ? AND medico_id = ?",
      [id, payload.id]
    );

    const pacientes = rows as Array<Record<string, unknown>>;
    if (pacientes.length === 0) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ paciente: pacientes[0] });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 });
  }
}
