import { supabase } from "../lib/supabase";

// 🔥 GET TASKS
export async function getTasks() {
  const { data, error } =
    await supabase
      .from("tasks")
      .select(`
        *,
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

// ➕ CREATE TASK
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

// ✏️ UPDATE TASK
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

// 🗑 DELETE TASK
export async function deleteTask(
  id
) {
  // 🔥 DELETE ASSIGNEES FIRST
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

// 👥 ASSIGN USERS TO TASK
export async function assignTaskUsers(
  task_id,
  user_ids = []
) {
  if (!task_id) return [];

  // 🔥 REMOVE OLD ASSIGNEES
  await supabase
    .from("task_assignees")
    .delete()
    .eq("task_id", task_id);

  // 🔥 NO USERS
  if (
    !Array.isArray(user_ids) ||
    user_ids.length === 0
  ) {
    return [];
  }

  const rows = user_ids.map(
    (user_id) => ({
      task_id,
      user_id,
    })
  );

  const { data, error } =
    await supabase
      .from("task_assignees")
      .insert(rows)
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
      `);

  if (error) {
    console.error(
      "ASSIGN TASK USERS ERROR:",
      error
    );

    throw error;
  }

  return data || [];
}

// 🔍 GET TASK ASSIGNEES
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

// ❌ REMOVE ASSIGNEE
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