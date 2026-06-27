import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEMO_USER = {
  email: "demo@cardiopront.com.br",
  password: "CardioDemo2026!",
  nome: "Dr. Demo Cardiologista",
  crm: "123456",
  crm_uf: "SP",
  especialidade: "Cardiologia",
};

export async function GET() {
  try {
    // First check if user already exists
    const { data: existing } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("crm", DEMO_USER.crm)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Usuario demo ja existe",
        credentials: { email: DEMO_USER.email, password: DEMO_USER.password }
      });
    }

    // Check all doctors to see if email exists
    const { data: existingEmail } = await supabaseAdmin
      .from("medicos")
      .select("id")
      .eq("email", DEMO_USER.email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json({
        success: true,
        message: "Usuario demo ja existe (por email)",
        credentials: { email: DEMO_USER.email, password: DEMO_USER.password }
      });
    }

    // Create the doctor profile
    // Note: The auth user needs to be created via Supabase Dashboard or signup API
    // For now, we'll create the profile and use Supabase Auth signup flow
    const { data, error } = await supabaseAdmin
      .from("medicos")
      .insert({
        nome: DEMO_USER.nome,
        email: DEMO_USER.email,
        crm: DEMO_USER.crm,
        crm_uf: DEMO_USER.crm_uf,
        especialidade: DEMO_USER.especialidade,
        plano: "profissional",
        trial_fim: "2027-12-31",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({
      success: true,
      message: "Perfil demo criado. Use a tela de cadastro para criar a conta de acesso.",
      credentials: { email: DEMO_USER.email, password: DEMO_USER.password },
      doctor: { id: data.id, nome: data.nome, crm: data.crm }
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ success: false, error: "Erro ao criar usuario demo" });
  }
}
