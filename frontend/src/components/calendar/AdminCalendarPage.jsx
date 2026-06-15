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
  Users,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/calendarService";

import AddEventModal from "./AddEventModal";
import EventDetailsModal from "./EventDetailsModal";

function AdminCalendarPage() {
  const { profile } = useAuth();

  // EVENTS
  const [events, setEvents] = useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // SEARCH
  const [search, setSearch] =
    useState("");

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
    status: "Upcoming",
  });

  // LOAD EVENTS
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getEvents();

      setEvents(data || []);
    } catch (error) {
      console.error(
        "EVENT LOAD ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

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

  const completedEvents = events.filter(
    (event) =>
      event.status === "Completed"
  ).length;

  const upcomingEvents = events.filter(
    (event) =>
      event.status !== "Completed"
  ).length;

  // OPEN DETAILS
  const handleOpenDetails = (event) => {
    setSelectedEvent(event);

    setIsDetailsOpen(true);
  };

  // OPEN EDIT
  const handleEditEvent = (event) => {
    setEditingEventId(event.id);

    setNewEvent({
      title: event.title || "",
      description:
        event.description || "",
      date: event.date || "",
      time: event.time || "",
      type: event.type || "Meeting",
      priority:
        event.priority || "Medium",
      assignedTo:
        event.assignedTo || "",
      createdBy:
        event.createdBy ||
        profile?.full_name ||
        "Admin",
      status:
        event.status || "Upcoming",
    });

    setIsAddOpen(true);
  };

  // DELETE EVENT
  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);

      setEvents((prev) =>
        prev.filter(
          (event) => event.id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE EVENT ERROR:",
        error.message
      );
    }
  };

  // CREATE / UPDATE EVENT
  const handleAddEvent = async () => {
    try {
      if (
        !newEvent.title ||
        !newEvent.date
      )
        return;

      // UPDATE
      if (editingEventId) {
        const updatedEvent =
          await updateEvent(
            editingEventId,
            newEvent
          );

        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingEventId
              ? updatedEvent
              : event
          )
        );
      } else {
        // CREATE
        const createdEvent =
          await createEvent(newEvent);

        setEvents((prev) => [
          createdEvent,
          ...prev,
        ]);
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
          profile?.full_name ||
          "Admin",
        status: "Upcoming",
      });

      setEditingEventId(null);

      setIsAddOpen(false);
    } catch (error) {
      console.error(
        "SAVE EVENT ERROR:",
        error.message
      );
    }
  };

  // PRIORITY COLORS
  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";

      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";

      case "Low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";

      default:
        return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  // STATUS COLORS
  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";

      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-10 dark:text-white">
        <Loader2 className="animate-spin" />

        Loading calendar...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Calendar Management
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage meetings,
            deadlines, schedules,
            and team events.
          </p>

        </div>

        <button
          onClick={() =>
            setIsAddOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl transition shadow-lg shadow-emerald-500/20"
        >

          <Plus size={18} />

          Add Event

        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL EVENTS */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Events
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">

              <CalendarDays className="text-emerald-600 dark:text-emerald-400" />

            </div>

          </div>

        </div>

        {/* HIGH PRIORITY */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                High Priority
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {highPriorityEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center">

              <Clock3 className="text-red-600 dark:text-red-400" />

            </div>

          </div>

        </div>

        {/* COMPLETED */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {completedEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">

              <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />

            </div>

          </div>

        </div>

        {/* UPCOMING */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Upcoming
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {upcomingEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">

              <Users className="text-blue-600 dark:text-blue-400" />

            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-200 dark:border-zinc-800">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-11 pr-4 py-3 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />

        </div>

      </div>

      {/* EVENTS */}
      <div className="space-y-5">

        {filteredEvents.map((event) => (

          <div
            key={event.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-emerald-500/5 transition"
          >

            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

              {/* LEFT */}
              <div className="space-y-4 flex-1">

                <div className="flex items-center gap-3 flex-wrap">

                  <h2 className="text-2xl font-bold dark:text-white">
                    {event.title}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                      event.priority
                    )}`}
                  >
                    {event.priority}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>

                </div>

                <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                  <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Date
                    </p>

                    <h3 className="font-semibold mt-2 dark:text-white">
                      {event.date}
                    </h3>

                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Time
                    </p>

                    <h3 className="font-semibold mt-2 dark:text-white">
                      {event.time}
                    </h3>

                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Type
                    </p>

                    <h3 className="font-semibold mt-2 dark:text-white">
                      {event.type}
                    </h3>

                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Assigned To
                    </p>

                    <h3 className="font-semibold mt-2 dark:text-white">
                      {event.assignedTo}
                    </h3>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex xl:flex-col items-center gap-3">

                <button
                  onClick={() =>
                    handleOpenDetails(event)
                  }
                  className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:scale-105 transition"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() =>
                    handleEditEvent(event)
                  }
                  className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:scale-105 transition"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    handleDeleteEvent(
                      event.id
                    )
                  }
                  className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-105 transition"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY */}
      {filteredEvents.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-16 text-center">

          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">

            <CalendarDays
              size={36}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">
            No Events Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No events match your current
            search.
          </p>

        </div>

      )}

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