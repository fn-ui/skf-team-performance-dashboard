import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { projects } from "../../data/projectsData";

import ProjectDetailsModal from "./ProjectDetailsModal";
import EditProjectModal from "./EditProjectModal";

import {
  FolderKanban,
  Search,
  Eye,
  Pencil,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

function ManagerProjects() {
  const { profile } = useAuth();

  // FILTER MANAGER PROJECTS
  const managerProjects =
    projects.filter(
      (project) =>
        project.manager ===
        profile?.full_name
    );

  const [projectList, setProjectList] =
    useState(managerProjects);

  const [search, setSearch] =
    useState("");

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  // FILTERED
  const filteredProjects =
    projectList.filter((project) =>
      project.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // KPI
  const activeProjects =
    projectList.filter(
      (project) =>
        project.status !==
        "Completed"
    ).length;

  const completedProjects =
    projectList.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length;

  const totalMembers =
    new Set(
      projectList.flatMap(
        (project) =>
          project.members
      )
    ).size;

  // UPDATE
  const handleUpdateProject = () => {
    setProjectList(
      projectList.map((project) =>
        project.id ===
        selectedProject.id
          ? selectedProject
          : project
      )
    );

    setIsEditOpen(false);
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

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Team Projects
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Manage and monitor your
          assigned projects.
        </p>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TOTAL */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Projects
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {projectList.length}
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

        {/* MEMBERS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Team Members
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalMembers}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

              <Users className="text-purple-600" />

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

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredProjects.map(
          (project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-4">

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

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
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

              {/* DETAILS */}
              <div className="space-y-4 mt-6">

                <div className="flex items-center justify-between">

                  <p className="text-slate-500 dark:text-zinc-400">
                    Status
                  </p>

                  <p className="font-semibold text-blue-600">
                    {project.status}
                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-slate-500 dark:text-zinc-400">
                    Tasks
                  </p>

                  <p className="font-semibold dark:text-white">

                    {
                      project.completedTasks
                    }
                    /
                    {project.totalTasks}

                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-4 mt-8">

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
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-2xl transition"
                >

                  <Eye size={18} />

                  View Details

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
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-2xl transition"
                >

                  <Pencil size={18} />

                  Update

                </button>

              </div>

            </div>
          )
        )}

      </div>

      {/* EMPTY STATE */}
      {filteredProjects.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">

          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">

            <FolderKanban
              size={36}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">
            No Projects Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No projects match your
            search.
          </p>

        </div>

      )}

      {/* MODALS */}
      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
        selectedProject={
          selectedProject
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

    </div>
  );
}

export default ManagerProjects;