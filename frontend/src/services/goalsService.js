import { supabase } from "../lib/supabase";

// GET GOALS
export async function getGoals() {
  const { data, error } = await supabase
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

// CREATE GOAL
export async function createGoal(goal) {
  const { data, error } = await supabase
    .from("goals")
    .insert([goal])
    .select();

  if (error) throw error;

  return data[0];
}

// UPDATE GOAL
export async function updateGoal(id, updates) {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data[0];
}

// DELETE GOAL
export async function deleteGoal(id) {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id);

  if (error) throw error;
}