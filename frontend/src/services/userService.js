import { supabase } from "../lib/supabase";

export async function getUsers() {
  const { data, error } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        manager_id,
        email
      `)
      .order("full_name", {
        ascending: true,
      });

  if (error) {
    console.error(
      "GET USERS ERROR:",
      error
    );

    throw error;
  }

  return data || [];
}
