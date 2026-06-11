function EditProjectModal({
  isOpen,
  onClose,
  editProject,
  setEditProject,
  handleUpdateProject,
}) {
  if (!isOpen || !editProject)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              Edit Project
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Update project information.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PROJECT NAME */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium dark:text-white mb-2">
              Project Name
            </label>

            <input
              type="text"
              value={editProject.name}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  name: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium dark:text-white mb-2">
              Description
            </label>

            <textarea
              rows={4}
              value={
                editProject.description
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  description:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none resize-none"
            />

          </div>

          {/* MANAGER */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Manager
            </label>

            <input
              type="text"
              value={
                editProject.manager
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  manager:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
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
                editProject.deadline
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  deadline:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
            />

          </div>

          {/* STATUS */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Status
            </label>

            <select
              value={
                editProject.status
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  status:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
            >

              <option>
                Planning
              </option>

              <option>
                Development
              </option>

              <option>
                Testing
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
                editProject.priority
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  priority:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
            >

              <option>
                Low
              </option>

              <option>
                Medium
              </option>

              <option>
                High
              </option>

            </select>

          </div>

          {/* MEMBERS */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium dark:text-white mb-2">
              Team Members
            </label>

            <input
              type="text"
              value={
                Array.isArray(
                  editProject.members
                )
                  ? editProject.members.join(
                      ", "
                    )
                  : editProject.members
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  members:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={
              handleUpdateProject
            }
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditProjectModal;