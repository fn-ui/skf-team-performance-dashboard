import { useEffect, useState } from "react";

import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Clock3,
  Users,
  CheckCircle2,
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

function ManagerCalendarPage() {
  const { profile } = useAuth();

  // EVENTS
  const [events, setEvents] =
    useState([]);

  // MEMBERS
  const [members, setMembers] =
    useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // SEARCH
  const [search, setSearch] =
    useState("");

  // MODALS
  const [isAddOpen, setIsAddOpen] =
    useState(false);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  // SELECTED EVENT
  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  // EDIT MODE
  const [
    editingEventId,
    setEditingEventId,
  ] = useState(null);

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

  // LOAD EVENTS
  useEffect(() => {
    loadEvents();
  }, []);

  // FETCH EVENTS + USERS
  const loadEvents = async () => {
    try {
      setLoading(true);

      const [
        eventsData,
        usersData,
      ] = await Promise.all([
        getEvents(),
        getUsers(),
      ]);

      setEvents(eventsData || []);

      setMembers(usersData || []);
    } catch (error) {
      console.error(
        "LOAD EVENTS ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // GET USER NAME
  const getAssignedUserName = (
    userId
  ) => {
    const user = members.find(
      (member) =>
        member.id === userId
    );

    return (
      user?.full_name || "Team"
    );
  };

  // FILTER EVENTS
  const filteredEvents =
  events
    .filter(
      (event) =>
        event.created_by ===
          profile?.id ||
        event.assigned_to ===
          profile?.id
    )
    .filter((event) =>
      event.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
    // MANAGER CREATED EVENTS
   const isManagerEvent = (event) => {
  return event.created_by === profile?.id;
};

// ONLY EVENTS RELEVANT TO THIS MANAGER
const managerEvents =
  events.filter(
    (event) =>
      event.created_by ===
        profile?.id ||
      event.assigned_to ===
        profile?.id
  );

  // STATS
  const totalEvents =
  managerEvents.length;

const upcomingEvents =
  managerEvents.filter(
    (event) => {
      const today =
        new Date();

      const eventDate =
        new Date(event.date);

      return (
        eventDate >= today
      );
    }
  ).length;

const highPriorityEvents =
  managerEvents.filter(
    (event) =>
      event.priority === "High"
  ).length;

const completedEvents =
  managerEvents.filter(
    (event) =>
      event.status ===
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
      title: event.title || "",
      description:
        event.description || "",
      date: event.date || "",
      time: event.time || "",
      type:
        event.type || "Meeting",
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
      if (
        !newEvent.title ||
        !newEvent.date
      )
        return;

      try {
        // UPDATE
        if (editingEventId) {
          const updated =
            await updateEvent(
              editingEventId,
              {
                title:
                  newEvent.title,
                description:
                  newEvent.description,
                date: newEvent.date,
                time: newEvent.time,
                type: newEvent.type,
                priority:
                  newEvent.priority,
                assigned_to:
                  newEvent.assigned_to,
              }
            );

          setEvents((prev) =>
            prev.map((event) =>
              event.id ===
              editingEventId
                ? updated
                : event
            )
          );
        }

        // CREATE
        else {
          const created =
            await createEvent({
              title:
                newEvent.title,
              description:
                newEvent.description,
              date: newEvent.date,
              time: newEvent.time,
              type: newEvent.type,
              priority:
                newEvent.priority,
              assigned_to:
                newEvent.assigned_to,
              created_by:
                profile?.id,
            });

          setEvents((prev) => [
            created,
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
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Manager Calendar
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage meetings and schedules.
          </p>
        </div>

        <button
          onClick={() =>
            setIsAddOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl"
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

        <Clock3 className="text-blue-600 dark:text-blue-400" />

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

        <Users className="text-red-600 dark:text-red-400" />

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

</div>

      {/* EVENTS */}
      <div className="space-y-5">

        {filteredEvents.map(
          (event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800"
            >

              <div className="flex items-start justify-between gap-6">

                <div className="space-y-4 flex-1">

                  <div className="flex items-center gap-3">

                    <h2 className="text-2xl font-bold dark:text-white">
                      {
                        event.title
                      }
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

                  <p className="text-slate-500 dark:text-zinc-400">
                    {
                      event.description
                    }
                  </p>

                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

                    <div>
                      <p className="text-xs text-slate-500">
                        Date
                      </p>

                      <h3 className="font-semibold dark:text-white">
                        {event.date}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Time
                      </p>

                      <h3 className="font-semibold dark:text-white">
                        {event.time}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Type
                      </p>

                      <h3 className="font-semibold dark:text-white">
                        {event.type}
                      </h3>
                    </div>

                    <div>
                <p className="text-xs text-slate-500">
                  Assigned To
                </p>

                <h3 className="font-semibold dark:text-white">
                  {event.assigned_to === profile?.id
                    ? "You"
                    : getAssignedUserName(
                        event.assigned_to
                      )}
                </h3>
              </div>

                  </div>

                </div>

          {/* ACTIONS */}
<div className="flex flex-col gap-3">

  {/* VIEW */}
  <button
    onClick={() =>
      handleOpenDetails(event)
    }
    className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-105 transition"
  >
    <Eye size={18} />
  </button>

  {/* ONLY ALLOW EDIT/DELETE IF MANAGER CREATED EVENT */}
  {event.created_by ===
    profile?.id && (
    <>
      {/* EDIT */}
      <button
        onClick={() =>
          handleEditEvent(event)
        }
        className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:scale-105 transition"
      >
        <Pencil size={18} />
      </button>

      {/* DELETE */}
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
    </>
  )}

</div>

</div>

</div>
)
)}

</div>

      {/* ADD MODAL */}
      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);

          setEditingEventId(
            null
          );
        }}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={
          handleAddEvent
        }
        members={members}
        mode={
          editingEventId
            ? "edit"
            : "add"
        }
      />

      {/* DETAILS MODAL */}
      <EventDetailsModal
        isOpen={
          isDetailsOpen
        }
        onClose={() =>
          setIsDetailsOpen(
            false
          )
        }
        selectedEvent={
          selectedEvent
        }
      />

    </div>
  );
}

export default ManagerCalendarPage;