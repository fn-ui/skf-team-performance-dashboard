import { X } from "lucide-react";

function EditGoalModal({
  isOpen,
  onClose,
  selectedGoal,
  setSelectedGoal,
  handleUpdateGoal,
}) {
  if (!isOpen || !selectedGoal)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Edit Goal
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              Update goal information.
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
        <div className="p-6 space-y-5">

          {/* TITLE */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Goal Title
            </label>

            <input
              type="text"
              value={selectedGoal.title}
              onChange={(e) =>
                setSelectedGoal({
                  ...selectedGoal,
                  title:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Description
            </label>

            <textarea
              rows={4}
              value={
                selectedGoal.description
              }
              onChange={(e) =>
                setSelectedGoal({
                  ...selectedGoal,
                  description:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ASSIGNED TO */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Assigned To
              </label>

              <input
                type="text"
                value={
                  selectedGoal.assignedTo
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    assignedTo:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

            {/* DEADLINE */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Deadline
              </label>

              <input
                type="date"
                value={
                  selectedGoal.deadline
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    deadline:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* STATUS */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Status
              </label>

              <select
                value={
                  selectedGoal.status
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    status:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option>
                  In Progress
                </option>

                <option>
                  Completed
                </option>

              </select>

            </div>

            {/* PRIORITY */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Priority
              </label>

              <select
                value={
                  selectedGoal.priority
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    priority:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option>
                  High
                </option>

                <option>
                  Medium
                </option>

                <option>
                  Low
                </option>

              </select>

            </div>

            {/* PROGRESS */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Progress %
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  selectedGoal.progress
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    progress:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-zinc-800">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateGoal}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditGoalModal;