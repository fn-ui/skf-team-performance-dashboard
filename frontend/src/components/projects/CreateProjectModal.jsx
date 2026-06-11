import React from "react";

function CreateProjectModal({
  isOpen,
  onClose,
  newProject,
  setNewProject,
  handleAddProject,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl p-8 border border-slate-200 dark:border-zinc-800">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              Create Project
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Add a new project.
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

          {/* NAME */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium mb-2 dark:text-white">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium mb-2 dark:text-white">
              Description
            </label>

            <textarea
              rows="4"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description:
                    e.target.value,
                })
              }
              placeholder="Project description"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* MANAGER */}
          <div>

            <label className="block text-sm font-medium mb-2 dark:text-white">
              Manager
            </label>

            <input
              type="text"
              value={newProject.manager}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  manager: e.target.value,
                })
              }
              placeholder="Manager name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* DEADLINE */}
          <div>

            <label className="block text-sm font-medium mb-2 dark:text-white">
              Deadline
            </label>

            <input
              type="date"
              value={newProject.deadline}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  deadline:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* STATUS */}
          <div>

            <label className="block text-sm font-medium mb-2 dark:text-white">
              Status
            </label>

            <select
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
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

            <label className="block text-sm font-medium mb-2 dark:text-white">
              Priority
            </label>

            <select
              value={newProject.priority}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  priority:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
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

            <label className="block text-sm font-medium mb-2 dark:text-white">
              Members
            </label>

            <input
              type="text"
              value={newProject.members}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  members:
                    e.target.value,
                })
              }
              placeholder="John, Mary, Alex"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleAddProject}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition"
          >
            Create Project
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateProjectModal;