import { X } from "lucide-react";

function EditGoalModal({
  isOpen,
  onClose,
  selectedGoal,
  setSelectedGoal,
  handleUpdateGoal,
  users,
  projects,
}) {
  if (!isOpen || !selectedGoal)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">

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
        <div className="p-6 space-y-6">

          {/* TITLE */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Goal Title
            </label>

            <input
              type="text"
              value={selectedGoal.title || ""}
              onChange={(e) =>
                setSelectedGoal({
                  ...selectedGoal,
                  title: e.target.value,
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
                selectedGoal.description || ""
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

          {/* PROJECT + ASSIGNED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* PROJECT */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Project
              </label>

              <select
                value={
                  selectedGoal.project_id || ""
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    project_id:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option value="">
                  Select Project
                </option>

                {projects?.map(
                  (project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  )
                )}

              </select>

            </div>

           {/* ASSIGNED TO */}
                  <div>

                    <label className="block text-sm font-medium dark:text-white mb-2">
                      Assigned To
                    </label>

                    <select
                      value={
                        selectedGoal.owner_id || ""
                      }
                      onChange={(e) =>
                        setSelectedGoal({
                          ...selectedGoal,
                          owner_id:
                            e.target.value,
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

          </div>

          {/* PRIORITY + PROGRESS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* PRIORITY */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Priority
              </label>

              <select
                value={
                  selectedGoal.priority ||
                  "Medium"
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

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>

              </select>

            </div>

            

          </div>

          {/* TARGET DATE */}
              <div>

                <label className="block text-sm font-medium dark:text-white mb-2">
                  Target Date
                </label>

                <input
                  type="date"
                  value={
                    selectedGoal.target_date || ""
                  }
                  onChange={(e) =>
                    setSelectedGoal({
                      ...selectedGoal,
                      target_date:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
                />

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