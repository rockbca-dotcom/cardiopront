import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { data } = await supabaseAdmin
      .from("tipos_exame")
      .select("*")
      .eq("ativo", true)
      .order("categoria")
      .order("nome");

    return NextResponse.json({ tipos: data || [] });
  } catch (error) {
    console.error("Error fetching exam catalog:", error);
    return NextResponse.json({ tipos: [] });
  }
}
