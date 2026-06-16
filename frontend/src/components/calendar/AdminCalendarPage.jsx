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

import { getUsers } from "../../services/userService";

import AddEventModal from "./AddEventModal";
import EventDetailsModal from "./EventDetailsModal";

function AdminCalendarPage() {
  const { profile } = useAuth();

  // EVENTS
  const [events, setEvents] = useState([]);

  // MEMBERS
  const [members, setMembers] = useState([]);

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
  const [newEvent, setNewEvent] =
    useState({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "Meeting",
      priority: "Medium",
      assigned_to: "",
      created_by:
        profile?.id || null,
    });

  // LOAD DATA
  useEffect(() => {
    loadEvents();
    loadMembers();
  }, []);

  // LOAD EVENTS
  const loadEvents = async () => {
    try {
      setLoading(true);

      const [eventsData, usersData] =
          await Promise.all([
            getEvents(),
            getUsers(),
          ]);

        setEvents(eventsData || []);
        setMembers(usersData || []);
    } catch (error) {
      console.error(
        "EVENT LOAD ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD MEMBERS
  const loadMembers = async () => {
    try {
      const data =
        await getUsers();

      setMembers(data || []);
    } catch (error) {
      console.error(
        "MEMBERS LOAD ERROR:",
        error.message
      );
    }
  };

  // HELPER
  const getAssignedUserName =
    (userId) => {
      const user =
        members.find(
          (member) =>
            member.id === userId
        );

      return (
        user?.full_name ||
        "Team"
      );
    };

  // FILTER EVENTS
  const filteredEvents =
    profile?.role === "member"
      ? events.filter(
          (event) =>
            event.assigned_to ===
            profile?.id
        )
      : events;

  // SEARCH FILTER
  const searchedEvents =
    filteredEvents.filter(
      (event) =>
        event.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        event.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // STATS
  const totalEvents =
    filteredEvents.length;

  const highPriorityEvents =
    filteredEvents.filter(
      (event) =>
        event.priority === "High"
    ).length;

  const completedEvents =
    filteredEvents.filter(
      (event) =>
        event.status ===
        "Completed"
    ).length;

  const upcomingEvents =
    filteredEvents.filter(
      (event) =>
        event.status !==
        "Completed"
    ).length;

  // OPEN DETAILS
  const handleOpenDetails = (
    event
  ) => {
    setSelectedEvent(event);

    setIsDetailsOpen(true);
  };

  // OPEN EDIT
  const handleEditEvent = (
    event
  ) => {
    setEditingEventId(event.id);

    setNewEvent({
      title:
        event.title || "",

      description:
        event.description || "",

      date:
        event.date || "",

      time:
        event.time || "",

      type:
        event.type ||
        "Meeting",

      priority:
        event.priority ||
        "Medium",

      assigned_to:
        event.assigned_to || "",

      created_by:
        profile?.id || null,
    });

    setIsAddOpen(true);
  };

  // DELETE EVENT
  const handleDeleteEvent =
    async (id) => {
      try {
        await deleteEvent(id);

        setEvents((prev) =>
          prev.filter(
            (event) =>
              event.id !== id
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
  const handleAddEvent =
    async () => {
      try {
        if (
          !newEvent.title ||
          !newEvent.date
        )
          return;

        if (editingEventId) {
          // UPDATE
          const updatedEvent =
            await updateEvent(
              editingEventId,
              newEvent
            );

          setEvents((prev) =>
            prev.map((event) =>
              event.id ===
              editingEventId
                ? updatedEvent
                : event
            )
          );
        } else {
          // CREATE
          const createdEvent =
            await createEvent(
              newEvent
            );

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
          assigned_to: "",
          created_by:
            profile?.id || null,
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
  const getPriorityColor =
    (priority) => {
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
            schedules and events.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={
            <CalendarDays />
          }
        />

        <StatCard
          title="High Priority"
          value={
            highPriorityEvents
          }
          icon={<Clock3 />}
        />

        <StatCard
          title="Completed"
          value={
            completedEvents
          }
          icon={
            <CheckCircle2 />
          }
        />

        <StatCard
          title="Upcoming"
          value={
            upcomingEvents
          }
          icon={<Users />}
        />

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
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-11 pr-4 py-3 dark:text-white outline-none"
          />

        </div>

      </div>

      {/* EVENTS */}
      <div className="space-y-5">

        {searchedEvents.map(
          (event) => (

            <div
              key={event.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800"
            >

              <div className="flex justify-between gap-6">

                <div className="flex-1">

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="text-2xl font-bold dark:text-white">
                      {event.title}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        event.priority
                      )}`}
                    >
                      {
                        event.priority
                      }
                    </span>

                  </div>

                  <p className="mt-4 text-slate-500 dark:text-zinc-400">
                    {
                      event.description
                    }
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

                    <InfoCard
                      label="Date"
                      value={
                        event.date
                      }
                    />

                    <InfoCard
                      label="Time"
                      value={
                        event.time
                      }
                    />

                    <InfoCard
                      label="Type"
                      value={
                        event.type
                      }
                    />

                    <InfoCard
                      label="Assigned To"
                      value={getAssignedUserName(
                        event.assigned_to
                      )}
                    />

                  </div>

                </div>

                <div className="flex flex-col gap-3">

                  <ActionButton
                    onClick={() =>
                      handleOpenDetails(
                        event
                      )
                    }
                    icon={<Eye size={18} />}
                  />

                  <ActionButton
                    onClick={() =>
                      handleEditEvent(
                        event
                      )
                    }
                    icon={
                      <Pencil size={18} />
                    }
                  />

                  <ActionButton
                    onClick={() =>
                      handleDeleteEvent(
                        event.id
                      )
                    }
                    icon={
                      <Trash2 size={18} />
                    }
                  />

                </div>

              </div>

            </div>
          )
        )}

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
                  members={members}
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
                selectedEvent={
                  selectedEvent
                }
              />

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 dark:text-zinc-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3 dark:text-white">
            {value}
          </h2>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">

          {icon}

        </div>

      </div>

    </div>
  );
}

function InfoCard({
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

      <p className="text-xs text-slate-500 dark:text-zinc-400">
        {label}
      </p>

      <h3 className="font-semibold mt-2 dark:text-white">
        {value || "-"}
      </h3>

    </div>
  );
}

function ActionButton({
  icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 dark:text-white flex items-center justify-center hover:scale-105 transition"
    >
      {icon}
    </button>
  );
}

export default AdminCalendarPage;