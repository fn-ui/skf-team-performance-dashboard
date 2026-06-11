import {
  X,
  FolderKanban,
  CalendarDays,
  Flag,
  Users,
} from "lucide-react";

function CreateProjectModal({
  isOpen,
  onClose,
  newProject,
  setNewProject,
  handleCreateProject,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 overflow-y-auto max-h-[95vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              Create Project
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Create a new project and
              assign a manager.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center transition"
          >

            <X
              size={22}
              className="dark:text-white"
            />

          </button>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PROJECT NAME */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium dark:text-white mb-2">
              Project Name
            </label>

            <div className="relative">

              <FolderKanban
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    name: e.target.value,
                  })
                }
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium dark:text-white mb-2">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Enter project description"
              value={
                newProject.description
              }
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

          {/* MANAGER */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Project Manager
            </label>

            <div className="relative">

              <Users
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={newProject.manager}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    manager:
                      e.target.value,
                  })
                }
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none appearance-none"
              >

                <option value="">
                  Select Manager
                </option>

                <option>
                  Faith Njeri
                </option>

                <option>
                  Grace Wambui
                </option>

                <option>
                  Michael Otieno
                </option>

              </select>

            </div>

          </div>

          {/* DEADLINE */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Deadline
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

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
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

          </div>

          {/* STATUS */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Status
            </label>

            <select
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
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

            <div className="relative">

              <Flag
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={newProject.priority}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    priority:
                      e.target.value,
                  })
                }
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none appearance-none"
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

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >

            Cancel

          </button>

          <button
            onClick={
              handleCreateProject
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition font-medium"
          >

            Create Project

          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateProjectModal;