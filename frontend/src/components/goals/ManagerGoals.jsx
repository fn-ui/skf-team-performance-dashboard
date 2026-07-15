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
import GoalDetailsModal from "./GoalDetailsModal";

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

  const [goalList, setGoalList] =
    useState([]);

  const [projects, setProjects] =
    useState([]);
    const [users, setUsers] =
  useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedGoal, setSelectedGoal] = useState(null);

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


      else if (
        newGoal.assignment_type ===
        "team"
      ) {


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


        goalsToCreate.push({
          ...basePayload,

          owner_id:
            profile?.id,

          assignment_type:
            "team",

          manager_id:
            profile?.id,
        });


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


      const createdGoals =
        await Promise.all(
          goalsToCreate.map(
            (goal) =>
              createGoal(goal)
          )
        );


      setGoalList((prev) => [
        ...createdGoals,
        ...prev,
      ]);


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

  if (loading) {
    return (
      <div className="p-5 dark:text-white">
        Loading goals...
      </div>
    );
  }

  return (
    <div className="space-y-6">

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">

        {filteredGoals.map((goal) => (

          <div
            key={goal.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5"
          >

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

            <button onClick={() => setSelectedGoal(goal)} className="mt-4 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
              Manage measurable outcomes
            </button>

          </div>

        ))}

      </div>

      {filteredGoals.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 text-center">

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

      <GoalDetailsModal isOpen={Boolean(selectedGoal)} onClose={() => setSelectedGoal(null)} goal={selectedGoal} roleMode="manager" />

    </div>
  );
}

export default ManagerGoals;
