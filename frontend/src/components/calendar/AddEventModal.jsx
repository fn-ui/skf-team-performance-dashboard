import { useMemo ,useEffect,} from "react";

import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  Users,
  FileText,
  Layers3,
  Briefcase,
  UserRound,
  UsersRound,
  ShieldCheck,
  Building2,
  Link2,
  AlertCircle,
  Globe2,
  UserCheck,
} from "lucide-react";

function AddEventModal({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleAddEvent,
  members = [],
  mode,
  currentUser,
}) {
  const isEditing =
    mode === "edit";

  /* ========================================
     ROLE
  ======================================== */

  const currentRole =
    currentUser?.role
      ?.toLowerCase()
      ?.trim() || "";

  /* ========================================
     ROLE FLAGS
  ======================================== */

  const isAdmin =
    currentRole === "admin";

  const isManager =
    currentRole ===
      "manager" ||
    currentRole ===
      "team manager";

  /* ========================================
     ASSIGNMENT TYPE
  ======================================== */

  const assignmentType =
    newEvent.assignment_type ||
    "individual";

  /* ========================================
     ACCESSIBLE MEMBERS
  ======================================== */

  const accessibleMembers =
    useMemo(() => {

      /* ========= ADMIN ========= */
      if (isAdmin) {

        return members.filter(
          (member) => {

            const role =
              member.role
                ?.toLowerCase()
                ?.trim();

            // exclude admins only
            return (
              role !== "admin"
            );
          }
        );
      }

      /* ========= MANAGER ========= */
      if (isManager) {

        return members.filter(
          (member) => {

            const role =
              member.role
                ?.toLowerCase()
                ?.trim();

            /* EXCLUDE ADMINS */
            if (
              role === "admin"
            ) {
              return false;
            }

            /* INCLUDE MANAGERS */
            if (
              role ===
                "manager" ||
              role ===
                "team manager"
            ) {
              return true;
            }

            /* INCLUDE OWN TEAM MEMBERS */
            return (
              String(
                member.manager_id
              ) ===
              String(
                currentUser?.id
              )
            );
          }
        );
      }

      return [];

    }, [
      members,
      isAdmin,
      isManager,
      currentUser,
    ]);

  /* ========================================
     VALIDATION
  ======================================== */

  const isDisabled =
    !newEvent.title?.trim() ||
    !newEvent.date ||
    !newEvent.time ||
    !newEvent.type ||
    (
      assignmentType ===
        "individual" &&
      !newEvent.assigned_to
    ) ||
    (
      assignmentType ===
        "team" &&
      !newEvent.team_target
    ) ||
    (
      assignmentType ===
        "role" &&
      !newEvent.role_target
    );

  /* ========================================
     ROLE DATA
  ======================================== */

  const roles = [
    ...new Set(
      accessibleMembers
        .map(
          (member) =>
            member.role
        )
        .filter(Boolean)
    ),
  ];

  /* ========================================
     TEAM DATA
  ======================================== */

  const teams =
    useMemo(() => {

      /* ========= ADMIN ========= */
      if (isAdmin) {

        return (
          members || []
        )

          .filter((member) => {

            const role =
              member.role
                ?.toLowerCase()
                ?.trim();

            return (
              role !== "admin"
            );
          })

          .reduce(
            (acc, member) => {

              const department =
                member.department;

              if (
                department &&
                !acc.includes(
                  department
                )
              ) {
                acc.push(
                  department
                );
              }

              return acc;

            },
            []
          );
      }

      /* ========= MANAGER ========= */
      if (isManager) {

        return (
          members || []
        )

          .filter(
            (member) =>

              String(
                member.manager_id
              ) ===
              String(
                currentUser?.id
              )
          )

          .reduce(
            (acc, member) => {

              const department =
                member.department;

              if (
                department &&
                !acc.includes(
                  department
                )
              ) {
                acc.push(
                  department
                );
              }

              return acc;

            },
            []
          );
      }

      return [];

    }, [
      members,
      currentUser,
      isAdmin,
      isManager,
    ]);

  /* ========================================
     ASSIGNMENT OPTIONS
  ======================================== */

  const assignmentOptions =
    isAdmin
      ? [
          "individual",
          "team",
          "manager",
          "role",
          "all_members",
          "all",
        ]
      : [
          "individual",
          "team",
          "manager",
          "role",
        ];

 /* ========================================
   TEAM OPTIONS
======================================== */

const teamOptions =
  useMemo(() => {

    /* GET MANAGERS */
    const managers =
      (members || []).filter(
        (member) => {

          const role =
            member.role
              ?.toLowerCase()
              ?.trim();

          return (
            role ===
              "manager" ||

            role ===
              "team manager"
          );
        }
      );

    return managers.map(
      (manager) => {

        /* TEAM MEMBERS */
        const teamMembers =
          (members || []).filter(
            (member) =>
              String(
                member.manager_id
              ) ===
              String(
                manager.id
              )
          );

        return {

          managerId:
            manager.id,

          managerName:
            manager.full_name,

          teamName:
            `${manager.full_name}'s Team`,

          department:
            manager.department,

          totalMembers:
            teamMembers.length,
        };
      }
    );

  }, [members]);

  /* ========================================
   AUTO TEAM TARGET FOR MANAGER
======================================== */

useEffect(() => {

  if (
    isManager &&
    assignmentType === "team"
  ) {

    const managerTeam =
      members.find(
        (member) =>
          String(member.id) ===
          String(currentUser?.id)
      )?.department;

    setNewEvent((prev) => ({
      ...prev,
      team_target:
        managerTeam || "",
    }));
  }

}, [
  isManager,
  assignmentType,
  members,
  currentUser,
  setNewEvent,
]);
/* ========================================

   PRIORITY COLORS

======================================== */



const priorityColor =

  useMemo(() => {



    switch (

      newEvent.priority

    ) {



      case "High":

        return "text-red-500";



      case "Medium":

        return "text-amber-500";



      case "Low":

        return "text-emerald-500";



      default:

        return "text-slate-500";

    }



  }, [newEvent.priority]);

  /* ========================================
     FILTERED MEMBERS
  ======================================== */

  const filteredMembers =

    assignmentType ===
    "team"

      ? accessibleMembers.filter(
          (member) =>
            member.department ===
            newEvent.team_target
        )

      : assignmentType ===
        "role"

      ? accessibleMembers.filter(
          (member) =>
            member.role ===
            newEvent.role_target
        )

      : assignmentType ===
        "manager"

      ? accessibleMembers.filter(
          (member) => {

            const role =
              member.role
                ?.toLowerCase();

            return (
              role?.includes(
                "manager"
              )
            );
          }
        )

      : accessibleMembers;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-3xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-zinc-800">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">

              <CalendarDays size={22} />

            </div>

            <div>

              <h2 className="text-2xl font-bold dark:text-white">

                {isEditing
                  ? "Edit Event"
                  : "Create Event"}

              </h2>

              <p className="mt-1 text-slate-500 dark:text-zinc-400">

                Production-ready scheduling and delivery system.

              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
          >

            <X
              size={20}
              className="dark:text-white"
            />

          </button>

        </div>

        {/* BODY */}
        <div className="space-y-6 p-6">

          {/* TITLE */}
          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

              <FileText size={16} />

              Event Title

            </label>

            <input
              type="text"
              value={newEvent.title || ""}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  title:
                    e.target.value,
                })
              }
              placeholder="Enter event title"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

              <FileText size={16} />

              Description

            </label>

            <textarea
              rows={4}
              value={
                newEvent.description ||
                ""
              }
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  description:
                    e.target.value,
                })
              }
              placeholder="Describe the event..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

                <CalendarDays size={16} />

                Event Date

              </label>

              <input
                type="date"
                value={newEvent.date || ""}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    date:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

                <Clock3 size={16} />

                Event Time

              </label>

              <input
                type="time"
                value={newEvent.time || ""}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    time:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />

            </div>

          </div>

          {/* TYPE + PRIORITY */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 text-sm font-semibold dark:text-white block">

                Event Type

              </label>

              <select
                value={
                  newEvent.type ||
                  "Meeting"
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    type:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >

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

            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-white">

                <Flag
                  size={16}
                  className={
                    priorityColor
                  }
                />

                Priority

              </label>

              <select
                value={
                  newEvent.priority ||
                  "Medium"
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    priority:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >

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

            </div>

          </div>

          {/* ASSIGNMENT SECTION */}
          <div className="rounded-3xl border border-slate-200 p-5 dark:border-zinc-800">

            <div className="mb-5 flex items-start justify-between gap-4">

              <div>

                <label className="flex items-center gap-2 text-sm font-semibold dark:text-white">

                  <UsersRound size={18} />

                  Assign Event To

                </label>

                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">

                  Configure delivery targets for this meeting or event.

                </p>

              </div>

              {isManager && !isAdmin && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">

                  <ShieldCheck size={14} />

                  Managers can assign only within their team scope.

                </div>
              )}

            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

              {/* INDIVIDUAL */}
              {assignmentOptions.includes(
                "individual"
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      assignment_type:
                        "individual",
                    })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    assignmentType ===
                    "individual"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200"
                  }`}
                >

                  <div className="flex items-center justify-center gap-2">

                    <UserRound size={16} />

                    Individual

                  </div>

                </button>
              )}

              {/* TEAM */}
              {assignmentOptions.includes(
                "team"
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      assignment_type:
                        "team",
                    })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    assignmentType ===
                    "team"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200"
                  }`}
                >

                  <div className="flex items-center justify-center gap-2">

                    <Building2 size={16} />

                    Team

                  </div>

                </button>
              )}

              {/* MANAGERS */}
              {assignmentOptions.includes(
                "manager"
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      assignment_type:
                        "manager",
                    })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    assignmentType ===
                    "manager"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200"
                  }`}
                >

                  <div className="flex items-center justify-center gap-2">

                    <ShieldCheck size={16} />

                    Managers

                  </div>

                </button>
              )}

              {/* ROLE */}
              {assignmentOptions.includes(
                "role"
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      assignment_type:
                        "role",
                    })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    assignmentType ===
                    "role"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200"
                  }`}
                >

                  <div className="flex items-center justify-center gap-2">

                    <Users size={16} />

                    Role

                  </div>

                </button>
              )}

              {/* ALL MEMBERS */}
              {isAdmin &&
                assignmentOptions.includes(
                  "all_members"
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      setNewEvent({
                        ...newEvent,
                        assignment_type:
                          "all_members",
                        assigned_to:
                          null,
                        team_target:
                          null,
                        role_target:
                          null,
                      })
                    }
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      assignmentType ===
                      "all_members"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200"
                    }`}
                  >

                    <div className="flex items-center justify-center gap-2">

                      <UserCheck size={16} />

                      All Members

                    </div>

                  </button>
                )}

              {/* EVERYONE */}
              {isAdmin &&
                assignmentOptions.includes(
                  "all"
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      setNewEvent({
                        ...newEvent,
                        assignment_type:
                          "all",
                        assigned_to:
                          null,
                        team_target:
                          null,
                        role_target:
                          null,
                      })
                    }
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      assignmentType ===
                      "all"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200"
                    }`}
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Globe2 size={16} />

                      Everyone

                    </div>

                  </button>
                )}

            </div>

            {/* INDIVIDUAL */}
            {assignmentType ===
              "individual" && (
              <div className="mt-5">

                <select
                  value={
                    newEvent.assigned_to ||
                    ""
                  }
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      assigned_to:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                >

                  <option value="">
                    Select member
                  </option>

                  {filteredMembers.map(
                    (member) => (
                      <option
                        key={
                          member.id
                        }
                        value={
                          member.id
                        }
                      >
                        {
                          member.full_name
                        }{" "}
                        (
                        {
                          member.role
                        }
                        )
                      </option>
                    )
                  )}

                </select>

              </div>
            )}

          
            {assignmentType ===
              "team" && (

              <div className="mt-5">

                {/* ========= ADMIN ========= */}
                {isAdmin && (

                  <select
                    value={
                      newEvent.team_target ||
                      ""
                    }
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        team_target:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  >

                    <option value="">
                      Select Manager Team
                    </option>

                    {teamOptions.map(
                      (team) => (

                        <option
                          key={
                            team.managerId
                          }
                          value={
                            team.department
                          }
                        >

                          {team.teamName}
                          {" • "}
                          {
                            team.totalMembers
                          }
                          {" members"}

                        </option>
                      )
                    )}

                  </select>
                )}

    {/* ========= MANAGER ========= */}
    {isManager &&
      !isAdmin && (

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900 dark:bg-emerald-950/20">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">

            <Users size={18} />

          </div>

          <div>

            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">

              Your Team

            </h4>

            <p className="text-sm text-emerald-600 dark:text-emerald-400">

              This event will automatically be assigned to your team members.

            </p>

          </div>

        </div>

      </div>
    )}

  </div>
)}

            {/* ROLE */}
            {assignmentType ===
              "role" && (
              <div className="mt-5">

                <select
                  value={
                    newEvent.role_target ||
                    ""
                  }
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      role_target:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                >

                  <option value="">
                    Select role
                  </option>

                  {roles.map(
                    (role) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {role}
                      </option>
                    )
                  )}

                </select>

              </div>
            )}

            {/* INFO MESSAGE */}
            {(assignmentType ===
              "all_members" ||
              assignmentType ===
                "all") && (
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">

                <div className="flex items-start gap-3">

                  <Globe2
                    size={18}
                    className="mt-0.5 text-blue-600"
                  />

                  <div>

                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">

                      Global Event Distribution

                    </h4>

                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">

                      This event will automatically be visible to{" "}
                      {assignmentType ===
                      "all_members"
                        ? "all members"
                        : "everyone in the organization"}.

                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* MEETING LINK */}
          <div>

            <label className="mb-2 flex items-center gap-2 font-semibold dark:text-white">

              <Link2 size={16} />

              Meeting Link

            </label>

            <input
              type="url"
              value={
                newEvent.meeting_link ||
                ""
              }
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  meeting_link:
                    e.target.value,
                })
              }
              placeholder="https://meet.google.com/..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-medium transition hover:bg-slate-100 dark:border-zinc-700 dark:text-white"
          >

            Cancel

          </button>

          <button
            onClick={
              handleAddEvent
            }
            disabled={
              isDisabled
            }
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {isEditing
              ? "Save Changes"
              : "Create Event"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default AddEventModal;