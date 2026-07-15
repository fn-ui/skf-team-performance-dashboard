import { supabase } from "../lib/supabase";

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

export async function addProjectMember(projectId, userId, role = "member") {
  const { data, error } = await supabase
    .from("project_members")
    .insert([{ project_id: projectId, user_id: userId, role }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function removeProjectMember(id) {
  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
