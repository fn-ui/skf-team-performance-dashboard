import { X } from "lucide-react";

function CreateGoalModal({
  isOpen,
  onClose,
  newGoal,
  setNewGoal,
  handleCreateGoal,
  users,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Create New Goal
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Create and assign a new organizational goal.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center transition"
          >

            <X
              size={20}
              className="dark:text-white"
            />

          </button>

        </div>

        {/* FORM */}
        <div className="space-y-6">

          {/* TITLE */}
          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Goal Title
            </label>

            <input
              type="text"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  title: e.target.value,
                })
              }
              placeholder="Enter goal title"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Description
            </label>

            <textarea
              rows={4}
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  description:
                    e.target.value,
                })
              }
              placeholder="Goal description..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

          {/* ASSIGNED + DEPARTMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ASSIGNED TO */}
            <div>

              <label className="block mb-2 font-semibold dark:text-white">
                Assigned To
              </label>

              <select
                value={newGoal.owner_id}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    owner_id: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option value="">
                  Select User
                </option>

                {users?.map((user) => (

                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.full_name}
                  </option>

                ))}

              </select>

            </div>

            {/* DEPARTMENT */}
            <div>

              <label className="block mb-2 font-semibold dark:text-white">
                Department
              </label>

              <input
                type="text"
                value={newGoal.department || ""}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    department:
                      e.target.value,
                  })
                }
                placeholder="Department"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

          </div>

          {/* PRIORITY */}
          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Priority
            </label>

            <select
              value={newGoal.priority}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
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

          {/* TARGET DATE */}
          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Target Date
            </label>

            <input
              type="date"
              value={newGoal.target_date || ""}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  target_date:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateGoal}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            Create Goal
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateGoalModal;