import { supabase } from "../lib/supabase";

export async function getTasks() {
  const { data, error } =
    await supabase
      .from("tasks")
  .select(`
  id,
  title,
  description,
  status,
  priority,
  progress,
  due_date,
  created_at,
  project_id,
  created_by,
  assignee_id,

  projects (
    id,
    name,
    status
  ),

  creator:profiles!tasks_created_by_fkey (
    id,
    full_name,
    role
  ),

  task_assignees (
    id,
    user_id,

    profiles (
      id,
      full_name,
      role,
      email
    )
  )
`)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "GET TASKS ERROR:",
      error
    );

    throw error;
  }

  return data || [];
}

export async function createTask(
  task
) {
  const { data, error } =
    await supabase
      .from("tasks")
      .insert([task])
      .select()
      .maybeSingle();

  if (error) {
    console.error(
      "CREATE TASK ERROR:",
      error
    );

    throw error;
  }

  return data;
}

export async function updateTask(
  id,
  updates
) {
  const { data, error } =
    await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

  if (error) {
    console.error(
      "UPDATE TASK ERROR:",
      error
    );

    throw error;
  }

  return data;
}

export async function deleteTask(
  id
) {
  await supabase
    .from("task_assignees")
    .delete()
    .eq("task_id", id);

  const { error } =
    await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE TASK ERROR:",
      error
    );

    throw error;
  }

  return true;
}

export const assignTaskUsers = async (
  taskId,
  userIds
) => {

  const { error: deleteError } =
    await supabase
      .from("task_assignees")
      .delete()
      .eq("task_id", taskId);

  if (deleteError) {
    throw deleteError;
  }

  if (!userIds.length) return;

  const assignments =
    userIds.map((userId) => ({
      task_id: taskId,
      user_id: userId,
    }));

  const { error } =
    await supabase
      .from("task_assignees")
      .insert(assignments);

  if (error) {
    throw error;
  }
};

export async function getTaskAssignees(
  task_id
) {
  const { data, error } =
    await supabase
      .from("task_assignees")
      .select(`
        id,
        task_id,
        user_id,

        profiles (
          id,
          full_name,
          role,
          email
        )
      `)
      .eq("task_id", task_id);

  if (error) {
    console.error(
      "GET ASSIGNEES ERROR:",
      error
    );

    throw error;
  }

  return data || [];
}

export async function removeTaskAssignee(
  id
) {
  const { error } =
    await supabase
      .from("task_assignees")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "REMOVE ASSIGNEE ERROR:",
      error
    );

    throw error;
  }

  return true;
}
