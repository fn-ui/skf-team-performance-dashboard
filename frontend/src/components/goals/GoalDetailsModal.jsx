import {
  X,
  CalendarDays,
  User,
  Flag,
  TrendingUp,
  CheckCircle2,
  FolderKanban,
} from "lucide-react";
import GoalKeyResultsPanel from "./GoalKeyResultsPanel";

function GoalDetailsModal({
  isOpen,
  onClose,
  goal,
  roleMode = "member",
}) {
  if (!isOpen || !goal)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Goal Details
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              Full goal information and progress.
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >

            <X
              size={20}
              className="dark:text-white"
            />

          </button>

        </div>

        <div className="p-5 space-y-6">

          <div>

            <div className="flex items-center justify-between gap-4 flex-wrap">

              <h1 className="text-3xl font-bold dark:text-white">
                {goal.title}
              </h1>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                  goal.priority
                )}`}
              >
                {goal.priority || "Medium"}
              </span>

            </div>

            <p className="text-slate-500 dark:text-zinc-400 mt-4 leading-relaxed">
              {goal.description ||
                "No description provided."}
            </p>

          </div>

          <div>

            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">

                <TrendingUp
                  size={18}
                  className="text-emerald-500"
                />

                <p className="font-semibold dark:text-white">
                  Goal Progress
                </p>

              </div>

              <p className="font-bold dark:text-white">
                {goal.progress || 0}%
              </p>

            </div>

            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-4">

              <div
                className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    goal.progress || 0
                  }%`,
                }}
              />

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <User className="text-blue-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Assigned To
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.profiles
                      ?.full_name ||
                      "Not Assigned"}
                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <FolderKanban className="text-violet-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Project
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.projects?.name ||
                      "No Project"}
                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <CalendarDays className="text-amber-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Target Date
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.target_date ||
                      "No Date"}
                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-emerald-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Status
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.status ||
                      "In Progress"}
                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5 md:col-span-2">

              <div className="flex items-center gap-3">

                <Flag className="text-red-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Priority
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.priority ||
                      "Medium"}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="px-5 pb-5">
          <GoalKeyResultsPanel goal={goal} roleMode={roleMode} />
        </div>

      </div>

    </div>
  );
}

export default GoalDetailsModal;
