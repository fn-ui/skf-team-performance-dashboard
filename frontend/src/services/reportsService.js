import { supabase } from "../lib/supabase";

// 📊 ADMIN REPORT STATS
export async function getAdminReportStats() {
  // TASKS
  const { data: tasks, error: tasksError } =
    await supabase
      .from("tasks")
      .select(`
        id,
        status,
        priority,
        created_at,
        task_assignees (
          user_id
        )
      `);

  if (tasksError) throw tasksError;

  // PROJECTS
  const {
    data: projects,
    error: projectsError,
  } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      progress
    `);

  if (projectsError) throw projectsError;

  // USERS
  const { data: users, error: usersError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role
      `);

  if (usersError) throw usersError;

  return {
    tasks: tasks || [],
    projects: projects || [],
    users: users || [],
  };
}