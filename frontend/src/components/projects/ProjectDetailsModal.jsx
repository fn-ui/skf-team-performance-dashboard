import {
  CalendarDays,
  CheckCircle2,
  Users,
} from "lucide-react";

function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  mode = "admin",
}) {
  if (!isOpen || !project)
    return null;

  const isManager =
    mode === "manager";

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

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "Planning":
        return "bg-amber-100 text-amber-700";

      case "Development":
        return "bg-blue-100 text-blue-700";

      case "Testing":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between gap-6">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              {project.name}
            </h2>

            <p className="mt-3 text-slate-500 dark:text-zinc-400">
              {project.description}
            </p>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>

        </div>

        {/* STATUS + PRIORITY */}
        <div className="mb-8 flex flex-wrap gap-4">

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${getPriorityColor(
              project.priority
            )}`}
          >
            {project.priority} Priority
          </span>

        </div>

        {/* PROGRESS */}
        <div className="mb-8">

          <div className="mb-3 flex items-center justify-between">

            <p className="font-medium dark:text-white">
              Project Progress
            </p>

            <p className="font-bold dark:text-white">
              {project.progress || 0}%
            </p>

          </div>

          <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-zinc-800">

            <div
              className="h-4 rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${
                  project.progress || 0
                }%`,
              }}
            />

          </div>

        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          
          {/* MANAGER */}
              {mode !== "manager" && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

                <p className="text-slate-500 dark:text-zinc-400 text-sm mb-2">
                  Project Manager
                </p>

                <h3 className="text-lg font-bold dark:text-white">
                  {project.manager?.full_name ||
                    "No manager assigned"}
                </h3>

                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  {project.manager?.email || ""}
                </p>

              </div>
            )}
          {/* DEADLINE */}
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800">

            <div className="mb-2 flex items-center gap-2">

              <CalendarDays
                size={18}
                className="text-slate-400"
              />

              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Deadline
              </p>

            </div>

            <h3 className="text-lg font-bold dark:text-white">
              {project.deadline ||
                "No deadline"}
            </h3>

          </div>

          {/* TASKS */}
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800">

            <div className="mb-2 flex items-center gap-2">

              <CheckCircle2
                size={18}
                className="text-slate-400"
              />

              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Tasks Completed
              </p>

            </div>

            <h3 className="text-lg font-bold dark:text-white">
              {
                project.completed_tasks
              }
              /
              {project.total_tasks}
            </h3>

          </div>

          {/* MEMBERS */}
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800">

            <div className="mb-3 flex items-center gap-2">

              <Users
                size={18}
                className="text-slate-400"
              />

              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Team Members
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              {project.project_members
                ?.length > 0 ? (
                project.project_members.map(
                  (member) => (
                    <span
                      key={member.id}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"
                    >
                      {
                        member.profiles
                          ?.full_name
                      }
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  No members assigned
                </p>
              )}

            </div>

          </div>

        </div>

        {/* MANAGER EXTRA SECTION */}
        {isManager && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">

            <h3 className="mb-2 text-lg font-bold text-emerald-700 dark:text-emerald-400">
              Manager Notes
            </h3>

            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              You can monitor project progress,
              update status, and coordinate
              assigned members from your
              dashboard.
            </p>

          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10 flex items-center justify-end">

          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-white transition hover:bg-emerald-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetailsModal;