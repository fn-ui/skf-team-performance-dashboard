import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  Users,
  Briefcase,
  Info,
} from "lucide-react";

function EventDetailsModal({
  isOpen,
  onClose,
  selectedEvent,
}) {
  if (!isOpen || !selectedEvent) {
    return null;
  }

  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-amber-100 text-amber-700";

      case "Low":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Event Details
            </h2>

            <p className="mt-1 text-slate-500 dark:text-zinc-400">
              Full information about this event
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
        <div className="space-y-8 p-6">

          {/* TITLE */}
          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold dark:text-white">
                {selectedEvent.title}
              </h1>

              <p className="mt-3 leading-relaxed text-slate-500 dark:text-zinc-400">
                {selectedEvent.description}
              </p>

            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getPriorityColor(
                selectedEvent.priority
              )}`}
            >
              {selectedEvent.priority}
            </span>

          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* DATE */}
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">

                  <CalendarDays className="text-emerald-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Event Date
                  </p>

                  <h3 className="mt-1 font-bold dark:text-white">
                    {selectedEvent.date}
                  </h3>

                </div>

              </div>

            </div>

            {/* TIME */}
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

                  <Clock3 className="text-blue-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Event Time
                  </p>

                  <h3 className="mt-1 font-bold dark:text-white">
                    {selectedEvent.time}
                  </h3>

                </div>

              </div>

            </div>

            {/* TYPE */}
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">

                  <Briefcase className="text-purple-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Event Type
                  </p>

                  <h3 className="mt-1 font-bold dark:text-white">
                    {selectedEvent.type}
                  </h3>

                </div>

              </div>

            </div>

            {/* ASSIGNED */}
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">

                  <Users className="text-amber-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Assigned To
                  </p>

                  <h3 className="mt-1 font-bold dark:text-white">
                    {selectedEvent.assignedTo || "Team"}
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* EXTRA INFO */}
          <div className="rounded-3xl bg-slate-50 p-6 dark:bg-zinc-950">

            <div className="mb-4 flex items-center gap-3">

              <Info className="text-slate-500" />

              <h3 className="text-xl font-bold dark:text-white">
                Additional Information
              </h3>

            </div>

            <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
              {selectedEvent.description}
            </p>

          </div>

          {/* FOOTER */}
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">

              <Flag size={16} />

              <span>Priority:</span>

              <span className="font-semibold dark:text-white">
                {selectedEvent.priority}
              </span>

            </div>

            <div className="text-slate-500 dark:text-zinc-400">

              Created By:

              <span className="ml-2 font-semibold dark:text-white">

                {selectedEvent.created_by || "Admin"}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetailsModal;