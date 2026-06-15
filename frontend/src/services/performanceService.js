import { supabase } from "../lib/supabase";

/* ==============================
   GET PERFORMANCE OVERVIEW
============================== */
export async function getPerformanceOverview() {

  // TOTAL EMPLOYEES
  const {
    count: employeesCount,
    error: employeesError,
  } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    })
    .in("role", ["manager", "member"]);

  if (employeesError)
    throw employeesError;

  // COMPLETED TASKS
  const {
    count: completedTasks,
    error: completedError,
  } = await supabase
    .from("tasks")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "Completed");

  if (completedError)
    throw completedError;

  // PENDING TASKS
  const {
    count: pendingTasks,
    error: pendingError,
  } = await supabase
    .from("tasks")
    .select("*", {
      count: "exact",
      head: true,
    })
    .neq("status", "Completed");

  if (pendingError)
    throw pendingError;

  // PRODUCTIVITY
  const totalTasks =
    completedTasks + pendingTasks;

  const productivity =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0;

  return {
    employeesCount,
    completedTasks,
    pendingTasks,
    productivity,
  };
}

/* ==============================
   GET TEAM RANKINGS
============================== */
export async function getTeamRankings() {

  const { data, error } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        tasks!tasks_assignee_id_fkey (
          id,
          status
        )
      `)
      .in("role", ["manager", "member"]);

  if (error) throw error;

  const rankings = data.map(
    (employee) => {

      const tasks =
        employee.tasks || [];

      const completed =
        tasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;

      const pending =
        tasks.filter(
          (task) =>
            task.status !==
            "Completed"
        ).length;

      const total =
        completed + pending;

      const productivity =
        total > 0
          ? Math.round(
              (completed /
                total) *
                100
            )
          : 0;

      return {
        id: employee.id,
        name:
          employee.full_name,
        role: employee.role,
        completed,
        pending,
        productivity,
        attendance: "100%",
      };
    }
  );

  rankings.sort(
    (a, b) =>
      b.productivity -
      a.productivity
  );

  return rankings;
}

/* ==============================
   GET TOP PERFORMER
============================== */
export async function getTopPerformer() {

  const rankings =
    await getTeamRankings();

  return rankings[0] || null;
}