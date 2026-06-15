function EditProjectModal({
  isOpen,
  onClose,
  editProject,
  setEditProject,
  handleUpdateProject,
  isManager = false,
}) {
  if (!isOpen || !editProject)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              {isManager
                ? "Update Project"
                : "Edit Project"}
            </h2>

            <p className="mt-2 text-slate-500 dark:text-zinc-400">
              {isManager
                ? "Update project progress and status."
                : "Update project information."}
            </p>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 dark:text-white"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* PROJECT NAME */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Project Name
            </label>

            <input
              type="text"
              disabled={isManager}
              value={editProject.name || ""}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  name: e.target.value,
                })
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none dark:border-zinc-800 dark:text-white ${
                isManager
                  ? "border-slate-200 bg-slate-100 dark:bg-zinc-950"
                  : "border-slate-200 bg-white dark:bg-zinc-900"
              }`}
            />

          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Description
            </label>

            <textarea
              rows={4}
              disabled={isManager}
              value={
                editProject.description || ""
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  description:
                    e.target.value,
                })
              }
              className={`w-full resize-none rounded-xl border px-4 py-3 outline-none dark:border-zinc-800 dark:text-white ${
                isManager
                  ? "border-slate-200 bg-slate-100 dark:bg-zinc-950"
                  : "border-slate-200 bg-white dark:bg-zinc-900"
              }`}
            />

          </div>

          {/* MANAGER */}
          {/* MANAGER */}
            {!isManager && (
              <div>

                <label className="mb-2 block text-sm font-medium dark:text-white">
                  Project Manager
                  </label>

                  <input
                    type="text"
                    disabled
                    value={
                      editProject.manager
                        ?.full_name ||
                      editProject.manager_name ||
                      ""
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />

                </div>
              )}
          {/* DEADLINE */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Deadline
            </label>

            <input
              type="date"
              disabled={isManager}
              value={
                editProject.deadline || ""
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  deadline:
                    e.target.value,
                })
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none dark:border-zinc-800 dark:text-white ${
                isManager
                  ? "border-slate-200 bg-slate-100 dark:bg-zinc-950"
                  : "border-slate-200 bg-white dark:bg-zinc-900"
              }`}
            />

          </div>

          {/* STATUS */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Status
            </label>

            <select
              value={
                editProject.status ||
                "Planning"
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  status:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
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

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Priority
            </label>

            <select
              disabled={isManager}
              value={
                editProject.priority ||
                "Medium"
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  priority:
                    e.target.value,
                })
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none dark:border-zinc-800 dark:text-white ${
                isManager
                  ? "border-slate-200 bg-slate-100 dark:bg-zinc-950"
                  : "border-slate-200 bg-white dark:bg-zinc-900"
              }`}
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

          {/* PROGRESS */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Progress (%)
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={
                editProject.progress || 0
              }
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  progress: Number(
                    e.target.value
                  ),
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />

          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex items-center justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-3 dark:border-zinc-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={
              handleUpdateProject
            }
            className="rounded-xl bg-emerald-600 px-6 py-3 text-white transition hover:bg-emerald-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditProjectModal;