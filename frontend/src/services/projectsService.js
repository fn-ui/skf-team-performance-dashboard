import { supabase } from "../supabaseClient";

// GET ALL PROJECTS
export async function getProjects() {
  const { data, error } =
    await supabase
      .from("projects")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data;
}

// CREATE PROJECT
export async function createProject(
  project
) {
  const { data, error } =
    await supabase
      .from("projects")
      .insert([project])
      .select();

  if (error) throw error;

  return data[0];
}

// UPDATE PROJECT
export async function updateProject(
  id,
  updates
) {
  const { data, error } =
    await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select();

  if (error) throw error;

  return data[0];
}

// DELETE PROJECT
export async function deleteProject(
  id
) {
  const { error } =
    await supabase
      .from("projects")
      .delete()
      .eq("id", id);

  if (error) throw error;
}