import { supabase } from "../lib/supabase";

// 👥 GET ALL USERS
export async function getUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      role
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