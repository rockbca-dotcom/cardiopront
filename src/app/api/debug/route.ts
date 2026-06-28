import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-session";
import { getServerUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getServerUser();
    const session = cookies().get(AUTH_COOKIE_NAME)?.value || null;

    return NextResponse.json({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSessionCookie: !!session,
      user: user
        ? {
            id: user.id,
            email: user.email,
            nome: user.nome,
            crm: user.crm,
          }
        : null,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: "debug_failed" }, { status: 500 });
  }
}
