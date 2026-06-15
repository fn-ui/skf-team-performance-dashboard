import { useMemo } from "react";

import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  Users,
  FileText,
} from "lucide-react";

function AddEventModal({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleAddEvent,
  mode = "add",
}) {

  const isEditing =
    mode === "edit";

  // ========================================
  // VALIDATION
  // ========================================

  const isDisabled =
    !newEvent.title ||
    !newEvent.date ||
    !newEvent.time;

  // ========================================
  // PRIORITY COLORS
  // ========================================

  const priorityColor =
    useMemo(() => {

      switch (
        newEvent.priority
      ) {

        case "High":
          return "text-red-500";

        case "Medium":
          return "text-amber-500";

        case "Low":
          return "text-emerald-500";

        default:
          return "text-slate-500";
      }

    }, [newEvent.priority]);

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">

      <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-zinc-800">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">

                <CalendarDays size={22} />

              </div>

              <div>

                <h2 className="text-2xl font-bold dark:text-white">

                  {isEditing
                    ? "Edit Event"
                    : "Create Event"}

                </h2>

                <p className="mt-1 text-slate-500 dark:text-zinc-400">

                  {isEditing
                    ? "Update event details and schedule."
                    : "Schedule a new meeting, review or deadline."}

                </p>

              </div>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
          >

            <X
              size={20}
              className="dark:text-white"
            />

          </button>

        </div>

        {/* BODY */}
        <div className="space-y-6 p-6">

          {/* TITLE */}
          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

              <FileText size={16} />

              Event Title

            </label>

            <input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  title:
                    e.target.value,
                })
              }
              placeholder="Enter event title"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

              <FileText size={16} />

              Description

            </label>

            <textarea
              rows={4}
              value={
                newEvent.description
              }
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  description:
                    e.target.value,
                })
              }
              placeholder="Describe the event..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
            />

          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* DATE */}
            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

                <CalendarDays size={16} />

                Event Date

              </label>

              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    date:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
              />

            </div>

            {/* TIME */}
            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

                <Clock3 size={16} />

                Event Time

              </label>

              <input
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    time:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
              />

            </div>

          </div>

          {/* TYPE + PRIORITY */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* TYPE */}
            <div>

              <label className="mb-2 block text-sm font-semibold dark:text-white">
                Event Type
              </label>

              <select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    type:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
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

                <option value="Workshop">
                  Workshop
                </option>

              </select>

            </div>

            {/* PRIORITY */}
            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

                <Flag
                  size={16}
                  className={
                    priorityColor
                  }
                />

                Priority

              </label>

              <select
                value={
                  newEvent.priority
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    priority:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
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

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

              <Users size={16} />

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
              placeholder="Team / Member / Department"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-medium transition hover:bg-slate-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >

            Cancel

          </button>

          <button
            onClick={
              handleAddEvent
            }
            disabled={
              isDisabled
            }
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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