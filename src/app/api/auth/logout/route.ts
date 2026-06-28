import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logout realizado" });
  clearAuthCookie(response);
  return response;
}
