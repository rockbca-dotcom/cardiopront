import { cookies } from "next/headers";
import { supabaseAdmin } from "./db";
import {
  AUTH_COOKIE_NAME,
  formatAuthUser,
  type MedicoAuthRow,
} from "./auth-session";

export async function getServerUser() {
  const cookieStore = await cookies();
  const authUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value?.trim();
  if (!authUserId) return null;

  const { data, error } = await supabaseAdmin
    .from("medicos")
    .select(
      "id, auth_user_id, nome, email, crm, crm_uf, especialidade, telefone, assinatura_data_url, plano, trial_fim",
    )
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error || !data) return null;
  return formatAuthUser(data as MedicoAuthRow);
}
