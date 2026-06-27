import { supabase } from "./db";

export async function getServerUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
