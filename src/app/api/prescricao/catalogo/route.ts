import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { data } = await supabaseAdmin
      .from("medicamentos_catalogo")
      .select("*")
      .eq("ativo", true)
      .order("classe")
      .order("principio_ativo");

    return NextResponse.json({ medicamentos: data || [] });
  } catch (error) {
    console.error("Error fetching drug catalog:", error);
    return NextResponse.json({ medicamentos: [] });
  }
}
