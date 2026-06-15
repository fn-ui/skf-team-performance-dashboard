import { useEffect, useState } from "react";


import { supabase } from "../../lib/supabase";

import {
  FolderKanban,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  assignProjectMembers,
} from "../../services/projectsService";

import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";

function AdminProjects() {
  // PROJECTS
  const [projects, setProjects] =
    useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // SEARCH
  const [search, setSearch] =
    useState("");

  // MODALS
  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  

  // SELECTED PROJECTS
  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [editProject, setEditProject] =
    useState(null);
//managers
    const [managers, setManagers] =
  useState([]);

  // NEW PROJECT
  const [newProject, setNewProject] =
    useState({
      name: "",
      description: "",
      manager_id: "",
      priority: "Medium",
      progress: 0,
      deadline: "",
      completed_tasks: 0,
      total_tasks: 0,
    });

    const fetchManagers =
  async () => {
    const { data, error } =
      await supabase
        .from("profiles")
        .select(
          "id, full_name"
        )
        .eq(
          "role",
          "Team Manager"
        );

    if (error) {
      console.error(error);
      return;
    }

    setManagers(data || []);
  };

  // FETCH PROJECTS
  useEffect(() => {
  fetchProjects();
  fetchManagers();
}, []);

  const fetchProjects =
    async () => {
      try {
        const data =
          await getProjects();

        setProjects(data || []);
      } catch (error) {
        console.error(
          "SUPABASE ERROR:",
          error.message,
          error.details,
          error.hint,
          error.code
        );
      } finally {
        setLoading(false);
      }
    };

  // ➕ CREATE PROJECT
  const handleAddProject =
    async () => {
      try {
        const payload = {
          ...newProject,
        };

        const createdProject =
          await createProject(
            payload
          );

        setProjects((prev) => [
          createdProject,
          ...prev,
        ]);

        setIsCreateOpen(false);

        setNewProject({
            name: "",
            description: "",
            manager_id: "",
            priority: "Medium",
            progress: 0,
            deadline: "",
            completed_tasks: 0,
            total_tasks: 0,
          });
      } catch (error) {
        console.error(
          "CREATE PROJECT ERROR:",
          error.message
        );
      }
    };

  // 🗑 DELETE PROJECT
  const handleDeleteProject =
    async (id) => {
      try {
        await deleteProject(id);

        setProjects((prev) =>
          prev.filter(
            (project) =>
              project.id !== id
          )
        );
      } catch (error) {
        console.error(
          "DELETE ERROR:",
          error.message
        );
      }
    };

  // ✏️ OPEN EDIT
  const handleOpenEdit = (
    project
  ) => {
    setEditProject(project);

    setIsEditOpen(true);
  };

  // 👁 OPEN DETAILS
  const handleOpenDetails = (
    project
  ) => {
    setSelectedProject(project);

    setIsDetailsOpen(true);
  };

  

  // 💾 UPDATE PROJECT
  const handleUpdateProject =
    async () => {
      if (!editProject?.id)
        return;

      try {
        const updatedProject =
          await updateProject(
            editProject.id,
            editProject
          );

        setProjects((prev) =>
          prev.map((project) =>
            project.id ===
            updatedProject.id
              ? updatedProject
              : project
          )
        );

        setIsEditOpen(false);

        setEditProject(null);
      } catch (error) {
        console.error(
          "UPDATE ERROR:",
          error.message
        );
      }
    };

  
  // 🔎 FILTERED PROJECTS
  const filteredProjects =
    projects.filter((project) =>
      project.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // 📊 STATS
  const completedProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length;

  const activeProjects =
    projects.filter(
      (project) =>
        project.status ===
        "In Progress"
    ).length;

  const planningProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Planning"
    ).length;

  // 🎨 PRIORITY COLOR
  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-amber-100 text-amber-700";

      case "Low":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="p-10 dark:text-white">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Projects
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage all projects.
          </p>

        </div>

        <button
          onClick={() =>
            setIsCreateOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl"
        >

          <Plus size={18} />

          Create Project

        </button>

      </div>

      {/* SEARCH */}
      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        />

      </div>

      {/* PROJECTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredProjects.map(
          (project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold dark:text-white">
                    {project.name}
                  </h2>

                  <p className="text-slate-500 dark:text-zinc-400 mt-2">
                    {
                      project.description
                    }
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                    project.priority
                  )}`}
                >
                  {project.priority}
                </span>

              </div>

              {/* PROGRESS */}
              <div className="mt-6">

                <div className="flex items-center justify-between mb-2">

                  <p className="text-sm dark:text-zinc-400">
                    Progress
                  </p>

                  <p className="font-semibold dark:text-white">
                    {project.progress}%
                  </p>

                </div>

                <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3">

                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 mt-8">

                <button
                  onClick={() => {
                    setSelectedProject(
                      project
                    );

                    setIsDetailsOpen(
                      true
                    );
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 dark:text-white"
                >

                  <Eye size={18} />

                  View

                </button>

                <button
  onClick={() =>
    handleOpenEdit(
      project
    )
  }
  className="flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition"
>

  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">

    <Pencil size={16} />

  </div>

  Edit

</button>

<button
  onClick={() =>
    handleDeleteProject(
      project.id
    )
  }
  className="px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
>

  <Trash2 size={18} />

</button>


              </div>

            </div>
          )
        )}

      </div>

      {/* MODALS */}
     <CreateProjectModal
          isOpen={isCreateOpen}
          onClose={() =>
            setIsCreateOpen(false)
          }
          newProject={newProject}
          setNewProject={setNewProject}
          handleAddProject={handleAddProject}
          managers={managers}
        />
      <EditProjectModal
        isOpen={isEditOpen}
        onClose={() =>
          setIsEditOpen(false)
        }
        editProject={editProject}
        setEditProject={
          setEditProject
        }
        handleUpdateProject={
          handleUpdateProject
        }
      />

      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
        project={selectedProject}
      />
      

    </div>
  );
}

export default AdminProjects;