import { supabase } from "../lib/supabase";

async function list(table, column, value, order = "created_at") {
  const { data, error } = await supabase.from(table).select("*").eq(column, value).order(order, { ascending: false });
  if (error) throw error;
  return data || [];
}

async function create(table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

async function update(table, id, payload) {
  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

async function remove(table, id) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export const getSubtasks = (taskId) => list("tasks", "parent_task_id", taskId);
export const createSubtask = (taskId, payload) => create("tasks", { ...payload, parent_task_id: taskId });
export const getTaskDependencies = (taskId) => list("task_dependencies", "task_id", taskId);
export const addTaskDependency = (taskId, dependsOnTaskId) => create("task_dependencies", { task_id: taskId, depends_on_task_id: dependsOnTaskId });
export const removeTaskDependency = (id) => remove("task_dependencies", id);
export const getTimeEntries = (taskId) => list("time_entries", "task_id", taskId, "entry_date");
export const addTimeEntry = (taskId, payload) => create("time_entries", { ...payload, task_id: taskId });
export const removeTimeEntry = (id) => remove("time_entries", id);
export const getAttachments = (recordType, recordId) => supabase.from("work_attachments").select("*").eq("record_type", recordType).eq("record_id", recordId).order("created_at", { ascending: false }).then(({ data, error }) => { if (error) throw error; return data || []; });
export const addAttachment = (payload) => create("work_attachments", payload);
export const removeAttachment = (id) => remove("work_attachments", id);
export const getProjectMilestones = (projectId) => list("project_milestones", "project_id", projectId, "due_date");
export const createProjectMilestone = (projectId, payload) => create("project_milestones", { ...payload, project_id: projectId });
export const updateProjectMilestone = (id, payload) => update("project_milestones", id, payload);
export const getProjectStatusUpdates = (projectId) => list("project_status_updates", "project_id", projectId);
export const createProjectStatusUpdate = (projectId, payload) => create("project_status_updates", { ...payload, project_id: projectId });
export const getGoalKeyResults = (goalId) => list("goal_key_results", "goal_id", goalId);
export const createGoalKeyResult = (goalId, payload) => create("goal_key_results", { ...payload, goal_id: goalId });
export const updateGoalKeyResult = (id, payload) => update("goal_key_results", id, { ...payload, updated_at: new Date().toISOString() });
export const getActivityEvents = (projectId) => list("activity_events", "project_id", projectId);
export const recordActivity = (payload) => create("activity_events", payload);
export const getSavedViews = (userId, page) => supabase.from("saved_views").select("*").or(`user_id.eq.${userId},is_shared.eq.true`).eq("page", page).order("name").then(({ data, error }) => { if (error) throw error; return data || []; });
export const saveView = (payload) => create("saved_views", payload);
export const deleteSavedView = (id) => remove("saved_views", id);
export const getNotificationPreferences = async (userId) => { const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle(); if (error) throw error; return data; };
export const saveNotificationPreferences = async (userId, payload) => { const { data, error } = await supabase.from("notification_preferences").upsert({ ...payload, user_id: userId, updated_at: new Date().toISOString() }).select().single(); if (error) throw error; return data; };
