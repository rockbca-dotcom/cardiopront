import { supabaseAdmin } from "./db";

export async function getServerUser() {
  const { data } = await supabaseAdmin.auth.getUser();
  return data.user;
}
