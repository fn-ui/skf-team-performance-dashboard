import { useEffect, useState } from "react";

import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import AddEventModal from "./AddEventModal";
import EventDetailsModal from "./EventDetailsModal";

function AdminCalendarPage() {
  const { profile } = useAuth();

  // EVENTS
  const [events, setEvents] = useState([]);

  // SEARCH
  const [search, setSearch] = useState("");

  // MODALS
  const [isAddOpen, setIsAddOpen] =
    useState(false);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  // SELECTED EVENT
  const [selectedEvent, setSelectedEvent] =
    useState(null);

  // EDIT MODE
  const [editingEventId, setEditingEventId] =
    useState(null);

  // NEW EVENT
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "Meeting",
    priority: "Medium",
    assignedTo: "",
    createdBy:
      profile?.full_name || "Admin",
  });

  // LOAD DEMO DATA
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
        createdBy: "Admin",
      },
      {
        id: 2,
        title: "Project Deadline",
        description:
          "Final project submission deadline.",
        date: "2026-06-18",
        time: "17:00",
        type: "Deadline",
        priority: "High",
        assignedTo: "All Members",
        createdBy: "Admin",
      },
    ]);
  }, []);

  // FILTERED EVENTS
  const filteredEvents = events.filter(
    (event) =>
      event.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // STATS
  const totalEvents = events.length;

  const highPriorityEvents = events.filter(
    (event) => event.priority === "High"
  ).length;

  // OPEN DETAILS
  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  // OPEN EDIT
  const handleEditEvent = (event) => {
    setEditingEventId(event.id);

    setNewEvent(event);

    setIsAddOpen(true);
  };

  // DELETE EVENT
  const handleDeleteEvent = (id) => {
    setEvents((prev) =>
      prev.filter((event) => event.id !== id)
    );
  };

  // CREATE / UPDATE EVENT
  const handleAddEvent = () => {
    if (!newEvent.title) return;

    // EDIT
    if (editingEventId) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEventId
            ? {
                ...newEvent,
                id: editingEventId,
              }
            : event
        )
      );
    } else {
      // CREATE
      const event = {
        ...newEvent,
        id: Date.now(),
      };

      setEvents((prev) => [event, ...prev]);
    }

    // RESET
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "Meeting",
      priority: "Medium",
      assignedTo: "",
      createdBy:
        profile?.full_name || "Admin",
    });

    setEditingEventId(null);

    setIsAddOpen(false);
  };

  // PRIORITY COLORS
  const getPriorityColor = (priority) => {
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
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Calendar Management
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Manage meetings, deadlines and events.
          </p>

        </div>

        <button
          onClick={() =>
            setIsAddOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl transition"
        >

          <Plus size={18} />

          Add Event

        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Events
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                {totalEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">

              <CalendarDays />

            </div>

          </div>

        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                High Priority
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                {highPriorityEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">

              <Clock3 />

            </div>

          </div>

        </div>

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

            <div className="flex items-start justify-between gap-5 flex-wrap">

              <div className="space-y-3">

                <div className="flex items-center gap-3 flex-wrap">

                  <h2 className="text-xl font-bold dark:text-white">
                    {event.title}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                      event.priority
                    )}`}
                  >
                    {event.priority}
                  </span>

                </div>

                <p className="text-slate-500 dark:text-zinc-400">
                  {event.description}
                </p>

                <div className="flex items-center gap-5 flex-wrap text-sm text-slate-500 dark:text-zinc-400">

                  <span>
                    📅 {event.date}
                  </span>

                  <span>
                    ⏰ {event.time}
                  </span>

                  <span>
                    👥 {event.assignedTo}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    handleOpenDetails(event)
                  }
                  className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() =>
                    handleEditEvent(event)
                  }
                  className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    handleDeleteEvent(event.id)
                  }
                  className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* MODALS */}
      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingEventId(null);
        }}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        mode={
          editingEventId
            ? "edit"
            : "add"
        }
      />

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

export default AdminCalendarPage;