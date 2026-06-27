import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, parseAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = parseAuthHeader(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const [rows] = await db.execute(
      "SELECT * FROM tipos_exame WHERE ativo = 1 ORDER BY categoria, nome"
    );

    return NextResponse.json({ tipos: rows });
  } catch (error) {
    console.error("Error fetching exam catalog:", error);
    return NextResponse.json({ tipos: [] });
  }
}
