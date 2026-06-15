import {
  CalendarDays,
  FolderKanban,
  Flag,
  CheckCircle2,
} from "lucide-react";

function TaskDetailsModal({
  isOpen,
  onClose,
  task,
}) {
  if (!isOpen || !task) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-emerald-100 text-emerald-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="text-3xl font-bold dark:text-white">
              {task.title}
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Full task details and progress information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
          >
            Close
          </button>

        </div>

        {/* STATUS + PRIORITY */}
        <div className="flex flex-wrap items-center gap-3 mt-8">

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority} Priority
          </span>

        </div>

        {/* TASK INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

         {/* PROJECT */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <div className="flex items-center gap-3">

              <div className="bg-purple-100 p-3 rounded-xl">
                <FolderKanban
                  size={22}
                  className="text-purple-600"
                />
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  Project
                </p>

                <h3 className="font-bold dark:text-white mt-1">
              {task.projects?.name ||
              "No project"}
                </h3>
              </div>

            </div>

          </div>

          {/* DEADLINE */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <div className="flex items-center gap-3">

              <div className="bg-amber-100 p-3 rounded-xl">
                <CalendarDays
                  size={22}
                  className="text-amber-600"
                />
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  Due Date
                </p>

                <h3 className="font-bold dark:text-white mt-1">
                  {task.due_date ||
                   "No due date"}
                </h3>
              </div>

            </div>

          </div>

          {/* PROGRESS */}
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-5">

            <div className="flex items-center gap-3">

              <div className="bg-emerald-100 p-3 rounded-xl">
                <CheckCircle2
                  size={22}
                  className="text-emerald-600"
                />
              </div>

              <div className="w-full">
                <p className="text-slate-500 text-sm">
                  Progress
                </p>

                <h3 className="font-bold dark:text-white mt-1 mb-3">
                  {task.progress}%
                </h3>

                <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-3">

                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{
                      width: `${task.progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-10">

          <div className="flex items-center gap-3 mb-4">

            <div className="bg-red-100 p-3 rounded-xl">
              <Flag
                size={22}
                className="text-red-600"
              />
            </div>

            <h3 className="text-xl font-bold dark:text-white">
              Task Description
            </h3>

          </div>

          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-6">

            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
              {task.description}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TaskDetailsModal;