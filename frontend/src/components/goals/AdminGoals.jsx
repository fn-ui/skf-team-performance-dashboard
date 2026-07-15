import { useEffect, useState } from "react";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../../services/goalsService";

import { getProjects } from "../../services/projectsService";
import { getUsers } from "../../services/userService";

import CreateGoalModal from "./CreateGoalModal";
import EditGoalModal from "./EditGoalModal";
import GoalDetailsModal from "./GoalDetailsModal";

import {
  Target,
  Search,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Trash2,
} from "lucide-react";

function AdminGoals() {

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

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [selectedGoal, setSelectedGoal] =
    useState(null);

  const [newGoal, setNewGoal] =
    useState({
      title: "",
      description: "",
      project_id: "",
      owner_id: "",
      department: "",
      progress: 0,
      priority: "Medium",
      target_date: "",

       assignment_type:
        "individual",

       manager_id: "",

    team_member_ids: [],
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

      setGoalList(goalsData || []);

      setProjects(projectsData || []);

      setUsers(usersData || []);

    } catch (error) {

      console.error(
        "GOALS FETCH ERROR:",
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
        .includes(
          search.toLowerCase()
        )
    )
    .filter((goal) =>
      statusFilter === "All"
        ? true
        : goal.status ===
          statusFilter
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

        department:
          newGoal.department ||
          null,

        progress:
          newGoal.progress || 0,

        priority:
          newGoal.priority,

        target_date:
          newGoal.target_date ||
          null,
      };


      if (
        newGoal.assignment_type ===
        "individual"
      ) {

        goalsToCreate.push({
          ...basePayload,

          owner_id:
            newGoal.owner_id ||
            null,
        });
      }


      else if (
        newGoal.assignment_type ===
        "all_managers"
      ) {

        const managers =
          users.filter(
            (user) =>
              user.role
                ?.toLowerCase()
                ?.trim() ===
              "team manager"
          );

        managers.forEach(
          (manager) => {

            goalsToCreate.push({
              ...basePayload,

              owner_id:
                manager.id,
            });
          }
        );
      }


      else if (
        newGoal.assignment_type ===
        "all_members"
      ) {

        const members =
          users.filter(
            (user) =>
              user.role
                ?.toLowerCase()
                ?.trim() ===
              "member"
          );

        members.forEach(
          (member) => {

            goalsToCreate.push({
              ...basePayload,

              owner_id:
                member.id,
            });
          }
        );
      }


      else if (
        newGoal.assignment_type ===
        "all"
      ) {

        const everyone =
          users.filter(
            (user) =>
              user.role
                ?.toLowerCase()
                ?.trim() !==
              "admin"
          );

        everyone.forEach(
          (user) => {

            goalsToCreate.push({
              ...basePayload,

              owner_id:
                user.id,
            });
          }
        );
      }

    

else if (
  newGoal.assignment_type ===
  "specific_team"
) {

  const selectedManager =
    users.find(
      (user) =>
        String(user.id) ===
        String(
          newGoal.manager_id
        )
    );

  const teamMembers =
    users.filter(
      (user) =>
        String(
          user.manager_id
        ) ===
          String(
            newGoal.manager_id
          ) &&
        user.role
          ?.toLowerCase()
          ?.trim() ===
          "member"
    );


  if (selectedManager) {

    goalsToCreate.push({
      ...basePayload,

      owner_id:
        selectedManager.id,

      assignment_type:
        "specific_team",

      manager_id:
        selectedManager.id,
    });
  }


  teamMembers.forEach(
    (member) => {

      goalsToCreate.push({
        ...basePayload,

        owner_id:
          member.id,

        assignment_type:
          "specific_team",

        manager_id:
          newGoal.manager_id,
      });
    }
  );
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
          ?.trim() ===
          "member"
    );


  goalsToCreate.push({
    ...basePayload,

    owner_id:
      profile?.id,

    assignment_type:
      "team",

    team_manager_id:
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

        team_manager_id:
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
        owner_id: "",
        department: "",
        progress: 0,
        priority: "Medium",
        target_date: "",

        assignment_type:
          "individual",

         manager_id: "",

         team_member_ids: [],
      });

      setIsModalOpen(false);

    } catch (error) {

      console.error(
        "CREATE GOAL ERROR:",
        error.message
      );
    }
  };

  const handleOpenDetails = (
    goal
  ) => {

    setSelectedGoal(goal);

    setIsDetailsOpen(true);

  };

  const handleEditGoal = (
    goal
  ) => {

    setSelectedGoal({
      ...goal,
      owner_id:
        goal.owner_id || "",
    });

    setIsEditOpen(true);

  };

  const handleUpdateGoal =
  async () => {

    try {

      const payload = {
        title:
          selectedGoal.title,

        description:
          selectedGoal.description,

        project_id:
          selectedGoal.project_id || null,

        owner_id:
          selectedGoal.owner_id || null,

        progress:
          selectedGoal.progress,

        priority:
          selectedGoal.priority,

        target_date:
          selectedGoal.target_date || null,
      };

      const updatedGoal =
        await updateGoal(
          selectedGoal.id,
          payload
        );

      setGoalList(
        goalList.map((goal) =>
          goal.id === updatedGoal.id
            ? updatedGoal
            : goal
        )
      );

      setIsEditOpen(false);

    } catch (error) {

      console.error(
        "UPDATE GOAL ERROR:",
        error.message
      );

    }
  };

  const handleDeleteGoal =
    async (id) => {

      try {

        await deleteGoal(id);

        setGoalList(
          goalList.filter(
            (goal) =>
              goal.id !== id
          )
        );

      } catch (error) {

        console.error(
          "DELETE GOAL ERROR:",
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
        goal.status ===
        "In Progress"
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
            Company Goals
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Create and monitor all
            organizational goals.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
                      goal.status ===
                      "In Progress"
                  ).length
                }

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">

              <TrendingUp className="text-amber-600" />

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
                  {goal.profiles?.full_name || "Unassigned"}
                </p>

              </div>

              <div className="flex items-center justify-between">

                <p className="text-slate-500 dark:text-zinc-400">
                  Department
                </p>

                <p className="font-semibold dark:text-white">
                  {goal.department}
                </p>

              </div>

              <div className="flex items-center justify-between">

                <p className="text-slate-500 dark:text-zinc-400">
                  Deadline
                </p>

                <div className="flex items-center gap-2">

                  <Clock3
                    size={16}
                    className="text-slate-400"
                  />

                  <p className="font-semibold dark:text-white">
                    {goal.target_date || "No Date"}
                  </p>

                </div>

              </div>

            </div>

           <div className="mt-6 flex items-center justify-between">

              <p className="text-slate-500 dark:text-zinc-400">
                Project
              </p>

              <p className="font-semibold dark:text-white">
                {goal.projects?.name || "No Project"}
              </p>

            </div>
            <div className="flex items-center gap-3 mt-6">

                <button
                    onClick={() => {
                    setSelectedGoal(goal);
                    setIsDetailsOpen(true);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition"
                >
                    View
                </button>

                <button
                    onClick={() => {
                    setSelectedGoal(goal);
                    setIsEditOpen(true);
                    }}
                    className="flex-1 border border-slate-200 dark:border-zinc-800 py-3 rounded-xl dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                >
                    Edit
                </button>
                <button
                    onClick={() =>
                    handleDeleteGoal(goal.id)
                    }
                    className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                >

                    <Trash2 size={18} />

                </button>

                </div>

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
          handleCreateGoal={handleCreateGoal}
          users={users}
          saving={loading}
        />

<EditGoalModal
  isOpen={isEditOpen}
  onClose={() =>
    setIsEditOpen(false)
  }
  selectedGoal={selectedGoal}
  setSelectedGoal={setSelectedGoal}
  handleUpdateGoal={handleUpdateGoal}
  projects={projects}
  users={users}
  roleMode="admin"
/>

      <GoalDetailsModal
  isOpen={isDetailsOpen}
  onClose={() =>
    setIsDetailsOpen(false)
  }
        goal={selectedGoal}
        roleMode="admin"
/>

    </div>
  );
}

export default AdminGoals;
