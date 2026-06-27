import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, parseAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const [pacientes] = await db.execute(
      "SELECT COUNT(*) as count FROM pacientes WHERE medico_id = ?",
      [payload.id]
    );

    const [consultas] = await db.execute(
      "SELECT COUNT(*) as count FROM consultas WHERE medico_id = ?",
      [payload.id]
    );

    const [exames] = await db.execute(
      "SELECT COUNT(*) as count FROM exames e JOIN consultas c ON e.consulta_id = c.id WHERE c.medico_id = ?",
      [payload.id]
    );

    return NextResponse.json({
      pacientes: (pacientes as Array<{ count: number }>)[0].count,
      consultas: (consultas as Array<{ count: number }>)[0].count,
      exames: (exames as Array<{ count: number }>)[0].count,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ pacientes: 0, consultas: 0, exames: 0 });
  }
}
