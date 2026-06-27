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
      `SELECT c.*, p.nome as paciente_nome 
       FROM consultas c 
       JOIN pacientes p ON c.paciente_id = p.id 
       WHERE c.medico_id = ? 
       ORDER BY c.data_consulta DESC`,
      [payload.id]
    );

    return NextResponse.json({ consultas: rows });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json({ consultas: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const {
      paciente_id, data_consulta, tipo, motivo_consulta, queixa_principal,
      pa_sistolica, pa_diastolica, fc, peso_kg, altura_cm,
      diagnostico, cid10, conduta, orientacoes, sintese_ia
    } = await req.json();

    let imc = null;
    if (peso_kg && altura_cm) {
      const altura_m = altura_cm / 100;
      imc = parseFloat((peso_kg / (altura_m * altura_m)).toFixed(1));
    }

    const [result] = await db.execute(
      `INSERT INTO consultas (paciente_id, medico_id, data_consulta, tipo, motivo_consulta, queixa_principal, pa_sistolica, pa_diastolica, fc, peso_kg, altura_cm, imc, diagnostico, cid10, conduta, orientacoes, sintese_ia) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paciente_id, payload.id, data_consulta, tipo || "presencial", motivo_consulta, queixa_principal, pa_sistolica || null, pa_diastolica || null, fc || null, peso_kg || null, altura_cm || null, imc, diagnostico || null, cid10 || null, conduta || null, orientacoes || null, sintese_ia || null]
    );

    return NextResponse.json({ id: (result as { insertId: number }).insertId, message: "Consulta salva" });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json({ error: "Erro ao salvar consulta" }, { status: 500 });
  }
}
