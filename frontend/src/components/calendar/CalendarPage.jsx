import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  Eye,
  Flag,
  ListFilter,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { calendarData } from "../../data/calendarData";
import { exportCSV } from "../../utils/exportCSV";
import AddEventModal from "./AddEventModal";
import EventDetailsModal from "./EventDetailsModal";

const eventTypes = ["All", "Meeting", "Deadline", "Review", "Sprint"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const emptyEvent = (profile) => ({
  title: "",
  description: "",
  date: "",
  time: "",
  type: "Meeting",
  priority: "Medium",
  assignedTo: "",
  createdBy: profile?.full_name || profile?.role || "Admin",
});

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatMonth = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const formatEventDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
    case "Medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    case "Low":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "Deadline":
      return "bg-red-500";
    case "Review":
      return "bg-violet-500";
    case "Sprint":
      return "bg-blue-500";
    default:
      return "bg-emerald-500";
  }
};

function CalendarPage() {
  const { profile } = useAuth();

  const [events, setEvents] = useState(calendarData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeDate, setActiveDate] = useState(new Date(2026, 5, 10));
  const [selectedDate, setSelectedDate] = useState("2026-06-10");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventDraft, setEventDraft] = useState(() => emptyEvent(profile));

  const canManageEvents = profile?.role !== "member";

  const visibleEvents = useMemo(() => {
    const role = profile?.role || "member";
    const name = profile?.full_name || "";

    if (role === "admin") return events;
    if (role === "manager") {
      return events.filter(
        (event) =>
          event.assignedTo === "All Teams" ||
          event.assignedTo?.includes("Team") ||
          event.createdBy === name
      );
    }

    return events.filter(
      (event) => event.assignedTo === "All Teams" || event.assignedTo === name
    );
  }, [events, profile]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return visibleEvents
      .filter((event) => (typeFilter === "All" ? true : event.type === typeFilter))
      .filter((event) => {
        if (!query) return true;
        return [event.title, event.description, event.assignedTo, event.createdBy]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [search, typeFilter, visibleEvents]);

  const monthDays = useMemo(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay.getDay() }, (_, index) => ({
      key: `blank-${index}`,
      blank: true,
    }));

    const days = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return {
        key: toDateKey(date),
        day: index + 1,
        dateKey: toDateKey(date),
      };
    });

    return [...blanks, ...days];
  }, [activeDate]);

  const selectedDateEvents = filteredEvents.filter(
    (event) => event.date === selectedDate
  );

  const stats = {
    total: filteredEvents.length,
    meetings: filteredEvents.filter((event) => event.type === "Meeting").length,
    deadlines: filteredEvents.filter((event) => event.type === "Deadline").length,
    highPriority: filteredEvents.filter((event) => event.priority === "High").length,
  };

  const openAddModal = (date = selectedDate) => {
    setEditingEvent(null);
    setEventDraft({ ...emptyEvent(profile), date });
    setIsAddOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventDraft({ ...event });
    setIsAddOpen(true);
  };

  const saveEvent = () => {
    if (!eventDraft.title.trim() || !eventDraft.date) return;

    if (editingEvent) {
      setEvents((current) =>
        current.map((event) =>
          event.id === editingEvent.id ? { ...eventDraft, id: editingEvent.id } : event
        )
      );
    } else {
      setEvents((current) => [{ id: Date.now(), ...eventDraft }, ...current]);
    }

    setSelectedDate(eventDraft.date);
    setIsAddOpen(false);
    setEditingEvent(null);
    setEventDraft(emptyEvent(profile));
  };

  const deleteEvent = (eventId) => {
    setEvents((current) => current.filter((event) => event.id !== eventId));
    if (selectedEvent?.id === eventId) {
      setIsDetailsOpen(false);
      setSelectedEvent(null);
    }
  };

  const goToPreviousMonth = () => {
    setActiveDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setActiveDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const exportEvents = () => {
    exportCSV(
      "calendar-events.csv",
      filteredEvents.map((event) => ({
        title: event.title,
        type: event.type,
        date: event.date,
        time: event.time,
        priority: event.priority,
        assignedTo: event.assignedTo,
        createdBy: event.createdBy,
      }))
    );
  };

  const openDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Calendar & Events
          </h1>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Plan meetings, deadlines, reviews, and team schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportEvents}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            <Download size={17} />
            Export
          </button>

          {canManageEvents && (
            <button
              onClick={() => openAddModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add Event
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Events" value={stats.total} icon={CalendarDays} />
        <StatCard label="Meetings" value={stats.meetings} icon={Users} />
        <StatCard label="Deadlines" value={stats.deadlines} icon={Flag} />
        <StatCard label="High Priority" value={stats.highPriority} icon={Clock3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="relative lg:col-span-3">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by title, team, creator, or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-800 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative">
          <ListFilter
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            {eventTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {formatMonth(activeDate)}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Select a day to focus its schedule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setActiveDate(today);
                  setSelectedDate(toDateKey(today));
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold uppercase text-slate-500 dark:text-zinc-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              if (day.blank) {
                return <div key={day.key} className="min-h-28 rounded-xl" />;
              }

              const dayEvents = filteredEvents.filter(
                (event) => event.date === day.dateKey
              );
              const isSelected = selectedDate === day.dateKey;
              const isToday = toDateKey(new Date()) === day.dateKey;

              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDate(day.dateKey)}
                  className={`min-h-28 rounded-xl border p-2 text-left transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:border-emerald-700 dark:hover:bg-zinc-800/70"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold ${
                        isToday
                          ? "bg-emerald-600 text-white"
                          : "text-slate-700 dark:text-zinc-200"
                      }`}
                    >
                      {day.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-xs font-semibold text-slate-400">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-1 overflow-hidden rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${getTypeColor(
                            event.type
                          )}`}
                        />
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="px-1 text-xs font-medium text-slate-400">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Selected Date
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {formatEventDate(selectedDate)}
                </h2>
              </div>
              {canManageEvents && (
                <button
                  onClick={() => openAddModal(selectedDate)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {selectedDateEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <CalendarDays className="mx-auto text-slate-400" size={34} />
                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  No events here
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                  Choose another day or create a new event.
                </p>
              </div>
            ) : (
              selectedDateEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  canManage={canManageEvents}
                  onDetails={openDetails}
                  onEdit={openEditModal}
                  onDelete={deleteEvent}
                />
              ))
            )}
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Matching Events
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"} found.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              canManage={canManageEvents}
              onDetails={openDetails}
              onEdit={openEditModal}
              onDelete={deleteEvent}
              compact
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center">
            <CalendarDays className="mx-auto text-slate-400" size={36} />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No events found
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Try a different search or filter.
            </p>
          </div>
        )}
      </section>

      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingEvent(null);
        }}
        newEvent={eventDraft}
        setNewEvent={setEventDraft}
        handleAddEvent={saveEvent}
        mode={editingEvent ? "edit" : "add"}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{label}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, canManage, onDetails, onEdit, onDelete, compact = false }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${getTypeColor(event.type)}`} />
            <h3 className="truncate font-bold text-slate-900 dark:text-white">
              {event.title}
            </h3>
          </div>
          {!compact && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-zinc-400">
              {event.description}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(
            event.priority
          )}`}
        >
          {event.priority}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-zinc-300 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-slate-400" />
          {formatEventDate(event.date)}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 size={16} className="text-slate-400" />
          {event.time || "No time set"}
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Users size={16} className="text-slate-400" />
          <span className="truncate">{event.assignedTo || "Unassigned"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onDetails(event)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <Eye size={16} />
          Details
        </button>

        {canManage && (
          <>
            <button
              onClick={() => onEdit(event)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default CalendarPage;
