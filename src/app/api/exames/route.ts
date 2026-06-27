import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, parseAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const [rows] = await db.execute(
      `SELECT e.*, te.nome as tipo_exame_nome, te.categoria, p.nome as paciente_nome
       FROM exames e
       JOIN tipos_exame te ON e.tipo_exame_id = te.id
       JOIN pacientes p ON e.paciente_id = p.id
       JOIN consultas c ON e.consulta_id = c.id
       WHERE c.medico_id = ?
       ORDER BY e.data_pedido DESC`,
      [payload.id]
    );

    return NextResponse.json({ exames: rows });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json({ exames: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { consulta_id, paciente_id, tipo_exame_id, prioridade, indicacao_clinica } = await req.json();

    const [result] = await db.execute(
      "INSERT INTO exames (consulta_id, paciente_id, tipo_exame_id, prioridade, indicacao_clinica, data_pedido) VALUES (?, ?, ?, ?, ?, CURDATE())",
      [consulta_id, paciente_id, tipo_exame_id, prioridade || "rotina", indicacao_clinica || null]
    );

    return NextResponse.json({ id: (result as { insertId: number }).insertId, message: "Exame pedido" });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ error: "Erro ao pedir exame" }, { status: 500 });
  }
}
