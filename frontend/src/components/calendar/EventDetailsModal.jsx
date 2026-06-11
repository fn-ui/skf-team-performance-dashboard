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
  if (!isOpen || !selectedEvent)
    return null;

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

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Event Details
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              Full information about this
              calendar event.
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
        <div className="p-6 space-y-8">

          {/* TITLE */}
          <div>

            <div className="flex items-center justify-between gap-4 flex-wrap">

              <h1 className="text-3xl font-bold dark:text-white">
                {selectedEvent.title}
              </h1>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                  selectedEvent.priority
                )}`}
              >
                {
                  selectedEvent.priority
                }
              </span>

            </div>

            <p className="text-slate-500 dark:text-zinc-400 mt-4 leading-relaxed">
              {
                selectedEvent.description
              }
            </p>

          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* DATE */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

                  <CalendarDays className="text-emerald-600" />

                </div>

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Event Date
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {
                      selectedEvent.date
                    }
                  </h3>

                </div>

              </div>

            </div>

            {/* TIME */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Clock3 className="text-blue-600" />

                </div>

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Event Time
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {
                      selectedEvent.time
                    }
                  </h3>

                </div>

              </div>

            </div>

            {/* TYPE */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">

                  <Briefcase className="text-purple-600" />

                </div>

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Event Type
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {
                      selectedEvent.type
                    }
                  </h3>

                </div>

              </div>

            </div>

            {/* ASSIGNED */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">

                  <Users className="text-amber-600" />

                </div>

                <div>

                  <p className="text-slate-500 dark:text-zinc-400 text-sm">
                    Assigned To
                  </p>

                  <h3 className="font-bold dark:text-white mt-1">
                    {
                      selectedEvent.assignedTo
                    }
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="bg-slate-50 dark:bg-zinc-950 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <Info className="text-slate-500" />

              <h3 className="text-xl font-bold dark:text-white">
                Additional Information
              </h3>

            </div>

            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
              {
                selectedEvent.description
              }
            </p>

          </div>

          {/* FOOTER INFO */}
          <div className="flex items-center justify-between flex-wrap gap-4">

            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">

              <Flag size={16} />

              <span>
                Priority Level:
              </span>

              <span className="font-semibold dark:text-white">
                {
                  selectedEvent.priority
                }
              </span>

            </div>

            <div className="text-slate-500 dark:text-zinc-400">

              Created By:

              <span className="font-semibold dark:text-white ml-2">

                {
                  selectedEvent.createdBy
                }

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetailsModal;