import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
}) {
  if (!isOpen || !project)
    return null;

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

      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-6 mb-8">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              {project.name}
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-3">
              {project.description}
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>

        </div>

        {/* STATUS + PRIORITY */}
        <div className="flex flex-wrap gap-4 mb-8">

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(
              project.priority
            )}`}
          >
            {project.priority} Priority
          </span>

        </div>

        {/* PROGRESS */}
        <div className="mb-8">

          <div className="flex items-center justify-between mb-3">

            <p className="font-medium dark:text-white">
              Project Progress
            </p>

            <p className="font-bold dark:text-white">
              {project.progress}%
            </p>

          </div>

          <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-4">

            <div
              className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${project.progress}%`,
              }}
            />

          </div>

        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* MANAGER */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-2">
              Project Manager
            </p>

            <h3 className="text-lg font-bold dark:text-white">
              {project.manager}
            </h3>

          </div>

          {/* DEADLINE */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <div className="flex items-center gap-2 mb-2">

              <CalendarDays
                size={18}
                className="text-slate-400"
              />

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Deadline
              </p>

            </div>

            <h3 className="text-lg font-bold dark:text-white">
              {project.deadline}
            </h3>

          </div>

          {/* TASKS */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <div className="flex items-center gap-2 mb-2">

              <CheckCircle2
                size={18}
                className="text-slate-400"
              />

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
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
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <div className="flex items-center gap-2 mb-3">

              <Users
                size={18}
                className="text-slate-400"
              />

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Team Members
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              {project.members?.map(
                (member, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"
                  >
                    {member}
                  </span>
                )
              )}

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetailsModal;