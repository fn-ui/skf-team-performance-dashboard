import { supabase } from "../lib/supabase";

export async function getAdminReportStats() {
  try {
    const {
      data: tasks,
      error: tasksError,
    } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        status,
        priority,
        due_date,
        created_at,
        project_id,
        task_assignees (
          user_id,
          profiles (
            id,
            full_name,
            role
          )
        )
      `);

    if (tasksError) throw tasksError;

    const {
      data: projects,
      error: projectsError,
    } = await supabase
      .from("projects")
      .select(`
        id,
        name,
        description,
        status,
        progress,
        created_at,
        manager_id
      `);

    if (projectsError) throw projectsError;

    const {
      data: users,
      error: usersError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        role,
        manager_id,
        created_at
      `);

    if (usersError) throw usersError;


    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    );

    const pendingTasks = tasks.filter(
      (task) => task.status === "Pending"
    );

    const inProgressTasks = tasks.filter(
      (task) =>
        task.status === "In Progress"
    );

    const overdueTasks = tasks.filter(
      (task) =>
        task.due_date &&
        new Date(task.due_date) < new Date() &&
        task.status !== "Completed"
    );


    const admins = users.filter(
      (user) => user.role === "admin"
    );

    const managers = users.filter(
      (user) => user.role === "manager"
    );

    const members = users.filter(
      (user) => user.role === "member"
    );


    const completedProjects =
      projects.filter(
        (project) =>
          project.status === "Completed"
      );

    const activeProjects =
      projects.filter(
        (project) =>
          project.status === "Active"
      );

    const pendingProjects =
      projects.filter(
        (project) =>
          project.status === "Pending"
      );


    const productivity =
      tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks.length /
              tasks.length) *
              100
          );


    const highPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "High"
      );

    const mediumPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "Medium"
      );

    const lowPriorityTasks =
      tasks.filter(
        (task) =>
          task.priority === "Low"
      );


    const recentTasks = [...tasks]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 10);


    const recentProjects = [...projects]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )
      .slice(0, 10);


    const memberPerformance =
      members.map((member) => {
        const memberTasks =
          tasks.filter((task) =>
            task.task_assignees?.some(
              (assignee) =>
                assignee.user_id ===
                member.id
            )
          );

        const completed =
          memberTasks.filter(
            (task) =>
              task.status ===
              "Completed"
          ).length;

        const pending =
          memberTasks.filter(
            (task) =>
              task.status !==
              "Completed"
          ).length;

        const productivity =
          memberTasks.length === 0
            ? 0
            : Math.round(
                (completed /
                  memberTasks.length) *
                  100
              );

        return {
          id: member.id,
          member: member.full_name,
          role: member.role,
          totalTasks:
            memberTasks.length,
          completedTasks:
            completed,
          pendingTasks: pending,
          productivity,
        };
      });


    return {
      tasks: tasks || [],
      projects: projects || [],
      users: users || [],

      totalTasks: tasks.length,
      completedTasks:
        completedTasks.length,
      pendingTasks:
        pendingTasks.length,
      inProgressTasks:
        inProgressTasks.length,
      overdueTasks:
        overdueTasks.length,

      totalProjects:
        projects.length,
      completedProjects:
        completedProjects.length,
      activeProjects:
        activeProjects.length,
      pendingProjects:
        pendingProjects.length,

      totalUsers: users.length,
      totalAdmins:
        admins.length,
      totalManagers:
        managers.length,
      totalMembers:
        members.length,

      productivity,

      highPriorityTasks:
        highPriorityTasks.length,
      mediumPriorityTasks:
        mediumPriorityTasks.length,
      lowPriorityTasks:
        lowPriorityTasks.length,

      recentTasks,
      recentProjects,

      memberPerformance,
    };
  } catch (error) {
    console.error(
      "REPORT SERVICE ERROR:",
      error.message
    );

    return {
      tasks: [],
      projects: [],
      users: [],

      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,

      totalProjects: 0,
      completedProjects: 0,
      activeProjects: 0,
      pendingProjects: 0,

      totalUsers: 0,
      totalAdmins: 0,
      totalManagers: 0,
      totalMembers: 0,

      productivity: 0,

      highPriorityTasks: 0,
      mediumPriorityTasks: 0,
      lowPriorityTasks: 0,

      recentTasks: [],
      recentProjects: [],

      memberPerformance: [],
    };
  }
}
