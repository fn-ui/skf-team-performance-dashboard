function CreateTaskModal({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  handleCreateTask,
  projects,
  members,
  selectedUsers,
  setSelectedUsers,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-3xl font-bold dark:text-white">
              Create Task
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Create and assign a new task.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
          >
            Close
          </button>

        </div>

        {/* FORM */}
        <div className="space-y-6 mt-8">

          {/* TITLE */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Task Title
            </label>

            <input
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

          {/* PROJECT + ASSIGNEE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PROJECT */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-2">
                Project
              </label>

              <select
                    value={newTask.project_id || ""}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        project_id: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
                  >

              <option value="">
                Select Project
              </option>

              {projects?.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}

            </select>

            </div>

            {/* ASSIGNEE */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-2">
                Assign Member
              </label>

              <select
                  value={selectedUsers[0] || ""}
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.value
                        ? [e.target.value]
                        : []
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
                >

            <option value="">
              Assign Member
            </option>

            {members?.map((member) => (
              <option
                key={member.id}
                value={member.id}
              >
                {member.full_name}
              </option>
            ))}

          </select>

            </div>

          </div>

          {/* STATUS + PRIORITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

           

            {/* PRIORITY */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-2">
                Priority
              </label>

              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

            </div>

          </div>

          {/* DUE DATE */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Due Date
            </label>

            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  due_date: e.target.value,
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
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateTask}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition"
          >
            Create Task
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateTaskModal;