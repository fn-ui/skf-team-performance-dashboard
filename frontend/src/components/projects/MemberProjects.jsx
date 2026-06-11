import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../contexts/AuthContext";

import {
  FolderKanban,
  Search,
  Eye,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { getProjects } from "../../services/projectsService";

import ProjectDetailsModal from "./ProjectDetailsModal";

function MemberProjects() {
  const { profile } = useAuth();

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects =
    async () => {
      try {
        const data =
          await getProjects();

        const memberProjects =
          data.filter((project) =>
            project.members?.includes(
              profile?.full_name
            )
          );

        setProjects(
          memberProjects
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const filteredProjects =
    projects.filter((project) =>
      project.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

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
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          My Projects
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Projects assigned to you.
        </p>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Projects
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {projects.length}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <FolderKanban className="text-emerald-600" />

            </div>

          </div>

        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Active
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {
                  projects.filter(
                    (project) =>
                      project.status !==
                      "Completed"
                  ).length
                }
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <Clock3 className="text-blue-600" />

            </div>

          </div>

        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {
                  projects.filter(
                    (project) =>
                      project.status ===
                      "Completed"
                  ).length
                }
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <CheckCircle2 className="text-emerald-600" />

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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 dark:text-white"
                >

                  <Eye size={18} />

                  View Details

                </button>

              </div>

            </div>
          )
        )}

      </div>

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

export default MemberProjects;