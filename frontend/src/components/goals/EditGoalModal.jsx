import { X, Target, Flag, CalendarDays, Users, FolderKanban } from "lucide-react";

function EditGoalModal({
  isOpen,
  onClose,
  selectedGoal,
  setSelectedGoal,
  handleUpdateGoal,
  users,
  projects,
  profile,
  roleMode,
}) {
  if (!isOpen || !selectedGoal)
    return null;


  const role =
    (roleMode || profile?.role)
      ?.toLowerCase()
      ?.trim();

  let filteredUsers = [];

  if (role === "admin") {
    filteredUsers =
      users?.filter(
        (user) =>
          user.role?.toLowerCase() !== "admin" ||
          user.id === selectedGoal.owner_id
      ) || [];
  }

  else if (
    role === "manager"
  ) {
    filteredUsers =
      users?.filter(
        (user) =>
          user.manager_id ===
            profile?.id &&
          user.role?.toLowerCase() !== "admin" ||
          user.id === selectedGoal.owner_id
      ) || [];
  }

  else {
    filteredUsers =
      users?.filter(
        (user) =>
          user.id ===
          profile?.id
      ) || [];
  }


  const priorityStyles = {
    High: "text-red-600",
    Medium:
      "text-amber-600",
    Low: "text-emerald-600",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">


        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-6">

          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

          <div className="relative flex items-start justify-between">

            <div className="flex items-start gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">

                <Target size={30} />

              </div>

              <div>

                <h2 className="text-3xl font-bold text-white">
                  Edit Goal
                </h2>

                <p className="text-emerald-50 mt-2 max-w-lg">
                  Update goal details,
                  assignments, progress
                  and targets.
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >

              <X size={20} />

            </button>

          </div>

        </div>


        <div className="p-5 space-y-5">

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">

              <Target size={16} />

              Goal Title

            </label>

            <input
              type="text"
              value={
                selectedGoal.title ||
                ""
              }
              onChange={(e) =>
                setSelectedGoal({
                  ...selectedGoal,
                  title:
                    e.target.value,
                })
              }
              placeholder="Increase team productivity..."
              className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition"
            />

          </div>

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">

              <Flag size={16} />

              Description

            </label>

            <textarea
              rows={5}
              value={
                selectedGoal.description ||
                ""
              }
              onChange={(e) =>
                setSelectedGoal({
                  ...selectedGoal,
                  description:
                    e.target.value,
                })
              }
              placeholder="Describe the objective, targets and expected outcome..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none resize-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition"
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">

                <FolderKanban size={16} />

                Project

              </label>

              <select
                value={
                  selectedGoal.project_id ||
                  ""
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    project_id:
                      e.target.value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition"
              >

                <option value="">
                  Select Project
                </option>

                {projects?.map(
                  (project) => (
                    <option
                      key={
                        project.id
                      }
                      value={
                        project.id
                      }
                    >
                      {project.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">

                <Users size={16} />

                Assigned To

              </label>

              <select
                value={
                  selectedGoal.owner_id ||
                  ""
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    owner_id:
                      e.target.value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition"
              >

                <option value="">
                  Select User
                </option>

                {filteredUsers.map(
                  (user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {
                        user.full_name
                      }
                      {" â€¢ "}
                      {user.role}
                      {user.department ? ` · ${user.department}` : ""}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">

                <Flag size={16} />

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
                className={`w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition font-semibold ${
                  priorityStyles[
                    selectedGoal
                      .priority
                  ] ||
                  "text-slate-700 dark:text-white"
                }`}
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

            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">

                <CalendarDays size={16} />

                Target Date

              </label>

              <input
                type="date"
                value={
                  selectedGoal.target_date ||
                  ""
                }
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    target_date:
                      e.target.value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 transition"
              />

            </div>

          </div>

        </div>


        <div className="sticky bottom-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex items-center justify-end gap-4">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={
              handleUpdateGoal
            }
            className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditGoalModal;
