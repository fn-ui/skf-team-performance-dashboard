import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import {
  getGoals,
  createGoal,
  updateGoal,
} from "../../services/goalsService";

import { getProjects } from "../../services/projectsService";
import { getUsers }
  from "../../services/userService";

import CreateGoalModal from "./CreateGoalModal";

import {
  Target,
  Search,
  Plus,
  TrendingUp,
  CheckCircle2,
  Users,
  Clock3,
  
} from "lucide-react";

function ManagerGoals() {
  const { profile } = useAuth();

  // GOALS
  const [goalList, setGoalList] =
    useState([]);

  // PROJECTS
  const [projects, setProjects] =
    useState([]);
    //users
    const [users, setUsers] =
  useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // SEARCH/FILTERS
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // MODAL
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // NEW GOAL
  const [newGoal, setNewGoal] =
    useState({
      title: "",
      description: "",
      project_id: "",
      owner_id: profile?.id || "",
      goal_type: "Team",
      status: "Active",
      progress: 0,
      priority: "Medium",
      target_date: "",
      assignment_type:
      "individual",
    });

  // FETCH GOALS
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const goalsData =
        await getGoals();

      const projectsData =
        await getProjects();

        const usersData =
         await getUsers();

      // 🔥 MANAGER GOALS ONLY
      const managerGoals =
        goalsData.filter(
          (goal) =>
            goal.owner_id ===
            profile?.id
        );

      setGoalList(managerGoals);

      setProjects(projectsData);
      setUsers(usersData || []);
    } catch (error) {
      console.error(
        "MANAGER GOALS ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // FILTERED GOALS
  const filteredGoals = goalList
    .filter((goal) =>
      goal.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((goal) =>
      statusFilter === "All"
        ? true
        : goal.status === statusFilter
    );

 const handleCreateGoal =
  async () => {

    if (!newGoal.title)
      return;

    try {

      let goalsToCreate = [];

      /*
      =====================================
      BASE PAYLOAD
      =====================================
      */

      const basePayload = {
        title: newGoal.title,

        description:
          newGoal.description,

        project_id:
          newGoal.project_id ||
          null,

        progress: 0,

        priority:
          newGoal.priority,

        target_date:
          newGoal.target_date ||
          null,

        status: "Active",
      };

      /*
      =====================================
      INDIVIDUAL MEMBER
      =====================================
      */

      if (
        newGoal.assignment_type ===
        "individual"
      ) {

        goalsToCreate.push({
          ...basePayload,

          owner_id:
            newGoal.owner_id,
        });
      }

      /*
      =====================================
      ENTIRE TEAM
      =====================================
      */

      else if (
        newGoal.assignment_type ===
        "team"
      ) {

        /*
        TEAM MEMBERS
        */

        const teamMembers =
          users.filter(
            (user) =>
              String(
                user.manager_id
              ) ===
                String(
                  profile?.id
                ) &&

              user.role
                ?.toLowerCase()
                ?.trim() !==
                "team manager" &&

              user.role
                ?.toLowerCase()
                ?.trim() !==
                "admin"
          );

        /*
        INCLUDE MANAGER
        */

        goalsToCreate.push({
          ...basePayload,

          owner_id:
            profile?.id,

          assignment_type:
            "team",

          manager_id:
            profile?.id,
        });

        /*
        INCLUDE MEMBERS
        */

        teamMembers.forEach(
          (member) => {

            goalsToCreate.push({
              ...basePayload,

              owner_id:
                member.id,

              assignment_type:
                "team",

              manager_id:
                profile?.id,
            });
          }
        );
      }

      /*
      =====================================
      CREATE GOALS
      =====================================
      */

      const createdGoals =
        await Promise.all(
          goalsToCreate.map(
            (goal) =>
              createGoal(goal)
          )
        );

      /*
      =====================================
      UPDATE UI
      =====================================
      */

      setGoalList((prev) => [
        ...createdGoals,
        ...prev,
      ]);

      /*
      =====================================
      RESET
      =====================================
      */

      setNewGoal({
        title: "",
        description: "",
        project_id: "",
        owner_id:
          profile?.id || "",

        goal_type: "Team",

        status: "Active",

        progress: 0,

        priority: "Medium",

        target_date: "",

        assignment_type:
          "individual",
      });

      setIsModalOpen(false);

    } catch (error) {

      console.error(
        "CREATE GOAL ERROR:",
        error.message
      );
    }
  };

  // UPDATE GOAL PROGRESS
  const handleUpdateProgress =
    async (
      goalId,
      progress
    ) => {
      try {
        const updatedGoal =
          await updateGoal(
            goalId,
            {
              progress,
            }
          );

        setGoalList(
          goalList.map((goal) =>
            goal.id === goalId
              ? updatedGoal
              : goal
          )
        );
      } catch (error) {
        console.error(
          "UPDATE PROGRESS ERROR:",
          error.message
        );
      }
    };

  // STATS
  const completedGoals =
    goalList.filter(
      (goal) =>
        goal.status ===
        "Completed"
    ).length;

  const activeGoals =
    goalList.filter(
      (goal) =>
        goal.status ===
        "Active"
    ).length;

  const inProgressGoals =
    goalList.filter(
      (goal) =>
       goal.status === "Active"
    ).length;

  // PRIORITY COLORS
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

  // LOADING
  if (loading) {
    return (
      <div className="p-10 dark:text-white">
        Loading goals...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Team Goals
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage and track your team
            goals and objectives.
          </p>

        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition"
        >

          <Plus size={18} />

          Create Goal

        </button>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* TOTAL */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Goals
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {filteredGoals.length}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <Target className="text-emerald-600" />

            </div>

          </div>

        </div>

        {/* COMPLETED */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">

                {
                  filteredGoals.filter(
                    (goal) =>
                      goal.status ===
                      "Completed"
                  ).length
                }

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <CheckCircle2 className="text-blue-600" />

            </div>

          </div>

        </div>

        {/* ACTIVE */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Active Goals
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">

                {
                  filteredGoals.filter(
                    (goal) =>
                      goal.status === "Active"
                  ).length
                }

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">

              <TrendingUp className="text-amber-600" />

            </div>

          </div>

        </div>

        {/* TEAM MEMBERS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Assigned Members
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">

                {
                  new Set(
                    filteredGoals.map(
                      (goal) =>
                        goal.owner_id
                    )
                  ).size
                }

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

              <Users className="text-purple-600" />

            </div>

          </div>

        </div>

      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* SEARCH */}
        <div className="lg:col-span-3 relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search goals..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
          />

        </div>

        {/* FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >

          <option>All</option>

          <option>
            In Progress
          </option>

          <option>
            Completed
          </option>

        </select>

      </div>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredGoals.map((goal) => (

          <div
            key={goal.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-xl font-bold dark:text-white">
                  {goal.title}
                </h2>

                <p className="text-slate-500 dark:text-zinc-400 mt-2">
                  {goal.description}
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                  goal.priority
                )}`}
              >
                {goal.priority}
              </span>

            </div>

            {/* PROGRESS */}
            <div className="mt-6">

              <div className="flex items-center justify-between mb-2">

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Progress
                </p>

                <p className="font-semibold dark:text-white">
                  {goal.progress}%
                </p>

              </div>

              <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3">

                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${goal.progress}%`,
                  }}
                />

              </div>

            </div>

        {/* DETAILS */}
<div className="space-y-3 mt-6">

  <div className="flex items-center justify-between">

    <p className="text-slate-500 dark:text-zinc-400">
      Assigned To
    </p>

    <p className="font-semibold dark:text-white">
      {goal.profiles?.full_name ||
        "Unassigned"}
    </p>

  </div>

  <div className="flex items-center justify-between">

    <p className="text-slate-500 dark:text-zinc-400">
      Target Date
    </p>

    <div className="flex items-center gap-2">

      <Clock3
        size={16}
        className="text-slate-400"
      />

      <p className="font-semibold dark:text-white">
        {goal.target_date ||
          "No Date"}
      </p>

    </div>

  </div>

</div>

          </div>

        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredGoals.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">

          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">

            <Target
              size={36}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">
            No Goals Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No goals match your current
            filters.
          </p>

        </div>

      )}

      {/* MODAL */}
      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        handleCreateGoal={
          handleCreateGoal
        }
         users={users}
      />

    </div>
  );
}

export default ManagerGoals;