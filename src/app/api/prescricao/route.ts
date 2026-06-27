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
      `SELECT pr.*, p.nome as paciente_nome
       FROM prescricoes pr
       JOIN pacientes p ON pr.paciente_id = p.id
       JOIN consultas c ON pr.consulta_id = c.id
       WHERE c.medico_id = ?
       ORDER BY pr.data_prescricao DESC`,
      [payload.id]
    );

    return NextResponse.json({ prescricoes: rows });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ prescricoes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { consulta_id, paciente_id, medicamento, principio_ativo, dose, unidade, frequencia, posologia, via, advertencias } = await req.json();

    const [result] = await db.execute(
      "INSERT INTO prescricoes (consulta_id, paciente_id, data_prescricao, medicamento, principio_ativo, dose, unidade, frequencia, posologia, via, advertencias) VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?)",
      [consulta_id, paciente_id, medicamento, principio_ativo || null, dose || null, unidade || null, frequencia || null, posologia || null, via || null, advertencias || null]
    );

    return NextResponse.json({ id: (result as { insertId: number }).insertId, message: "Prescrição salva" });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Erro ao salvar prescrição" }, { status: 500 });
  }
}
