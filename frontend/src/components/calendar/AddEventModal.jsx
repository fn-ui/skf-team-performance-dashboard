import { X } from "lucide-react";

function AddEventModal({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleAddEvent,
  mode = "add",
}) {
  if (!isOpen) return null;

  const isEditing = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              {isEditing ? "Edit Event" : "Add Event"}
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              {isEditing
                ? "Update this calendar event."
                : "Create a new calendar event."}
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
        <div className="p-6 space-y-5">

          {/* TITLE */}
          <div>

            <label className="block text-sm font-medium dark:text-white mb-2">
              Event Title
            </label>

            <input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
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
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  description:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* DATE */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Date
              </label>

              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    date: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

            {/* TIME */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Time
              </label>

              <input
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    time: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* TYPE */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Type
              </label>

              <select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    type: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option>
                  Meeting
                </option>

                <option>
                  Deadline
                </option>

                <option>
                  Review
                </option>

                <option>
                  Sprint
                </option>

              </select>

            </div>

            {/* PRIORITY */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Priority
              </label>

              <select
                value={newEvent.priority}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
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

            {/* ASSIGNED */}
            <div>

              <label className="block text-sm font-medium dark:text-white mb-2">
                Assigned To
              </label>

              <input
                type="text"
                value={
                  newEvent.assignedTo
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    assignedTo:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              />

            </div>

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
            onClick={handleAddEvent}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
          >
            {isEditing ? "Save Changes" : "Create Event"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddEventModal;
