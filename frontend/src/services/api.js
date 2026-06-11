import { supabase } from "../lib/supabase";

// Members
export async function getMembers() {
  const { data, error } = await supabase.from("members").select("*");
  if (error) throw error;
  return data;
}

export async function addMember(member) {
  const { data, error } = await supabase.from("members").insert([member]).select().single();
  if (error) throw error;
  return data;
}

export async function updateMember(id, changes) {
  const { data, error } = await supabase.from("members").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMember(id) {
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Projects
export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) throw error;
  return data;
}

export async function addProject(project) {
  const { data, error } = await supabase.from("projects").insert([project]).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, changes) {
  const { data, error } = await supabase.from("projects").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Tasks
export async function getTasks() {
  const { data, error } = await supabase.from("tasks").select("*");
  if (error) throw error;
  return data;
}

export async function addTask(task) {
  const { data, error } = await supabase.from("tasks").insert([task]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(id, changes) {
  const { data, error } = await supabase.from("tasks").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function getComments(taskId) {
  const { data, error } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(taskId, author, body) {
  const { data, error } = await supabase
    .from("task_comments")
    .insert([{ task_id: taskId, author, body }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Profiles / Users
export async function getProfiles() {
  const { data, error } = await supabase.from("profiles").select("id, full_name, role");
  if (error) throw error;
  return data;
}

export async function updateProfileRole(id, role) {
  const { data, error } = await supabase.from("profiles").update({ role }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export default {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
  getProjects,
  getTasks,
};
