import { supabase } from "../lib/supabase";

export async function getSprints() {
  const { data, error } = await supabase.from("sprints").select("*, projects(id, name, manager_id), sprint_members(user_id, capacity_hours, profiles(id, full_name, role)), sprint_standups(id, user_id, standup_date, completed, planned, blockers, profiles(id, full_name, role))").order("start_date", { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function createSprint(payload) { const { data, error } = await supabase.from("sprints").insert(payload).select().single(); if (error) throw error; return data; }
export async function updateSprint(id, payload) { const { data, error } = await supabase.from("sprints").update(payload).eq("id", id).select().single(); if (error) throw error; return data; }
export async function assignTaskToSprint(taskId, sprintId) { const { error } = await supabase.from("tasks").update({ sprint_id: sprintId || null }).eq("id", taskId); if (error) throw error; }
export async function updateTaskEstimate(taskId, storyPoints, estimatedHours) { const { error } = await supabase.from("tasks").update({ story_points: Number(storyPoints) || 0, estimated_hours: estimatedHours === "" ? null : Number(estimatedHours) }).eq("id", taskId); if (error) throw error; }
export async function saveSprintMember(sprintId, userId, capacityHours) { const { error } = await supabase.from("sprint_members").upsert({ sprint_id: sprintId, user_id: userId, capacity_hours: Number(capacityHours) || 0 }); if (error) throw error; }
export async function saveStandup(sprintId, userId, payload) { const { error } = await supabase.from("sprint_standups").upsert({ sprint_id: sprintId, user_id: userId, standup_date: new Date().toISOString().slice(0, 10), ...payload, updated_at: new Date().toISOString() }, { onConflict: "sprint_id,user_id,standup_date" }); if (error) throw error; }
