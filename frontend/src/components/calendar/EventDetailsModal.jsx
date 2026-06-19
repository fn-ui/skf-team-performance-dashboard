import { useMemo } from "react";

import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  Users,
  Briefcase,
  Info,
  CheckCircle2,
  AlertCircle,
  UsersRound,
  Layers3,
  Link2,
  Building2,
  ShieldCheck,
} from "lucide-react";

function EventDetailsModal({
  isOpen,
  onClose,
  selectedEvent,
  members = [],
}) {
  if (!isOpen || !selectedEvent) {
    return null;
  }

  /* ========================================
     PRIORITY COLORS
  ======================================== */

  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900";

      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900";

      case "Low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
    }
  };

  /* ========================================
     STATUS COLORS
  ======================================== */

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900";

      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900";

      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900";

      case "Upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
    }
  };

  /* ========================================
     ASSIGNED USER
  ======================================== */

  const assignedUser =
    members.find(
      (member) =>
        member.id ===
        selectedEvent.assigned_to
    );

  /* ========================================
     CREATED BY USER
  ======================================== */

  const createdByUser =
    members.find(
      (member) =>
        member.id ===
        selectedEvent.created_by
    );

  /* ========================================
     ASSIGNMENT LABEL
  ======================================== */

  const assignmentLabel =
    useMemo(() => {
      switch (
        selectedEvent.assignment_type
      ) {
        case "individual":
          return assignedUser
            ?.full_name
            ? `${assignedUser.full_name}`
            : "Individual Member";

        case "team":
          return `Team • ${
            selectedEvent.team_target ||
            "Department"
          }`;

        case "manager":
          return "Managers";

        case "role":
          return `Role • ${
            selectedEvent.role_target ||
            "-"
          }`;

        case "all_members":
          return "All Members";

        case "all":
          return "Everyone";

        default:
          return "Not Assigned";
      }
    }, [
      selectedEvent,
      assignedUser,
    ]);

  /* ========================================
     VISIBILITY LABEL
  ======================================== */

  const visibilityLabel =
    useMemo(() => {
      switch (
        selectedEvent.visibility
      ) {
        case "organization":
          return "Organization Wide";

        case "team":
          return "Team Visibility";

        default:
          return "Private / Individual";
      }
    }, [
      selectedEvent.visibility,
    ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm">

     <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* HEADER */}
        <div className="border-b border-slate-200 p-6 dark:border-zinc-800">

          <div className="flex items-start justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">

                <CalendarDays size={30} />

              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold dark:text-white">
                    {selectedEvent.title}
                  </h1>

                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getPriorityColor(
                      selectedEvent.priority
                    )}`}
                  >
                    {
                      selectedEvent.priority
                    }
                  </span>

                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(
                      selectedEvent.status
                    )}`}
                  >
                    {selectedEvent.status ||
                      "Pending"}
                  </span>

                </div>

                <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-zinc-300">
                  {selectedEvent.description ||
                    "No description provided for this event."}
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
            >

              <X
                size={22}
                className="dark:text-white"
              />

            </button>

          </div>

        </div>

        {/* BODY */}
        <div className="space-y-5 p-4">

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

            {/* DATE */}
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">

                  <CalendarDays className="text-emerald-600 dark:text-emerald-400" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Event Date
                  </p>

                  <h3 className="mt-1 text-lg font-bold dark:text-white">
                    {selectedEvent.date ||
                      "-"}
                  </h3>

                </div>

              </div>

            </div>

            {/* TIME */}
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950">

                  <Clock3 className="text-blue-600 dark:text-blue-400" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Event Time
                  </p>

                  <h3 className="mt-1 text-lg font-bold dark:text-white">
                    {selectedEvent.time ||
                      "-"}
                  </h3>

                </div>

              </div>

            </div>

            {/* TYPE */}
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950">

                  <Briefcase className="text-purple-600 dark:text-purple-400" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Event Type
                  </p>

                  <h3 className="mt-1 text-lg font-bold dark:text-white">
                    {selectedEvent.type ||
                      "Meeting"}
                  </h3>

                </div>

              </div>

            </div>

            {/* VISIBILITY */}
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-zinc-950">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950">

                  <Layers3 className="text-amber-600 dark:text-amber-400" />

                </div>

                <div>

                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Visibility
                  </p>

                  <h3 className="mt-1 text-lg font-bold dark:text-white">
                    {
                      visibilityLabel
                    }
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* ASSIGNMENT + CREATOR */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* ASSIGNMENT */}
            <div className="border-b border-slate-200 p-4 dark:border-zinc-800">
              <div className="mb-5 flex items-center gap-3">

                <UsersRound className="text-emerald-600 dark:text-emerald-400" />

                <h3 className="text-xl font-bold dark:text-white">
                  Assignment Details
                </h3>

              </div>

              <div className="space-y-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">

                    <Users className="text-emerald-600 dark:text-emerald-400" />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Assigned To
                    </p>

                    <h4 className="mt-1 text-lg font-bold dark:text-white">
                      {assignmentLabel}
                    </h4>

                  </div>

                </div>

                {assignedUser && (
                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950">

                      <UserRound className="text-blue-600 dark:text-blue-400" />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Member Role
                      </p>

                      <h4 className="mt-1 text-lg font-bold dark:text-white">
                        {
                          assignedUser.role
                        }
                      </h4>

                    </div>

                  </div>
                )}

                {selectedEvent.team_target && (
                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950">

                      <Building2 className="text-purple-600 dark:text-purple-400" />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Team / Department
                      </p>

                      <h4 className="mt-1 text-lg font-bold dark:text-white">
                        {
                          selectedEvent.team_target
                        }
                      </h4>

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* CREATED BY */}
            <div className="rounded-2xl border border-slate-200 p-6 dark:border-zinc-800">

              <div className="mb-5 flex items-center gap-3">

                <ShieldCheck className="text-blue-600 dark:text-blue-400" />

                <h3 className="text-xl font-bold dark:text-white">
                  Event Management
                </h3>

              </div>

              <div className="space-y-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">

                    <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Created By
                    </p>

                    <h4 className="mt-1 text-lg font-bold dark:text-white">
                      {createdByUser
                        ?.full_name ||
                        "Admin"}
                    </h4>

                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950">

                    <Flag className="text-amber-600 dark:text-amber-400" />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Priority Level
                    </p>

                    <h4 className="mt-1 text-lg font-bold dark:text-white">
                      {
                        selectedEvent.priority
                      }
                    </h4>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* MEETING LINK */}
          {selectedEvent.meeting_link && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/20">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900">

                    <Link2 className="text-emerald-600 dark:text-emerald-400" />

                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      Meeting Link
                    </h3>

                    <p className="mt-1 break-all text-sm text-emerald-700 dark:text-emerald-400">
                      {
                        selectedEvent.meeting_link
                      }
                    </p>

                  </div>

                </div>

                <a
                  href={
                    selectedEvent.meeting_link
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Join Meeting
                </a>

              </div>

            </div>
          )}

          {/* DESCRIPTION */}
          <div className="rounded-3xl bg-slate-50 p-6 dark:bg-zinc-950">

            <div className="mb-5 flex items-center gap-3">

              <Info className="text-slate-500 dark:text-zinc-400" />

              <h3 className="text-xl font-bold dark:text-white">
                Event Notes
              </h3>

            </div>

            <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
              {selectedEvent.description ||
                "No additional notes available."}
            </p>

          </div>

          {/* REMINDER */}
          <div className="flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">

            <AlertCircle className="mt-0.5 text-amber-600 dark:text-amber-400" />

            <div>

              <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                Event Reminder
              </h4>

              <p className="mt-1 text-sm leading-relaxed text-amber-700 dark:text-amber-400">
                Ensure all invited participants receive the
                meeting details before the scheduled time.
                Managers can monitor attendance and team
                scheduling directly from the calendar system.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetailsModal;