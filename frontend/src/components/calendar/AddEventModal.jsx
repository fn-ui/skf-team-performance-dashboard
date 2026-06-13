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

      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              {isEditing
                ? "Edit Event"
                : "Create Event"}
            </h2>

            <p className="mt-1 text-slate-500 dark:text-zinc-400">
              {isEditing
                ? "Update calendar event information"
                : "Create a new calendar event"}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
          >

            <X
              size={20}
              className="dark:text-white"
            />

          </button>

        </div>

        {/* BODY */}
        <div className="space-y-5 p-6">

          {/* TITLE */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
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
              placeholder="Enter event title"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
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
              placeholder="Enter event description"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* DATE */}
            <div>

              <label className="mb-2 block text-sm font-medium dark:text-white">
                Event Date
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />

            </div>

            {/* TIME */}
            <div>

              <label className="mb-2 block text-sm font-medium dark:text-white">
                Event Time
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />

            </div>

          </div>

          {/* TYPE + PRIORITY */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* TYPE */}
            <div>

              <label className="mb-2 block text-sm font-medium dark:text-white">
                Event Type
              </label>

              <select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >

                <option value="Meeting">
                  Meeting
                </option>

                <option value="Deadline">
                  Deadline
                </option>

                <option value="Sprint">
                  Sprint
                </option>

                <option value="Review">
                  Review
                </option>

              </select>

            </div>

            {/* PRIORITY */}
            <div>

              <label className="mb-2 block text-sm font-medium dark:text-white">
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
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

          {/* ASSIGNED TO */}
          <div>

            <label className="mb-2 block text-sm font-medium dark:text-white">
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
              placeholder="Enter assignee name"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 p-6 dark:border-zinc-800">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={handleAddEvent}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            {isEditing
              ? "Save Changes"
              : "Create Event"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddEventModal;