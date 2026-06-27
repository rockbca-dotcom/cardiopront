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
      "SELECT * FROM pacientes WHERE medico_id = ? ORDER BY nome",
      [payload.id]
    );

    return NextResponse.json({ pacientes: rows });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ pacientes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { nome, nascimento, sexo, cpf, telefone, email, tipo_sanguineo, peso_kg, altura_cm, alergias } = await req.json();

    const [result] = await db.execute(
      "INSERT INTO pacientes (medico_id, nome, nascimento, sexo, cpf, telefone, email, tipo_sanguineo, peso_kg, altura_cm, alergias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [payload.id, nome, nascimento, sexo || null, cpf || null, telefone || null, email || null, tipo_sanguineo || null, peso_kg || null, altura_cm || null, alergias || null]
    );

    return NextResponse.json({ id: (result as { insertId: number }).insertId, message: "Paciente cadastrado" });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: "Erro ao cadastrar paciente" }, { status: 500 });
  }
}
