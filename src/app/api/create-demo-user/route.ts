import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// This endpoint creates the demo user using Supabase Auth signup API
// The doctor profile will be created by the auth trigger
export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const demoUser = {
    email: "demo@cardiopront.com.br",
    password: "CardioDemo2026!",
    options: {
      data: {
        nome: "Dr. Demo Cardiologista",
        crm: "123456",
        crm_uf: "SP",
        especialidade: "Cardiologia",
      }
    }
  };

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(demoUser),
    });

    const data = await response.json();

    if (!response.ok) {
      // If user already exists, that's fine
      if (data.msg?.includes("already registered") || data.message?.includes("already registered")) {
        return NextResponse.json({
          success: true,
          message: "Usuario ja existe",
          credentials: { email: demoUser.email, password: demoUser.password }
        });
      }
      return NextResponse.json({
        success: false,
        error: data.message || data.msg || "Erro ao criar usuario"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Usuario demo criado com sucesso!",
      credentials: { email: demoUser.email, password: demoUser.password },
      user: data.user
    });
  } catch (error) {
    console.error("Error creating demo user:", error);
    return NextResponse.json({
      success: false,
      error: "Erro de rede ao criar usuario"
    });
  }
}
