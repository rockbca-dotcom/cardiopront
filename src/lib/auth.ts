"use client";

import { supabase } from "./db";

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  crm: string;
  crmUf: string;
  plano: string;
}

export async function signUp(nome: string, email: string, password: string, crm: string, crmUf: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, crm, crm_uf: crmUf },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signIn(email: string, password: string) {
  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
