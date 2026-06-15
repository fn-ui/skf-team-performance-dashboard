import { supabase } from "../lib/supabase";

/* ================= GET PROJECTS ================= */

export async function getProjects() {
  const { data, error } =
    await supabase
      .from("projects")
      .select(`
        *,
        
        manager:profiles!projects_manager_id_fkey (
          id,
          full_name,
          email,
          role
        ),

        project_members (
          id,
          user_id,
          role,

          profiles (
            id,
            full_name,
            role,
            email
          )
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "GET PROJECTS ERROR:",
      error
    );

    throw error;
  }

  /* FORMAT DATA */

  const formatted =
    (data || []).map(
      (project) => ({
        ...project,

        manager_name:
          project.manager
            ?.full_name || "",

        members:
          project.project_members?.map(
            (member) => ({
              id:
                member.profiles?.id,

              full_name:
                member.profiles
                  ?.full_name,

              role:
                member.profiles
                  ?.role,
            })
          ) || [],
      })
    );

  return formatted;
}

/* ================= CREATE PROJECT ================= */

export async function createProject(
  project
) {
  const payload = {
    name: project.name,

    description:
      project.description,

    manager_id:
      project.manager_id || null,

    status:
      project.status ||
      "Planning",

    priority:
      project.priority ||
      "Medium",

    progress:
      project.progress || 0,

    deadline:
      project.deadline || null,

    completed_tasks:
      project.completed_tasks ||
      0,

    total_tasks:
      project.total_tasks || 0,
  };

  const { data, error } =
    await supabase
      .from("projects")
      .insert([payload])
      .select(`
        *,
        
        manager:profiles!projects_manager_id_fkey (
          id,
          full_name,
          email,
          role
        )
      `)
      .maybeSingle();

  if (error) {
    console.error(
      "CREATE PROJECT ERROR:",
      error
    );

    throw error;
  }

  return {
    ...data,

    manager_name:
      data.manager
        ?.full_name || "",
  };
}

/* ================= UPDATE PROJECT ================= */

export async function updateProject(
  id,
  updates
) {
  const payload = {
    name: updates.name,

    description:
      updates.description,

    manager_id:
      updates.manager_id ||
      null,

    status:
      updates.status,

    priority:
      updates.priority,

    progress:
      updates.progress,

    deadline:
      updates.deadline,

    completed_tasks:
      updates.completed_tasks,

    total_tasks:
      updates.total_tasks,

    updated_at:
      new Date().toISOString(),
  };

  const { data, error } =
    await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select(`
        *,

        manager:profiles!projects_manager_id_fkey (
          id,
          full_name,
          email,
          role
        )
      `)
      .maybeSingle();

  if (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error
    );

    throw error;
  }

  return {
    ...data,

    manager_name:
      data.manager
        ?.full_name || "",
  };
}

/* ================= DELETE PROJECT ================= */

export async function deleteProject(
  id
) {
  const { error } =
    await supabase
      .from("projects")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE PROJECT ERROR:",
      error
    );

    throw error;
  }

  return true;
}

/* ================= ASSIGN MEMBERS ================= */

export async function assignProjectMembers(
  projectId,
  members
) {
  /* REMOVE OLD MEMBERS */

  const {
    error: deleteError,
  } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    console.error(
      "DELETE MEMBERS ERROR:",
      deleteError
    );

    throw deleteError;
  }

  /* NO MEMBERS */

  if (!members?.length) {
    return [];
  }

  /* INSERT NEW MEMBERS */

  const membersToInsert =
    members.map((userId) => ({
      project_id: projectId,

      user_id: userId,

      role: "member",
    }));

  const { data, error } =
    await supabase
      .from("project_members")
      .insert(membersToInsert)
      .select();

  if (error) {
    console.error(
      "ASSIGN MEMBERS ERROR:",
      error
    );

    throw error;
  }

  return data;
}

/* ================= GET SINGLE PROJECT ================= */

export async function getProjectById(
  id
) {
  const { data, error } =
    await supabase
      .from("projects")
      .select(`
        *,

        manager:profiles!projects_manager_id_fkey (
          id,
          full_name,
          email,
          role
        ),

        project_members (
          id,
          user_id,
          role,

          profiles (
            id,
            full_name,
            role,
            email
          )
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "GET PROJECT ERROR:",
      error
    );

    throw error;
  }

  return {
    ...data,

    manager_name:
      data.manager
        ?.full_name || "",

    members:
      data.project_members?.map(
        (member) => ({
          id:
            member.profiles?.id,

          full_name:
            member.profiles
              ?.full_name,

          role:
            member.profiles
              ?.role,
        })
      ) || [],
  };
}