import { useState } from "react";
import { useEffect } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectsService";

import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";

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

function AdminProjects() {
  // STATE
  const [projects, setProjects] =
  useState([]);

   const [loading, setLoading] =
  useState(true);

  const [search, setSearch] =
    useState("");

    useEffect(() => {
  fetchProjects();
}, []);

const fetchProjects =
  async () => {
    try {
      const data =
        await getProjects();

      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // MODALS
  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  // SELECTED PROJECT
  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  // NEW PROJECT
  const [newProject, setNewProject] =
    useState({
      name: "",
      description: "",
      manager: "",
      members: [],
      status: "Planning",
      priority: "Medium",
      progress: 0,
      deadline: "",
      completedTasks: 0,
      totalTasks: 0,
    });

  // SEARCH FILTER
  const filteredProjects =
    projects.filter((project) =>
      project.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // KPI DATA
  const totalProjects =
    projects.length;

  const activeProjects =
    projects.filter(
      (project) =>
        project.status !==
        "Completed"
    ).length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length;

  const totalManagers =
    new Set(
      projects.map(
        (project) =>
          project.manager
      )
    ).size;

  // CREATE PROJECT
  const handleAddProject =
  async () => {
    try {
      const project = {
        ...newProject,

        members:
          newProject.members
            .split(",")
            .map((member) =>
              member.trim()
            ),
      };

      const createdProject =
        await createProject(
          project
        );

      setProjects([
        createdProject,
        ...projects,
      ]);

      setNewProject({
        name: "",
        description: "",
        manager: "",
        deadline: "",
        status: "Planning",
        priority: "Medium",
        progress: 0,
        members: "",
        completedTasks: 0,
        totalTasks: 0,
      });

      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  // DELETE
  const handleDeleteProject =
  async (id) => {
    try {
      await deleteProject(id);

      setProjects(
        projects.filter(
          (project) =>
            project.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // UPDATE
  const handleUpdateProject =
  async () => {
    try {
      const updatedProject =
        await updateProject(
          editProject.id,
          editProject
        );

      setProjects(
        projects.map((project) =>
          project.id ===
          updatedProject.id
            ? updatedProject
            : project
        )
      );

      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  // PRIORITY COLORS
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Projects Overview
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage all company projects,
            managers, and progress.
          </p>

        </div>

        <button
          onClick={() =>
            setIsCreateOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl transition"
        >

          <Plus size={18} />

          Create Project

        </button>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Projects
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalProjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <FolderKanban className="text-emerald-600" />

            </div>

          </div>

        </div>

        {/* ACTIVE */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Active Projects
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {activeProjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <Clock3 className="text-blue-600" />

            </div>

          </div>

        </div>

        {/* COMPLETED */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {completedProjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

              <CheckCircle2 className="text-purple-600" />

            </div>

          </div>

        </div>

        {/* MANAGERS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Managers
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalManagers}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">

              <Users className="text-amber-600" />

            </div>

          </div>

        </div>

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
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        />

      </div>

      {/* PROJECTS TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 dark:bg-zinc-950">

              <tr>

                <th className="text-left px-6 py-5 text-sm font-semibold dark:text-white">
                  Project
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold dark:text-white">
                  Manager
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold dark:text-white">
                  Status
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold dark:text-white">
                  Progress
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold dark:text-white">
                  Priority
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold dark:text-white">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProjects.map(
                (project) => (
                  <tr
                    key={project.id}
                    className="border-t border-slate-200 dark:border-zinc-800"
                  >

                    {/* PROJECT */}
                    <td className="px-6 py-5">

                      <div>

                        <h3 className="font-semibold dark:text-white">
                          {project.name}
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                          {
                            project.description
                          }
                        </p>

                      </div>

                    </td>

                    {/* MANAGER */}
                    <td className="px-6 py-5 dark:text-white">

                      {project.manager}

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">

                        {project.status}

                      </span>

                    </td>

                    {/* PROGRESS */}
                    <td className="px-6 py-5">

                      <div className="w-40">

                        <div className="flex items-center justify-between mb-2">

                          <span className="text-sm dark:text-white">
                            {
                              project.progress
                            }
                            %
                          </span>

                        </div>

                        <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2">

                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>

                    {/* PRIORITY */}
                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          project.priority
                        )}`}
                      >

                        {project.priority}

                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        {/* VIEW */}
                        <button
                          onClick={() => {
                            setSelectedProject(
                              project
                            );

                            setIsDetailsOpen(
                              true
                            );
                          }}
                          className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
                        >

                          <Eye size={18} />

                        </button>

                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setSelectedProject(
                              project
                            );

                            setIsEditOpen(
                              true
                            );
                          }}
                          className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center hover:bg-amber-200 transition"
                        >

                          <Pencil size={18} />

                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDeleteProject(
                              project.id
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                        >

                          <Trash2
                            size={18}
                          />

                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODALS */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() =>
          setIsCreateOpen(false)
        }
        newProject={newProject}
        setNewProject={setNewProject}
        handleCreateProject={
          handleCreateProject
        }
      />

      <EditProjectModal
        isOpen={isEditOpen}
        onClose={() =>
          setIsEditOpen(false)
        }
        selectedProject={
          selectedProject
        }
        setSelectedProject={
          setSelectedProject
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
        selectedProject={
          selectedProject
        }
      />

    </div>
  );
}

export default AdminProjects;