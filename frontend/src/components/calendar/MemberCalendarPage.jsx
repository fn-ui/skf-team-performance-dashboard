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
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import { getEvents } from "../../services/calendarService";

import { getUsers } from "../../services/userService";

import EventDetailsModal from "./EventDetailsModal";

function MemberCalendarPage() {

  const { profile } = useAuth();

  // ========================================
  // STATES
  // ========================================

  const [events, setEvents] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  // ========================================
  // LOAD EVENTS
  // ========================================

  useEffect(() => {

    loadEvents();

  }, []);

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

  // ========================================
  // GET ASSIGNED USER
  // ========================================

  // ========================================
// GET ASSIGNED USER
// ========================================

const getAssignedUserName = (
  userId
) => {

  // shared event
  if (!userId) {
    return "Team";
  }

  // current logged in member
  if (userId === profile?.id) {
    return "You";
  }

  const user = members.find(
    (member) =>
      member.id === userId
  );

  return (
    user?.full_name ||
    "Team"
  );
};

  

  // ========================================
// FILTER EVENTS
// ========================================

const filteredEvents = useMemo(() => {
  return events
    .filter((event) => {
      // show shared/team events
      if (!event.assigned_to) {
        return true;
      }

      // show only events assigned to current member
      return (
        event.assigned_to ===
        profile?.id
      );
    })
    .filter((event) =>
      event.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
}, [events, search, profile]);
 

  // ========================================
// STATS
// ========================================

const totalEvents =
  filteredEvents.length;

const upcomingEvents =
  filteredEvents.filter(
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
  filteredEvents.filter(
    (event) =>
      event.priority ===
      "High"
  ).length;
  // ========================================
  // OPEN DETAILS
  // ========================================

  const handleOpenDetails =
    (event) => {

      setSelectedEvent(event);

      setIsDetailsOpen(true);
    };

  // ========================================
  // PRIORITY COLORS
  // ========================================

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

  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="p-10 dark:text-white">

        Loading calendar...

      </div>
    );
  }

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">

          Team Calendar

        </h1>

        <p className="mt-1 text-slate-500 dark:text-zinc-400">

          View upcoming meetings,
          deadlines and team events.

        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* TOTAL */}
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

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

              <CalendarDays />

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

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                {upcomingEvents}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

              <CheckCircle2 />

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

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                {
                  highPriorityEvents
                }
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">

              <AlertTriangle />

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
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-11 pr-4 py-3 dark:text-white outline-none focus:border-emerald-500"
          />

        </div>

      </div>

      {/* EVENTS */}
      <div className="space-y-4">

        {filteredEvents.map(
          (event) => (

            <div
              key={event.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 transition hover:shadow-lg"
            >

              <div className="flex items-start justify-between gap-5 flex-wrap">

                {/* LEFT */}
                <div className="space-y-3">

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="text-xl font-bold dark:text-white">

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

                  {/* DETAILS */}
                  <div className="flex items-center gap-5 flex-wrap text-sm text-slate-500 dark:text-zinc-400">

                    <span className="flex items-center gap-2">

                      <CalendarDays size={15} />

                      {event.date}

                    </span>

                    <span className="flex items-center gap-2">

                      <Clock3 size={15} />

                      {event.time}

                    </span>

                    <span className="flex items-center gap-2">

                      <Users size={15} />

                      {getAssignedUserName(
                        event.assigned_to
                      )}

                    </span>

                  </div>

                </div>

                {/* ACTION */}
                <button
                  onClick={() =>
                    handleOpenDetails(
                      event
                    )
                  }
                  className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
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

          <h2 className="text-2xl font-bold dark:text-white">

            No Events Found

          </h2>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">

            No events match your
            search.

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

export default MemberCalendarPage;