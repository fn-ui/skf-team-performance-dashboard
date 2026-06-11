import {
  X,
  CalendarDays,
  User,
  Flag,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

function GoalDetailsModal({
  isOpen,
  onClose,
  goal,
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

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Goal Details
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              Full goal information and
              progress.
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

        {/* BODY */}
        <div className="p-6 space-y-8">

          {/* TITLE */}
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
                {goal.priority}
              </span>

            </div>

            <p className="text-slate-500 dark:text-zinc-400 mt-4 leading-relaxed">
              {goal.description}
            </p>

          </div>

          {/* PROGRESS */}
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
                {goal.progress}%
              </p>

            </div>

            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-4">

              <div
                className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${goal.progress}%`,
                }}
              />

            </div>

          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ASSIGNED */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <User className="text-blue-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Assigned To
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.assignedTo}
                  </h3>

                </div>

              </div>

            </div>

            {/* DEADLINE */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <CalendarDays className="text-amber-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Deadline
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.deadline}
                  </h3>

                </div>

              </div>

            </div>

            {/* STATUS */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-emerald-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Status
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.status}
                  </h3>

                </div>

              </div>

            </div>

            {/* PRIORITY */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <Flag className="text-red-500" />

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Priority
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {goal.priority}
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* MILESTONES */}
          <div>

            <h3 className="text-xl font-bold dark:text-white mb-5">
              Milestones
            </h3>

            <div className="space-y-4">

              {goal.milestones?.map(
                (milestone, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 dark:bg-zinc-950 rounded-2xl p-4"
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-4 h-4 rounded-full ${
                          milestone.completed
                            ? "bg-emerald-500"
                            : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      />

                      <p className="dark:text-white font-medium">
                        {
                          milestone.title
                        }
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        milestone.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {milestone.completed
                        ? "Completed"
                        : "Pending"}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default GoalDetailsModal;