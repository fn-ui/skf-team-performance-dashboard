import { useEffect, useState } from "react";

import {
  Search,
  CalendarDays,
  Clock3,
  Eye,
} from "lucide-react";

import EventDetailsModal from "./EventDetailsModal";

function MemberCalendarPage() {
  const [events, setEvents] = useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Sprint Planning",
        description:
          "Plan next sprint tasks and priorities.",
        date: "2026-06-15",
        time: "10:00",
        type: "Meeting",
        priority: "High",
        assignedTo: "Development Team",
        createdBy: "Manager",
      },
      {
        id: 2,
        title: "Design Review",
        description:
          "UI review with stakeholders.",
        date: "2026-06-19",
        time: "14:00",
        type: "Review",
        priority: "Medium",
        assignedTo: "Design Team",
        createdBy: "Manager",
      },
    ]);
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleOpenDetails = (event) => {
    setSelectedEvent(event);

    setIsDetailsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Team Calendar
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-1">
          View upcoming meetings and deadlines.
        </p>

      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-200 dark:border-zinc-800">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-11 pr-4 py-3 dark:text-white outline-none"
          />

        </div>

      </div>

      {/* EVENTS */}
      <div className="space-y-4">

        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800"
          >

            <div className="flex items-center justify-between gap-5 flex-wrap">

              <div className="space-y-2">

                <h2 className="text-xl font-bold dark:text-white">
                  {event.title}
                </h2>

                <p className="text-slate-500 dark:text-zinc-400">
                  {event.description}
                </p>

                <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-zinc-400 flex-wrap">

                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {event.date}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {event.time}
                  </span>

                </div>

              </div>

              <button
                onClick={() =>
                  handleOpenDetails(event)
                }
                className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center"
              >
                <Eye size={18} />
              </button>

            </div>

          </div>
        ))}

      </div>

      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
        selectedEvent={selectedEvent}
      />

    </div>
  );
}

export default MemberCalendarPage;