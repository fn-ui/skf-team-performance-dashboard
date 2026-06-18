import {
  X,
  Target,
  CalendarDays,
  Flag,
  Building2,
  User2,
  FileText,
  Users,
  Briefcase,
  Layers3,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function CreateGoalModal({
  isOpen,
  onClose,
  newGoal,
  setNewGoal,
  handleCreateGoal,
  users,
  saving,
}) {
  const { profile } = useAuth();

  if (!isOpen) return null;

  /* ========================================
   ROLE
======================================== */

const currentRole =
  profile?.role
    ?.toLowerCase()
    ?.trim() || "member";

/* ========================================
   AVAILABLE USERS
======================================== */

const availableUsers =
  (users || []).filter(
    (user) => {

      const role =
        user.role
          ?.toLowerCase()
          ?.trim();

          

      /* ========= ADMIN ========= */

      if (
        currentRole ===
        "admin"
      ) {

        return (
          role !== "admin"
        );
      }

      /* ========= MANAGER ========= */

      if (
        currentRole ===
        "team manager"
      ) {

        return (

            /* EXCLUDE ADMINS + MANAGERS */
            role !== "admin" &&
            role !== "team manager" &&

            /* ONLY USERS UNDER THIS MANAGER */
            String(
              user.manager_id
            ) ===
              String(
                profile?.id
              )
          );
      }

      /* ========= MEMBER ========= */

      if (
        currentRole ===
        "member"
      ) {

        return (
          String(user.id) ===
          String(profile?.id)
        );
      }

      return false;
    }
  );

/* ========================================
   MANAGERS
======================================== */
const managers =
  users?.filter(
    (user) =>
      user.role
        ?.toLowerCase()
        ?.trim() ===
      "team manager"
  ) || [];

/* ========================================
   MEMBERS
======================================== */

const members =
  availableUsers.filter(
    (user) =>
      user.role
        ?.toLowerCase()
        ?.trim() ===
      "member"
  );

/* ========================================
   SPECIFIC TEAMS
======================================== */

const managerTeams =
  (users || [])

    /* ONLY TEAM MANAGERS */
    .filter((user) => {

      const role =
        user.role
          ?.toLowerCase()
          ?.trim();

      return (
        role === "team manager"
      );
    })

    .map((manager) => {

      /* MEMBERS UNDER THIS MANAGER */
      const teamMembers =
        (users || []).filter(
          (user) =>
            String(
              user.manager_id
            ) ===
              String(
                manager.id
              ) &&

            /* EXCLUDE ADMINS + MANAGERS */
            user.role
              ?.toLowerCase()
              ?.trim() !==
              "team manager" &&

            user.role
              ?.toLowerCase()
              ?.trim() !==
              "admin"
        );

      return {

        manager,

        teamMembers,

        totalMembers:
          teamMembers.length,

        memberIds:
          teamMembers.map(
            (member) =>
              member.id
          ),

        allTeamIds: [
          manager.id,

          ...teamMembers.map(
            (member) =>
              member.id
          ),
        ],

        teamName:
          `${manager.full_name}'s Team`,
      };
    })

    .filter(
      (team) =>
        team.totalMembers > 0
    );

/* ========================================
   SELECTED TEAM
======================================== */

const selectedTeam =
  managerTeams.find(
    (team) =>
      String(
        team.manager.id
      ) ===
      String(
        newGoal.manager_id
      )
  );

/* ========================================
   TEAM PREVIEW USERS
======================================== */

const selectedTeamUsers =
  (users || []).filter(
    (user) =>
      selectedTeam?.allTeamIds?.includes(
        user.id
      )
  );
  /* ========================================
     PRIORITY COLORS
  ======================================== */

  const priorityStyles = {
    High: "text-red-600",
    Medium:
      "text-amber-600",
    Low: "text-emerald-600",
  };

  /* ========================================
   TEAM STRUCTURE
======================================== */

const teamOptions =
  useMemo(() => {

    /* ONLY MANAGERS */
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
          managerName:
            manager.full_name,

          teamName:
            `${manager.full_name}'s Team`,

          department:
            manager.department,

          totalMembers:
            teamMembers.length,

          managerId:
            manager.id,
        };
      }
    );

  }, [members]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      {/* MODAL */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8">

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-5">

            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">

              <Target size={30} />

            </div>

            <div>

              <h2 className="text-3xl font-bold text-white">
                Create Goal
              </h2>

              <p className="text-emerald-50 mt-2 max-w-xl">
                Create strategic goals,
                assign ownership and
                monitor organization
                performance.
              </p>

            </div>

          </div>

        </div>

        {/* BODY */}
        <div className="p-8 space-y-7">

          {/* TITLE */}
          <div>

            <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

              <Target
                size={16}
                className="text-emerald-600"
              />

              Goal Title

            </label>

            <input
              type="text"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  title:
                    e.target.value,
                })
              }
              placeholder="Improve team productivity by 30%"
              className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

              <FileText
                size={16}
                className="text-emerald-600"
              />

              Goal Description

            </label>

            <textarea
              rows={5}
              value={
                newGoal.description
              }
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  description:
                    e.target.value,
                })
              }
              placeholder="Describe the purpose, expected outcomes and targets..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none resize-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
            />

          </div>

          {/* ASSIGNMENT TYPE */}
          <div>

            <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

              <Layers3
                size={16}
                className="text-emerald-600"
              />

              Assignment Type

            </label>

            <select
              value={
                newGoal.assignment_type ||
                ""
              }
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  assignment_type:
                    e.target.value,
                  owner_id: "",
                  manager_id:
                    "",
                })
              }
              className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
            >

              <option value="">
                Select Assignment Type
              </option>

              {/* ADMIN OPTIONS */}
              {currentRole ===
                "admin" && (
                <>
                  <option value="individual">
                    Individual User
                  </option>

                  <option value="all_managers">
                    All Managers
                  </option>

                  <option value="all_members">
                    All Members
                  </option>

                  <option value="all">
                    Entire Organization
                  </option>

                  <option value="specific_team">
                    Specific Team
                  </option>
                </>
              )}

              {/* MANAGER OPTIONS */}
              {currentRole ===
                "team manager" && (
                <>
                  <option value="individual">
                    Individual Member
                  </option>

                  <option value="team">
                    Entire Team
                  </option>
                </>
              )}

              {/* MEMBER */}
              {currentRole ===
                "member" && (
                <option value="self">
                  Personal Goal
                </option>
              )}

             

            </select>

          </div>

          {/* CONDITIONAL ASSIGNMENT */}
          {(newGoal.assignment_type ===
            "individual" ||
            newGoal.assignment_type ===
              "self") && (
            <div>

              <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

                <User2
                  size={16}
                  className="text-emerald-600"
                />

                Assign Goal

              </label>

              <select
                value={
                  newGoal.owner_id
                }
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    owner_id:
                      e.target
                        .value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
              >

                <option value="">
                  Select User
                </option>

                {availableUsers?.map(
                  (user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {
                        user.full_name
                      }{" "}
                      •{" "}
                      {user.role}
                    </option>
                  )
                )}

              </select>

            </div>
          )}
{/* SPECIFIC TEAM */}
{currentRole ===
  "admin" &&
  newGoal.assignment_type ===
    "specific_team" && (

  <div className="space-y-5">

    {/* LABEL */}
    <div>

      <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

        <Users
          size={16}
          className="text-emerald-600"
        />

        Select Team

      </label>

      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">
        Choose a manager and automatically assign
        this goal to the manager together with
        their entire team.
      </p>

    </div>

    {/* SELECT */}
    <div className="relative">

      <select
        value={
          newGoal.manager_id ||
          ""
        }
        onChange={(e) => {

          const selectedManagerId =
            e.target.value;

          const selectedTeam =
            managerTeams.find(
              (team) =>
                String(
                  team.manager.id
                ) ===
                String(
                  selectedManagerId
                )
            );

          setNewGoal({
            ...newGoal,

            manager_id:
              selectedManagerId,

            /* TEAM IDS */
            team_member_ids:
              selectedTeam
                ?.allTeamIds || [],
          });
        }}
        className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
      >

        <option value="">
          Select Manager Team
        </option>

        {(managerTeams || []).map(
          (team) => (

            <option
              key={
                team.manager.id
              }
              value={
                team.manager.id
              }
            >

              {team.teamName}
              {" • "}
              {
                team.totalMembers
              }{" "}
              members

            </option>
          )
        )}

      </select>

    </div>

    {/* TEAM PREVIEW */}
    {selectedTeam && (

      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-[28px] p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">

              <Users size={24} />

            </div>

            <div>

              <h4 className="text-xl font-bold dark:text-white">

                {
                  selectedTeam.teamName
                }

              </h4>

              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">

                Goal will be assigned to the manager
                and all team members.

              </p>

            </div>

          </div>

          {/* TOTAL */}
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">

            {
              selectedTeam
                .allTeamIds
                .length
            }{" "}
            users included

          </div>

        </div>

        {/* MANAGER */}
        <div className="mb-6">

          <div className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-3">
            Team Manager
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl px-4 py-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">

              <Briefcase size={18} />

            </div>

            <div>

              <p className="font-semibold dark:text-white">

                {
                  selectedTeam
                    .manager
                    .full_name
                }

              </p>

              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Manager
              </p>

            </div>

          </div>

        </div>

        {/* TEAM MEMBERS */}
        <div>

          <div className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-3">
            Team Members
          </div>

          <div className="flex flex-wrap gap-3">

            {selectedTeam.teamMembers.map(
              (member) => (

                <div
                  key={member.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700"
                >

                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">

                    <User2 size={16} />

                  </div>

                  <div>

                    <p className="font-medium text-sm dark:text-white">

                      {
                        member.full_name
                      }

                    </p>

                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Team Member
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </div>
    )}

  </div>
)}

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

           
            {/* TARGET DATE */}
            <div>

              <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

                <CalendarDays
                  size={16}
                  className="text-emerald-600"
                />

                Target Date

              </label>

              <input
                type="date"
                value={
                  newGoal.target_date ||
                  ""
                }
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    target_date:
                      e.target
                        .value,
                  })
                }
                className="w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
              />

            </div>

          </div>

          {/* PRIORITY */}
          <div>

            <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

              <Flag
                size={16}
                className="text-emerald-600"
              />

              Priority

            </label>

            <select
              value={
                newGoal.priority
              }
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  priority:
                    e.target
                      .value,
                })
              }
              className={`w-full h-14 px-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition font-semibold ${
                priorityStyles[
                  newGoal.priority
                ]
              }`}
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

          {/* INFO */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-5">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">

                <Briefcase
                  size={18}
                />

              </div>

              <div>

                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Smart Goal Planning
                </h4>

                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 leading-relaxed">
                  Create measurable,
                  trackable and
                  achievable goals for
                  individuals, teams or
                  the entire
                  organization.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex items-center justify-end gap-4">

          <button
            onClick={onClose}
            className="h-12 px-6 rounded-2xl border border-slate-200 dark:border-zinc-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={
              handleCreateGoal
            }
            disabled={saving}
            className="h-12 px-7 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition shadow-lg shadow-emerald-600/20"
          >
            {saving
              ? "Saving..."
              : "Create Goal"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateGoalModal;