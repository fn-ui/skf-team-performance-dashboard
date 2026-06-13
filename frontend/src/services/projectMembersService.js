import { supabase } from "../lib/supabase";

// GET MEMBERS OF A PROJECT
export async function getProjectMembers(projectId) {
  const { data, error } = await supabase
    .from("project_members")
    .select(`
      id,
      user_id,
      role,
      profiles (
        id,
        full_name,
        email,
        role
      )
    `)
    .eq("project_id", projectId);

  if (error) throw error;
  return data;
}

// ADD MEMBER
export async function addProjectMember(projectId, userId, role = "member") {
  const { data, error } = await supabase
    .from("project_members")
    .insert([{ project_id: projectId, user_id: userId, role }])
    .select();

  if (error) throw error;
  return data[0];
}

// REMOVE MEMBER
export async function removeProjectMember(id) {
  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", id);

  if (error) throw error;
}