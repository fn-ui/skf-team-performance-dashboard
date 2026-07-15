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
  Users,
  CheckCircle2,
  Loader2,
  CalendarClock,
  AlertTriangle,
  Briefcase,
  Link2,
  UserRound,
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

function ManagerCalendarPage() {
  const { profile } = useAuth();


  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);


  const initialEventState = {
    title: "",
    description: "",
    date: "",
    time: "",
    type: "Meeting",
    priority: "Medium",
    status: "Upcoming",
    visibility: "team",
    assignment_type: "individual",
    assigned_to: "",
    team_target: profile?.department || "",
    role_target: "",
    meeting_link: "",
    created_by: profile?.id || null,
  };

  const [newEvent, setNewEvent] = useState(initialEventState);


  useEffect(() => {
    if (profile?.id) {
      loadCalendarData();
    }
  }, [profile?.id]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);

      const [eventsData, usersData] = await Promise.all([
        getEvents(),
        getUsers(),
      ]);

      const allEvents = eventsData || [];
      const allUsers = usersData || [];


      const availableMembers = allUsers.filter((user) => {
        const isCurrentUser = String(user.id) === String(profile?.id);
        const isAdmin = String(user.role || "").toLowerCase().trim() === "admin";
        const belongsToManager = String(user.manager_id) === String(profile?.id);

        return !isCurrentUser && !isAdmin && belongsToManager;
      });

      setMembers(availableMembers);

      const memberIds = new Set(availableMembers.map((member) => String(member.id)));
            const visibleEvents = allEvents.filter((event) => {
              const eventCreatedBy = String(event.created_by || "");
              const eventAssignedTo = String(event.assigned_to || "");
              const currentUserId = String(profile?.id || "");

             const userDepartment = String(
                profile?.department || ""
              )
                .replace(/\s+/g, "")
                .trim()
                .toLowerCase();

              const eventTeamTarget = String(
                event.team_target || ""
              )
                .replace(/\s+/g, "")
                .trim()
                .toLowerCase();


              if (eventCreatedBy === currentUserId) {
                return true;
              }


              if (eventAssignedTo === currentUserId) {
                return true;
              }


              if (memberIds.has(eventAssignedTo)) {
                return true;
              }


                if (
                  event.assignment_type === "team" &&
                  eventTeamTarget === userDepartment
                ) {
                  return true;
                }

              if (
                event.assignment_type === "all" ||
                event.assignment_type === "all_members" ||
                event.visibility === "organization"
              ) {
                return true;
              }

              return false;
            });

      const sortedEvents = [...visibleEvents].sort((a, b) => {
        const first = new Date(`${a.date} ${a.time || "00:00"}`);
        const second = new Date(`${b.date} ${b.time || "00:00"}`);
        return first - second;
      });

      setEvents(sortedEvents);
    } catch (error) {
      console.error("CALENDAR LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-KE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAssignedUserName = (userId) => {
    if (!userId) return "Entire Team";

    if (String(userId) === String(profile?.id)) return "You";

    const user = members.find((member) => String(member.id) === String(userId));
    return user?.full_name || "Unknown Member";
  };

  const isOverdue = (event) => {
    if (!event.date || event.status === "Completed") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.date);
    return eventDate < today;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case "Medium": return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
      case "Low": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      case "Ongoing": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      case "Cancelled": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      default: return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    }
  };


  const filteredEvents = events
    .filter((event) => {
      const term = search.toLowerCase();
      return (
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.type?.toLowerCase().includes(term)
      );
    })
    .filter((event) => priorityFilter === "All" ? true : event.priority === priorityFilter)
    .filter((event) => statusFilter === "All" ? true : event.status === statusFilter)
    .filter((event) => typeFilter === "All" ? true : event.type === typeFilter);


  const totalEvents = events.length;
  const completedEvents = events.filter((event) => event.status === "Completed").length;
  const upcomingEvents = events.filter((event) => 
    event.status === "Upcoming" || event.status === "Ongoing"
  ).length;
  const highPriorityEvents = events.filter((event) => event.priority === "High").length;
  const overdueEvents = events.filter((event) => isOverdue(event)).length;

  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => {
        const eventDate = new Date(`${event.date} ${event.time || "00:00"}`);
        return eventDate >= now;
      })
      .sort((a, b) => {
        const first = new Date(`${a.date} ${a.time || "00:00"}`);
        const second = new Date(`${b.date} ${b.time || "00:00"}`);
        return first - second;
      })[0];
  }, [events]);


  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleEditEvent = (event) => {
    if (String(event.created_by) !== String(profile?.id)) return;

    setEditingEventId(event.id);
    setNewEvent({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      type: event.type || "Meeting",
      priority: event.priority || "Medium",
      status: event.status || "Upcoming",
      visibility: event.visibility || "team",
      assignment_type: event.assignment_type || "individual",
      assigned_to: event.assigned_to || "",
      team_target: event.team_target || "",
      role_target: event.role_target || "",
      meeting_link: event.meeting_link || "",
      created_by: profile?.id || null,
    });
    setIsAddOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    const confirmed = window.confirm("Delete this event permanently?");
    if (!confirmed) return;

    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error.message);
    }
  };

  const handleAddEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.date || !newEvent.time) {
        alert("Please complete all required fields.");
        return;
      }

      setSaving(true);

      const payload = {
        ...newEvent,
        assigned_to: newEvent.assigned_to || null,
        team_target: newEvent.team_target || null,
        role_target: newEvent.role_target || null,
        meeting_link: newEvent.meeting_link || null,
        created_by: profile?.id || null,
      };

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
        ...initialEventState,
        created_by: profile?.id || null,
      });
      setEditingEventId(null);
      setIsAddOpen(false);
    } catch (error) {
      console.error("SAVE EVENT ERROR:", error.message);
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
    <div className="space-y-6 p-5">


      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Team Calendar
          </h1>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Manage meetings,
            deadlines, workshops
            and team schedules.
          </p>

        </div>

        <button
          onClick={() => {
            setEditingEventId(
              null
            );

            setNewEvent({
              ...initialEventState,

              created_by:
                profile?.id ||
                null,
            });

            setIsAddOpen(
              true
            );
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700"
        >

          <Plus size={18} />

          Add Event

        </button>

      </div>

      <CalendarFocusPanel events={events} roleMode="manager" />


      {nextEvent && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white shadow-xl">

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <div className="mb-4 flex items-center gap-3">

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

              <p className="mt-3 max-w-2xl text-emerald-50">
                {
                  nextEvent.description
                }
              </p>

            </div>

            <div className="grid min-w-[280px] grid-cols-2 gap-4">

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


      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">

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
            <Clock3 />
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
          icon={<Users />}
        />

        <StatCard
          title="Overdue"
          value={overdueEvents}
          icon={
            <AlertTriangle />
          }
        />

      </div>


      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">


          <div className="relative xl:col-span-2">

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
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>


          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
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


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
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


          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          >

            <option value="All">
              All Types
            </option>

            <option value="Meeting">
              Meeting
            </option>

            <option value="Workshop">
              Workshop
            </option>

            <option value="Sprint">
              Sprint
            </option>

            <option value="Review">
              Review
            </option>

            <option value="Deadline">
              Deadline
            </option>

          </select>

        </div>

      </div>


      <div className="space-y-5">

        {filteredEvents.map(
          (event) => (

            <div
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
            >

              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                <div className="flex-1">


                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-2xl font-bold dark:text-white">
                      {
                        event.title
                      }
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(
                        event.priority
                      )}`}
                    >
                      {
                        event.priority
                      }
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
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
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-400">

                        Overdue

                      </span>
                    )}

                  </div>


                  <p className="mt-4 leading-relaxed text-slate-500 dark:text-zinc-400">
                    {
                      event.description
                    }
                  </p>


                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    <InfoCard
                      icon={
                        <CalendarDays size={16} />
                      }
                      label="Date"
                      value={formatDate(
                        event.date
                      )}
                    />

                    <InfoCard
                      icon={
                        <Clock3 size={16} />
                      }
                      label="Time"
                      value={
                        event.time ||
                        "-"
                      }
                    />

                    <InfoCard
                      icon={
                        <Briefcase size={16} />
                      }
                      label="Type"
                      value={
                        event.type
                      }
                    />

                    <InfoCard
                      icon={
                        <UserRound size={16} />
                      }
                      label="Assigned To"
                      value={getAssignedUserName(
                        event.assigned_to
                      )}
                    />

                    <InfoCard
                      icon={
                        <Link2 size={16} />
                      }
                      label="Meeting Link"
                      value={
                        event.meeting_link
                          ? "Available"
                          : "-"
                      }
                    />

                  </div>

                </div>


                <div className="flex gap-3 xl:flex-col">

                  <ActionButton
                    onClick={() =>
                      handleOpenDetails(
                        event
                      )
                    }
                    icon={
                      <Eye size={18} />
                    }
                    color="blue"
                  />

                  {String(
                    event.created_by
                  ) ===
                    String(
                      profile?.id
                    ) && (
                    <>
                      <ActionButton
                        onClick={() =>
                          handleEditEvent(
                            event
                          )
                        }
                        icon={
                          <Pencil size={18} />
                        }
                        color="amber"
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
                        color="red"
                      />
                    </>
                  )}

                </div>

              </div>

            </div>
          )
        )}

      </div>


      {filteredEvents.length ===
        0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">

            <CalendarDays className="text-emerald-600 dark:text-emerald-400" />

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
        currentUser={
          profile
        }
        saving={saving}
      />


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


function MiniStat({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">

      <p className="text-sm text-emerald-50">
        {label}
      </p>

      <h3 className="mt-2 text-lg font-bold">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 dark:text-zinc-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold dark:text-white">
            {value}
          </h2>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">

          {icon}

        </div>

      </div>

    </div>
  );
}


function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-zinc-800">

      <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">

        {icon}

        <p className="text-xs">
          {label}
        </p>

      </div>

      <h3 className="mt-3 font-semibold dark:text-white break-words">
        {value || "-"}
      </h3>

    </div>
  );
}


function ActionButton({
  icon,
  onClick,
  color = "emerald",
}) {
  const styles = {
    blue: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",

    amber:
      "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",

    red: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",

    emerald:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <button
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition hover:scale-105 ${styles[color]}`}
    >

      {icon}

    </button>
  );
}

export default ManagerCalendarPage;
