import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: "Configuracao incompleta" });
  }

  const supabase = createClient(supabaseUrl, anonKey);

  // Try to sign up the demo user
  const { data, error } = await supabase.auth.signUp({
    email: "demo@cardiopront.com.br",
    password: "CardioDemo2026!",
    options: {
      data: {
        nome: "Dr. Demo Cardiologista",
        crm: "123456",
        crm_uf: "SP",
      },
    },
  });

  if (error) {
    // If user already exists, try to sign in
    if (error.message.includes("already") || error.message.includes("registered")) {
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email: "demo@cardiopront.com.br",
        password: "CardioDemo2026!",
      });

      if (signinError) {
        return NextResponse.json({
          success: false,
          error: signinError.message,
          step: "signin"
        });
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("medicos")
        .select("id")
        .eq("auth_user_id", signinData.user!.id)
        .maybeSingle();

      if (!existingProfile) {
        // Create profile
        const { data: profile } = await supabase
          .from("medicos")
          .insert({
            auth_user_id: signinData.user!.id,
            nome: "Dr. Demo Cardiologista",
            crm: "123456",
            crm_uf: "SP",
            especialidade: "Cardiologia",
            plano: "profissional",
            trial_fim: "2027-12-31",
          })
          .select()
          .single();

        return NextResponse.json({
          success: true,
          message: "Perfil criado para usuario existente",
          userId: signinData.user!.id,
          doctorId: profile?.id,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Usuario ja existe e esta ativo",
        userId: signinData.user!.id,
      });
    }

    return NextResponse.json({
      success: false,
      error: error.message,
      step: "signup"
    });
  }

  // User was created successfully
  const userId = data.user?.id;

  if (userId) {
    // Create doctor profile
    const { data: profile } = await supabase
      .from("medicos")
      .insert({
        auth_user_id: userId,
        nome: "Dr. Demo Cardiologista",
        crm: "123456",
        crm_uf: "SP",
        especialidade: "Cardiologia",
        plano: "profissional",
        trial_fim: "2027-12-31",
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      message: "Usuario demo criado com sucesso!",
      userId,
      doctorId: profile?.id,
    });
  }

  return NextResponse.json({
    success: false,
    error: "Erro desconhecido ao criar usuario",
  });
}
