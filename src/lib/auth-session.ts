import { randomBytes, pbkdf2Sync, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "cp_session";

const PASSWORD_ALGORITHM = "pbkdf2_sha256";
const PASSWORD_ITERATIONS = 210000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_DIGEST = "sha256";

export type MedicoAuthRow = {
  id: string;
  auth_user_id: string;
  nome: string;
  email: string;
  crm: string;
  crm_uf: string;
  especialidade: string | null;
  telefone: string | null;
  assinatura_data_url?: string | null;
  plano: "trial" | "essencial" | "profissional" | "clinica";
  trial_fim: string | null;
  senha_hash?: string | null;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = pbkdf2Sync(
    password,
    salt,
    PASSWORD_ITERATIONS,
    PASSWORD_KEY_LENGTH,
    PASSWORD_DIGEST,
  ).toString("hex");

  return `${PASSWORD_ALGORITHM}$${PASSWORD_ITERATIONS}$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationsRaw, salt, derivedHex] = storedHash.split("$");

  if (
    algorithm !== PASSWORD_ALGORITHM ||
    !iterationsRaw ||
    !salt ||
    !derivedHex
  ) {
    return false;
  }

  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;

  const computed = pbkdf2Sync(
    password,
    salt,
    iterations,
    derivedHex.length / 2,
    PASSWORD_DIGEST,
  );

  const stored = Buffer.from(derivedHex, "hex");
  if (stored.length !== computed.length) return false;

  return timingSafeEqual(stored, computed);
}

export function formatAuthUser(medico: MedicoAuthRow) {
  return {
    id: medico.auth_user_id,
    email: medico.email,
    nome: medico.nome,
    crm: medico.crm,
    crmUf: medico.crm_uf,
    especialidade: medico.especialidade,
    telefone: medico.telefone,
    assinatura_data_url: medico.assinatura_data_url ?? null,
    plano: medico.plano,
    trial_fim: medico.trial_fim,
    medico: {
      id: medico.id,
      auth_user_id: medico.auth_user_id,
      nome: medico.nome,
      email: medico.email,
      crm: medico.crm,
      crm_uf: medico.crm_uf,
      especialidade: medico.especialidade,
      telefone: medico.telefone,
      assinatura_data_url: medico.assinatura_data_url ?? null,
      plano: medico.plano,
      trial_fim: medico.trial_fim,
    },
  };
}

export function setAuthCookie(response: NextResponse, authUserId: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: authUserId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
