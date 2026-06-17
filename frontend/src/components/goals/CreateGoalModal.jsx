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
      ?.trim();

  /* ========================================
     AVAILABLE USERS
  ======================================== */

  const availableUsers =
    users?.filter((user) => {
      const role =
        user.role
          ?.toLowerCase()
          ?.trim();

      /*
        ADMIN
      */

      if (
        currentRole ===
        "admin"
      ) {
        return (
          role !== "admin"
        );
      }

      /*
        MANAGER
      */

      if (
        currentRole ===
        "manager"
      ) {
        return (
          role ===
            "member" &&
          String(
            user.manager_id
          ) ===
            String(
              profile?.id
            )
        );
      }

      /*
        MEMBER
      */

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
    });

  /* ========================================
     MANAGERS
  ======================================== */

  const managers =
    availableUsers?.filter(
      (user) =>
        user.role
          ?.toLowerCase()
          ?.trim() ===
        "manager"
    );

  /* ========================================
     MEMBERS
  ======================================== */

  const members =
    availableUsers?.filter(
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
  (managers || []).map(
    (manager) => {

      const teamMembers =
        users.filter(
          (user) =>
            String(
              user.manager_id
            ) ===
              String(
                manager.id
              ) &&
            user.role
              ?.toLowerCase()
              ?.trim() ===
              "member"
        );

      return {
        manager,
        teamMembers,
      };
    }
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

                  <option value="managers">
                    All Managers
                  </option>

                  <option value="members">
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
                "manager" && (
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
            <div>

              <label className="flex items-center gap-2 mb-3 text-sm font-semibold dark:text-white">

                <Users
                  size={16}
                  className="text-emerald-600"
                />

                Select Team

              </label>

              <select
                value={
                  newGoal.manager_id ||
                  ""
                }
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    manager_id:
                      e.target.value,
                  })
                }
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
                      {
                        team.manager
                          .full_name
                      }
                      's Team (
                      {
                        team
                          .teamMembers
                          .length
                      }{" "}
                      members)
                    </option>
                  )
                )}

              </select>

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