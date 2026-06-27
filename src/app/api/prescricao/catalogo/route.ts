import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, parseAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const [rows] = await db.execute(
      "SELECT * FROM medicamentos_catalogo WHERE ativo = 1 ORDER BY classe, principio_ativo"
    );

    return NextResponse.json({ medicamentos: rows });
  } catch (error) {
    console.error("Error fetching drug catalog:", error);
    return NextResponse.json({ medicamentos: [] });
  }
}
