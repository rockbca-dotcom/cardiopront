import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  // Return demo user credentials
  // The user should be created through the signup page at /cadastro
  return NextResponse.json({
    success: true,
    message: "Use estas credenciais na tela de cadastro",
    credentials: {
      email: "demo@cardiopront.com.br",
      password: "CardioDemo2026!",
      nome: "Dr. Demo Cardiologista",
      crm: "123456",
      crmUf: "SP",
      especialidade: "Cardiologia",
    },
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Demo user endpoint is working",
    credentials: {
      email: "demo@cardiopront.com.br",
      password: "CardioDemo2026!",
      nome: "Dr. Demo Cardiologista",
      crm: "123456",
      crmUf: "SP",
    },
  });
}
