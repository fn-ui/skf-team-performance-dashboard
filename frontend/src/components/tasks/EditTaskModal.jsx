function EditTaskModal({
  isOpen,
  onClose,
  editedTask,
  setEditedTask,
  handleUpdateTask,
  users,
  projects,
  selectedUsers,
  toggleUserSelection,
  role,
}) {
  if (!isOpen || !editedTask) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-3xl font-bold dark:text-white">
              Edit Task
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Update task information and progress.
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
         {role !== "member" && (
          <>
          {/* TASK TITLE */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Task Title
            </label>

            <input
              type="text"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          
          {/* ASSIGN MEMBERS */}
<div>

  <label className="block text-sm font-semibold dark:text-white mb-3">
    Assigned Members
  </label>

  <div className="space-y-3 max-h-52 overflow-y-auto border border-slate-200 dark:border-zinc-800 rounded-2xl p-4">

    {users.map((user) => {

      const isSelected =
        selectedUsers.includes(user.id);

      return (
        <button
          key={user.id}
          type="button"
          onClick={() =>
            toggleUserSelection(
              user.id
            )
          }
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
            isSelected
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 dark:bg-zinc-800 dark:text-white"
          }`}
        >

          <div className="text-left">

            <p className="font-semibold">
              {user.full_name}
            </p>

            <p className="text-xs opacity-70">
              {user.email}
            </p>

          </div>

          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
          )}

        </button>
      );
    })}

  </div>

</div>
          {/* PROJECT */}
<div>

  <label className="block text-sm font-semibold dark:text-white mb-2">
    Project
  </label>

  <select
    value={editedTask.project_id || ""}
    onChange={(e) =>
      setEditedTask({
        ...editedTask,
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
          {/* STATUS + PRIORITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PRIORITY */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-2">
                Priority
              </label>

              <select
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
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
              value={editedTask.due_date}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  due_date: e.target.value,
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
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

        
        </>
            )}
            {/* MEMBER EDIT SECTION */}
     {role === "member" && (
      
  <div className="space-y-6">

    {/* STATUS */}
    <div>

      <label className="block text-sm font-semibold dark:text-white mb-2">
        Status
      </label>

      <select
        value={editedTask.status}
        onChange={(e) =>
          setEditedTask({
            ...editedTask,
            status: e.target.value,
          })
        }
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

    </div>

    {/* PROGRESS */}
    <div>

      <label className="block text-sm font-semibold dark:text-white mb-2">
        Progress (%)
      </label>

      <input
        type="number"
        min="0"
        max="100"
        value={editedTask.progress}
        onChange={(e) =>
          setEditedTask({
            ...editedTask,
            progress: Number(e.target.value),
          })
        }
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
      />

    </div>

  </div>
)}

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateTask}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
    </div>
  );
}

export default EditTaskModal;