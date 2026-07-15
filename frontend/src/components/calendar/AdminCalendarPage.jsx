import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Clock3,
  CheckCircle2,
  Loader2,
  CalendarClock,
  AlertTriangle,
  Users,
  Building2,
  ShieldCheck,
  Layers3,
} from "lucide-react";
import CalendarFocusPanel from "./CalendarFocusPanel";

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


  const [events, setEvents] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [
    assignmentFilter,
    setAssignmentFilter,
  ] = useState("All");

  const [isAddOpen, setIsAddOpen] =
    useState(false);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  const [
    editingEventId,
    setEditingEventId,
  ] = useState(null);

  const [newEvent, setNewEvent] =
    useState({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "Meeting",
      priority: "Medium",
      status: "Upcoming",

      visibility: "individual",

      assignment_type:
        "individual",

      assigned_to: "",

      team_target: "",

      role_target: "",

      meeting_link: "",

      created_by:
        profile?.id || null,
    });


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        eventsData,
        usersData,
      ] = await Promise.all([
        getEvents(),
        getUsers(),
      ]);


      const sortedEvents =
        (eventsData || []).sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );

      setEvents(sortedEvents);

      setMembers(usersData || []);
    } catch (error) {
      console.error(
        "CALENDAR LOAD ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };


  const getAssignedUserName =
    (userId) => {
      if (!userId)
        return "Not Assigned";

      const user =
        members.find(
          (member) =>
            String(member.id) ===
            String(userId)
        );

      return (
        user?.full_name ||
        "Unknown User"
      );
    };

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

  const getStatusColor =
    (status) => {
      switch (status) {
        case "Completed":
          return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";

        case "Ongoing":
          return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";

        case "Cancelled":
          return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";

        default:
          return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
      }
    };

  const isOverdue = (
    event
  ) => {
    if (
      event.status ===
      "Completed"
    )
      return false;

    return (
      new Date(event.date) <
      new Date()
    );
  };

  const getAssignmentLabel =
    (event) => {
      switch (
        event.assignment_type
      ) {
        case "team":
          return `Team: ${event.team_target}`;

        case "role":
          return `Role: ${event.role_target}`;

        case "manager":
          return "Managers";

        case "all_members":
          return "All Members";

        case "all":
          return "Everyone";

        default:
          return getAssignedUserName(
            event.assigned_to
          );
      }
    };


  const filteredEvents =
    events
      .filter((event) => {
        const term =
          search.toLowerCase();

        return (
          event.title
            ?.toLowerCase()
            .includes(term) ||
          event.description
            ?.toLowerCase()
            .includes(term) ||
          event.type
            ?.toLowerCase()
            .includes(term)
        );
      })

      .filter((event) =>
        statusFilter === "All"
          ? true
          : event.status ===
            statusFilter
      )

      .filter((event) =>
        priorityFilter ===
        "All"
          ? true
          : event.priority ===
            priorityFilter
      )

      .filter((event) =>
        typeFilter === "All"
          ? true
          : event.type ===
            typeFilter
      )

      .filter((event) =>
        assignmentFilter ===
        "All"
          ? true
          : event.assignment_type ===
            assignmentFilter
      );


  const totalEvents =
    events.length;

  const completedEvents =
    events.filter(
      (event) =>
        event.status ===
        "Completed"
    ).length;

  const upcomingEvents =
    events.filter(
      (event) =>
        event.status ===
        "Upcoming"
    ).length;

  const highPriorityEvents =
    events.filter(
      (event) =>
        event.priority ===
        "High"
    ).length;

  const overdueEvents =
    events.filter((event) =>
      isOverdue(event)
    ).length;

  const organizationEvents =
    events.filter(
      (event) =>
        event.assignment_type ===
          "all" ||
        event.visibility ===
          "organization"
    ).length;


  const nextEvent = useMemo(() => {
    const upcoming =
      events
        .filter(
          (event) =>
            new Date(
              event.date
            ) >= new Date()
        )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

    return upcoming[0];
  }, [events]);


  const handleOpenDetails = (
    event
  ) => {
    setSelectedEvent(event);

    setIsDetailsOpen(true);
  };


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

      status:
        event.status ||
        "Upcoming",

      visibility:
        event.visibility ||
        "individual",

      assignment_type:
        event.assignment_type ||
        "individual",

      assigned_to:
        event.assigned_to ||
        "",

      team_target:
        event.team_target ||
        "",

      role_target:
        event.role_target ||
        "",

      meeting_link:
        event.meeting_link ||
        "",

      created_by:
        profile?.id || null,
    });

    setIsAddOpen(true);
  };


  const handleDeleteEvent =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this event?"
        );

      if (!confirmed) return;

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

  const handleAddEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.date || !newEvent.time) {
        alert("Please complete all required fields (Title, Date, Time).");
        return;
      }

      setSaving(true);

      let payload = {
        ...newEvent,
        assigned_to: newEvent.assigned_to || null,
        team_target: newEvent.team_target || null,
        role_target: newEvent.role_target || null,
        meeting_link: newEvent.meeting_link || null,
        created_by: profile?.id || null,
      };

     if (
          newEvent.assignment_type === "team" &&
          newEvent.team_target?.trim()
        ) {
          payload.visibility = "team";

          
        }

      if (editingEventId) {
        const updatedEvent = await updateEvent(editingEventId, payload);
        setEvents((prev) =>
          prev.map((event) => (event.id === editingEventId ? updatedEvent : event))
        );
      } else {
        const createdEvent = await createEvent(payload);
        setEvents((prev) => [createdEvent, ...prev]);
      }

      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        type: "Meeting",
        priority: "Medium",
        status: "Upcoming",
        visibility: "individual",
        assignment_type: "individual",
        assigned_to: "",
        team_target: "",
        role_target: "",
        meeting_link: "",
        created_by: profile?.id || null,
      });

      setEditingEventId(null);
      setIsAddOpen(false);
    } catch (error) {
      console.error("SAVE EVENT ERROR:", error.message);
      alert("Failed to save event. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center gap-3 p-5 dark:text-white">

        <Loader2 className="animate-spin" />

        Loading calendar...

      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Admin Calendar
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage organization-wide meetings,
            deadlines, team schedules and events.
          </p>

        </div>

        <button
          onClick={() => {
            setEditingEventId(
              null
            );

            setNewEvent({
              title: "",
              description:
                "",
              date: "",
              time: "",
              type: "Meeting",
              priority:
                "Medium",
              status:
                "Upcoming",

              visibility:
                "individual",

              assignment_type:
                "individual",

              assigned_to:
                "",

              team_target:
                "",

              role_target:
                "",

              meeting_link:
                "",

              created_by:
                profile?.id ||
                null,
            });

            setIsAddOpen(
              true
            );
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl transition"
        >

          <Plus size={18} />

          Add Event

        </button>

      </div>

      <CalendarFocusPanel events={events} roleMode="admin" />

      {nextEvent && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 text-white shadow-xl">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <CalendarClock />

                <h2 className="text-xl font-semibold">
                  Upcoming Event
                </h2>

              </div>

              <h1 className="text-4xl font-bold">
                {
                  nextEvent.title
                }
              </h1>

              <p className="mt-3 text-emerald-50 max-w-2xl">
                {
                  nextEvent.description
                }
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[260px]">

              <MiniStat
                label="Date"
                value={
                  nextEvent.date
                }
              />

              <MiniStat
                label="Time"
                value={
                  nextEvent.time ||
                  "-"
                }
              />

              <MiniStat
                label="Type"
                value={
                  nextEvent.type
                }
              />

              <MiniStat
                label="Assigned"
                value={getAssignmentLabel(
                  nextEvent
                )}
              />

            </div>

          </div>

        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6">

        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={
            <CalendarDays />
          }
        />

        <StatCard
          title="Upcoming"
          value={upcomingEvents}
          icon={
            <CalendarClock />
          }
        />

        <StatCard
          title="Completed"
          value={completedEvents}
          icon={
            <CheckCircle2 />
          }
        />

        <StatCard
          title="High Priority"
          value={
            highPriorityEvents
          }
          icon={
            <AlertTriangle />
          }
        />

        <StatCard
          title="Overdue"
          value={overdueEvents}
          icon={<Clock3 />}
        />

        <StatCard
          title="Organization"
          value={
            organizationEvents
          }
          icon={<Users />}
        />

      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5">

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

          <div className="xl:col-span-2 relative">

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

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 dark:text-white outline-none"
          >

            <option>
              All
            </option>

            <option>
              Upcoming
            </option>

            <option>
              Ongoing
            </option>

            <option>
              Completed
            </option>

            <option>
              Cancelled
            </option>

          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 dark:text-white outline-none"
          >

            <option>
              All
            </option>

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

          <select
            value={
              assignmentFilter
            }
            onChange={(e) =>
              setAssignmentFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 dark:text-white outline-none"
          >

            <option value="All">
              All Assignments
            </option>

            <option value="individual">
              Individual
            </option>

            <option value="team">
              Team
            </option>

            <option value="role">
              Role
            </option>

            <option value="manager">
              Managers
            </option>

            <option value="all_members">
              All Members
            </option>

            <option value="all">
              Everyone
            </option>

          </select>

        </div>

      </div>

      <div className="space-y-5">

        {filteredEvents.map(
          (event) => (

            <div
              key={event.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
            >

              <div className="flex flex-col xl:flex-row xl:justify-between gap-6">

                <div className="flex-1">

                  <div className="flex items-center gap-3 flex-wrap">

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

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {
                        event.status
                      }
                    </span>

                  </div>

                  <p className="mt-4 text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {
                      event.description
                    }
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-6">

                    <InfoCard
                      label="Date"
                      value={
                        event.date
                      }
                    />

                    <InfoCard
                      label="Time"
                      value={
                        event.time ||
                        "-"
                      }
                    />

                    <InfoCard
                      label="Type"
                      value={
                        event.type
                      }
                    />

                    <InfoCard
                      label="Visibility"
                      value={
                        event.visibility
                      }
                    />

                    <InfoCard
                      label="Assigned To"
                      value={getAssignmentLabel(
                        event
                      )}
                    />

                  </div>

                </div>

                <div className="flex xl:flex-col gap-3">

                  <ActionButton
                    onClick={() =>
                      handleOpenDetails(
                        event
                      )
                    }
                    icon={
                      <Eye
                        size={18}
                      />
                    }
                  />

                  <ActionButton
                    onClick={() =>
                      handleEditEvent(
                        event
                      )
                    }
                    icon={
                      <Pencil
                        size={18}
                      />
                    }
                  />

                  <ActionButton
                    onClick={() =>
                      handleDeleteEvent(
                        event.id
                      )
                    }
                    icon={
                      <Trash2
                        size={18}
                      />
                    }
                    danger
                  />

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {filteredEvents.length ===
        0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 text-center">

          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-6">

            <CalendarDays className="text-emerald-600 dark:text-emerald-400" />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">
            No Events Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No events match your current filters.
          </p>

        </div>
      )}

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
        currentUser={profile}
        mode={
          editingEventId
            ? "edit"
            : "add"
        }
        saving={saving}
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


function MiniStat({
  label,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">

      <p className="text-sm text-emerald-50">
        {label}
      </p>

      <h3 className="text-lg font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}


function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800">

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

      <h3 className="font-semibold mt-2 dark:text-white break-words">
        {value || "-"}
      </h3>

    </div>
  );
}


function ActionButton({
  icon,
  onClick,
  danger,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition hover:scale-105 ${
        danger
          ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          : "bg-slate-100 dark:bg-zinc-800 dark:text-white"
      }`}
    >
      {icon}
    </button>
  );
}

export default AdminCalendarPage;
