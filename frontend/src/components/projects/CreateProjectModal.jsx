import React from "react";

function CreateProjectModal({
  isOpen,
  onClose,
  newProject,
  setNewProject,
  handleAddProject,
  managers,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold dark:text-white">
              Create Project
            </h2>

            <p className="mt-2 text-slate-500 dark:text-zinc-400">
              Add a new project.
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

          {/* NAME */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Project Name
            </label>

            <input
              type="text"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  name: e.target.value,
                })
              }
              placeholder="Enter project name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Description
            </label>

            <textarea
              rows="4"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              placeholder="Project description"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* MANAGER */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Assign Manager
            </label>

            <select
              value={newProject.manager_id || ""}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  manager_id: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >

              <option value="">
                Select manager
              </option>

              {managers.map((manager) => (
                <option
                  key={manager.id}
                  value={manager.id}
                >
                  {manager.full_name}
                </option>
              ))}

            </select>

          </div>

          {/* DEADLINE */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Deadline
            </label>

            <input
              type="date"
              value={newProject.deadline}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  deadline: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* PRIORITY */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
              Priority
            </label>

            <select
              value={newProject.priority}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  priority: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-10 flex items-center justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-3 dark:border-zinc-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleAddProject}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-white transition hover:bg-emerald-700"
          >
            Create Project
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateProjectModal;