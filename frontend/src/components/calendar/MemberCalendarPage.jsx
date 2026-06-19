import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  CalendarDays,
  Clock3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Users,
  Loader2,
  CalendarClock,
  Link2,
  Flag,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import { getEvents } from "../../services/calendarService";

import { getUsers } from "../../services/userService";

import EventDetailsModal from "./EventDetailsModal";

function MemberCalendarPage() {
  const { profile } =
    useAuth();

  /* ========================================
     STATES
  ======================================== */

  const [events, setEvents] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  /* ========================================
     LOAD EVENTS
  ======================================== */

  useEffect(() => {
    if (profile?.id) {
      loadEvents();
    }
  }, [profile?.id]);

  const loadEvents =
    async () => {
      try {
        setLoading(true);

        const [
          eventsData,
          usersData,
        ] = await Promise.all([
          getEvents(),
          getUsers(),
        ]);

        const allEvents =
          eventsData || [];

        const allUsers =
          usersData || [];

        setMembers(allUsers);

              /* ========================================
                MEMBER VISIBLE EVENTS 
              ======================================== */

              const visibleEvents = allEvents.filter((event) => {
                const eventCreatedBy = String(event.created_by || "");
                const eventAssignedTo = String(event.assigned_to || "");
                const currentUserId = String(profile?.id || "");
                const myManagerId = String(profile?.manager_id || "");
                const userDepartment = String(profile?.department || "").trim().toLowerCase();
                const eventTeamTarget = String(event.team_target || "").trim().toLowerCase();

                /* CREATED BY ME */
                const createdByMe = eventCreatedBy === currentUserId;

                /* DIRECTLY ASSIGNED TO ME */
                const assignedToMe = eventAssignedTo === currentUserId;

                /* ASSIGNED TO MY MANAGER */
                const assignedToMyManager = eventAssignedTo === myManagerId;

                /* TEAM EVENT (from manager OR admin) */
                const isTeamEvent = 
                  (event.visibility === "team" || event.visibility === "individual") &&
                  (
                    eventCreatedBy === myManagerId ||                    
                    eventTeamTarget === userDepartment ||                
                    eventTeamTarget.includes("team") ||                  
                    !event.team_target                                  
                  );

                /* ORGANIZATION-WIDE EVENT */
                const organizationEvent = event.visibility === "organization";

                /* ROLE-BASED EVENT */
                const roleEvent = 
                  event.assignment_type === "role" && 
                  event.role_target === profile?.role;

                return (
                  createdByMe ||
                  assignedToMe ||
                  assignedToMyManager ||
                  isTeamEvent ||
                  organizationEvent ||
                  roleEvent
                );
              });

        /* SORT EVENTS  */

        const sortedEvents = [...visibleEvents].sort((a, b) => {
          const first = new Date(`${a.date} ${a.time || "00:00"}`);
          const second = new Date(`${b.date} ${b.time || "00:00"}`);
          return first - second;
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error(
          "LOAD EVENTS ERROR:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  /* ========================================
     HELPERS
  ======================================== */

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue)
      return "-";

    return new Date(
      dateValue
    ).toLocaleDateString(
      "en-KE",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getAssignedUserName =
    (userId) => {
      if (!userId) {
        return "Entire Team";
      }

      if (
        String(userId) ===
        String(profile?.id)
      ) {
        return "You";
      }

      const user =
        members.find(
          (member) =>
            String(
              member.id
            ) ===
            String(userId)
        );

      return (
        user?.full_name ||
        "Team"
      );
    };

  const isOverdue = (
    event
  ) => {
    if (
      event.status ===
      "Completed"
    ) {
      return false;
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const eventDate =
      new Date(event.date);

    return (
      eventDate < today
    );
  };

  /* ========================================
     FILTER EVENTS
  ======================================== */

  const filteredEvents =
    useMemo(() => {
      return events
        .filter((event) => {
          const searchTerm =
            search.toLowerCase();

          const matchesSearch =
            event.title
              ?.toLowerCase()
              .includes(
                searchTerm
              ) ||
            event.description
              ?.toLowerCase()
              .includes(
                searchTerm
              ) ||
            event.type
              ?.toLowerCase()
              .includes(
                searchTerm
              );

          const matchesPriority =
            priorityFilter ===
            "All"
              ? true
              : event.priority ===
                priorityFilter;

          const matchesStatus =
            statusFilter ===
            "All"
              ? true
              : event.status ===
                statusFilter;

          return (
            matchesSearch &&
            matchesPriority &&
            matchesStatus
          );
        })
        .sort((a, b) => {
          const first =
            new Date(
              `${a.date} ${
                a.time ||
                "00:00"
              }`
            );

          const second =
            new Date(
              `${b.date} ${
                b.time ||
                "00:00"
              }`
            );

          return (
            first - second
          );
        });
    }, [
      events,
      search,
      priorityFilter,
      statusFilter,
    ]);

  /* ========================================
     STATS
  ======================================== */

  const totalEvents =
    filteredEvents.length;

  const upcomingEvents =
    filteredEvents.filter(
      (event) =>
        event.status ===
          "Upcoming" ||
        event.status ===
          "Ongoing"
    ).length;

  const completedEvents =
    filteredEvents.filter(
      (event) =>
        event.status ===
        "Completed"
    ).length;

  const highPriorityEvents =
    filteredEvents.filter(
      (event) =>
        event.priority ===
        "High"
    ).length;

  const overdueEvents =
    filteredEvents.filter(
      (event) =>
        isOverdue(event)
    ).length;

  /* ========================================
     NEXT EVENT
  ======================================== */

  const nextEvent =
    useMemo(() => {
      const now =
        new Date();

      return filteredEvents
        .filter((event) => {
          const eventDate =
            new Date(
              `${event.date} ${
                event.time ||
                "00:00"
              }`
            );

          return (
            eventDate >= now
          );
        })
        .sort((a, b) => {
          const first =
            new Date(
              `${a.date} ${
                a.time ||
                "00:00"
              }`
            );

          const second =
            new Date(
              `${b.date} ${
                b.time ||
                "00:00"
              }`
            );

          return (
            first - second
          );
        })[0];
    }, [filteredEvents]);

  /* ========================================
     OPEN DETAILS
  ======================================== */

  const handleOpenDetails =
    (event) => {
      setSelectedEvent(event);

      setIsDetailsOpen(true);
    };

  /* ========================================
     PRIORITY COLORS
  ======================================== */

  const getPriorityColor =
    (priority) => {
      switch (
        priority
      ) {
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

  /* ========================================
     STATUS COLORS
  ======================================== */

  const getStatusColor =
    (status) => {
      switch (
        status
      ) {
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

  /* ========================================
     LOADING
  ======================================== */

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
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Team Calendar
        </h1>

        <p className="mt-2 text-slate-500 dark:text-zinc-400">
          View your meetings,
          schedules, deadlines
          and team events.
        </p>

      </div>

      {/* NEXT EVENT */}
      {nextEvent && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-7 text-white shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

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

              <p className="mt-3 text-emerald-100 max-w-2xl">
                {
                  nextEvent.description
                }
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[260px]">

              <MiniStat
                label="Date"
                value={formatDate(
                  nextEvent.date
                )}
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
                value={getAssignedUserName(
                  nextEvent.assigned_to
                )}
              />

            </div>

          </div>

        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={
            <CalendarDays />
          }
        />

        <StatCard
          title="Upcoming"
          value={
            upcomingEvents
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
          title="High Priority"
          value={
            highPriorityEvents
          }
          icon={
            <Flag />
          }
        />

        <StatCard
          title="Overdue"
          value={
            overdueEvents
          }
          icon={
            <AlertTriangle />
          }
        />

      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-200 dark:border-zinc-800">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* SEARCH */}
          <div className="lg:col-span-2 relative">

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
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-11 pr-4 py-3 dark:text-white outline-none focus:border-emerald-500"
            />

          </div>

          {/* PRIORITY */}
          <select
            value={
              priorityFilter
            }
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 dark:text-white outline-none"
          >

            <option value="All">
              All Priorities
            </option>

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

          {/* STATUS */}
          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 dark:text-white outline-none"
          >

            <option value="All">
              All Status
            </option>

            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Ongoing">
              Ongoing
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

      </div>

      {/* EVENTS */}
      <div className="space-y-5">

        {filteredEvents.map(
          (event) => (

            <div
              key={event.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
            >

              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                {/* LEFT */}
                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3">

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

                    {isOverdue(
                      event
                    ) && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">

                        Overdue

                      </span>
                    )}

                  </div>

                  <p className="mt-4 text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {
                      event.description
                    }
                  </p>

                  {/* INFO GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-6">

                    <InfoCard
                      label="Date"
                      value={formatDate(
                        event.date
                      )}
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
                      label="Assigned"
                      value={getAssignedUserName(
                        event.assigned_to
                      )}
                    />

                    <InfoCard
                      label="Visibility"
                      value={
                        event.visibility ||
                        "private"
                      }
                    />

                  </div>

                  {/* MEETING LINK */}
                  {event.meeting_link && (
                    <a
                      href={
                        event.meeting_link
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                    >

                      <Link2 size={16} />

                      Join Meeting

                    </a>
                  )}

                </div>

                {/* ACTION */}
                <button
                  onClick={() =>
                    handleOpenDetails(
                      event
                    )
                  }
                  className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center hover:scale-105 transition"
                >

                  <Eye size={18} />

                </button>

              </div>

            </div>
          )
        )}

      </div>

      {/* EMPTY STATE */}
      {filteredEvents.length ===
        0 && (

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-16 border border-slate-200 dark:border-zinc-800 text-center">

          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">

            <CalendarDays
              size={36}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">

            No Events Found

          </h2>

          <p className="mt-3 text-slate-500 dark:text-zinc-400">

            No events match your
            current filters.

          </p>

        </div>
      )}

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

/* ========================================
   MINI STAT
======================================== */

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

/* ========================================
   STAT CARD
======================================== */

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

/* ========================================
   INFO CARD
======================================== */

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

export default MemberCalendarPage;