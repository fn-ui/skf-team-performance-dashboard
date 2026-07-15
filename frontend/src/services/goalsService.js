import { supabase } from "../lib/supabase";

export async function getGoals() {

  const { data, error } =
    await supabase
      .from("goals")
      .select(`
        *,
        projects (
          id,
          name
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data;
}

export async function createGoal(goal) {

  const { data, error } =
    await supabase
      .from("goals")
      .insert([goal])
      .select(`
        *,
        projects (
          id,
          name
        )
      `);

  if (error) throw error;

  return data[0];
}

export async function updateGoal(
  id,
  updates
) {

  const { data, error } =
    await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        projects (
          id,
          name
        )
      `);

  if (error) throw error;

  return data[0];
}

export async function deleteGoal(id) {

  const { error } =
    await supabase
      .from("goals")
      .delete()
      .eq("id", id);

  if (error) throw error;
}
