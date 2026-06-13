import { supabase } from "../lib/supabase";

// 🔥 GET PROJECTS
export async function getProjects() {
  const { data, error } =
    await supabase
      .from("projects")
      .select(`
        *,
        project_members (
          id,
          user_id,
          role,
          profiles (
            id,
            full_name,
            role
          )
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "GET PROJECTS ERROR:",
      error
    );

    throw error;
  }

  return data || [];
}

// ➕ CREATE PROJECT
export async function createProject(
  project
) {
  const { data, error } =
    await supabase
      .from("projects")
      .insert([project])
      .select()
      .maybeSingle();

  if (error) {
    console.error(
      "CREATE PROJECT ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// ✏️ UPDATE PROJECT
export async function updateProject(
  id,
  updates
) {
  const { data, error } =
    await supabase
      .from("projects")
      .update({
        ...updates,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

  if (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// 🗑 DELETE PROJECT
export async function deleteProject(
  id
) {
  const { error } =
    await supabase
      .from("projects")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE PROJECT ERROR:",
      error
    );

    throw error;
  }

  return true;
}

// 👥 ASSIGN MEMBERS TO PROJECT
export async function assignProjectMembers(
  projectId,
  members
) {
  // REMOVE OLD MEMBERS
  const { error: deleteError } =
    await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId);

  if (deleteError) {
    console.error(
      "DELETE MEMBERS ERROR:",
      deleteError
    );

    throw deleteError;
  }

  // NO MEMBERS
  if (!members?.length) {
    return [];
  }

  // INSERT NEW MEMBERS
  const membersToInsert =
    members.map((userId) => ({
      project_id: projectId,
      user_id: userId,
      role: "member",
    }));

  const { data, error } =
    await supabase
      .from("project_members")
      .insert(membersToInsert)
      .select();

  if (error) {
    console.error(
      "ASSIGN MEMBERS ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// 👤 GET SINGLE PROJECT
export async function getProjectById(
  id
) {
  const { data, error } =
    await supabase
      .from("projects")
      .select(`
        *,
        project_members (
          id,
          user_id,
          role,
          profiles (
            id,
            full_name,
            role
          )
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "GET PROJECT ERROR:",
      error
    );

    throw error;
  }

  return data;
}