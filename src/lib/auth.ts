"use client";

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  crm: string;
  crmUf: string;
  especialidade?: string | null;
  telefone?: string | null;
  plano?: string;
  trial_fim?: string | null;
  medico?: {
    id: string;
    auth_user_id: string;
    nome: string;
    email: string;
    crm: string;
    crm_uf: string;
    especialidade?: string | null;
    telefone?: string | null;
    plano?: string;
    trial_fim?: string | null;
  };
}

type AuthResponse = {
  user: AuthUser;
  message?: string;
};

function cacheToken(userId?: string | null) {
  if (typeof window === "undefined" || !userId) return;
  localStorage.setItem("token", userId);
}

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });

  const raw = await res.text();
  let data: any = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { message: raw };
    }
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "Erro de conexão");
  }

  return data as T;
}

export async function signUp(
  nome: string,
  email: string,
  password: string,
  crm: string,
  crmUf: string,
) {
  const data = await requestJson<AuthResponse>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      email,
      password,
      crm,
      crm_uf: crmUf,
    }),
  });

  cacheToken(data.user?.id);
  return data;
}

export async function signIn(email: string, password: string) {
  const data = await requestJson<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  cacheToken(data.user?.id);
  return data;
}

export async function signOut() {
  try {
    await requestJson<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    clearToken();
  }
}

export async function getSession() {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    clearToken();
    return null;
  }

  const data = await res.json().catch(() => null);
  if (data?.user?.id) cacheToken(data.user.id);
  return data;
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}
