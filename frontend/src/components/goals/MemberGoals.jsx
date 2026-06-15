import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { getGoals } from "../../services/goalsService";

import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Search,
  Trophy,
} from "lucide-react";

function MemberGoals() {
  const { profile } = useAuth();

  // GOALS
  const [goals, setGoals] =
    useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // FILTERS
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // FETCH GOALS
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const goalsData =
        await getGoals();

      // 🔥 ONLY MEMBER GOALS
      const memberGoals =
        goalsData.filter(
          (goal) =>
            goal.owner_id ===
            profile?.id
        );

      setGoals(memberGoals);
    } catch (error) {
      console.error(
        "MEMBER GOALS ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // FILTERED GOALS
  const filteredGoals = goals
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

  // STATS
  const completedGoals =
    goals.filter(
      (goal) =>
        goal.status ===
        "Completed"
    ).length;

  const activeGoals =
    goals.filter(
      (goal) =>
        goal.status ===
        "Active"
    ).length;

  const inProgressGoals =
    goals.filter(
      (goal) =>
        goal.status ===
        "In Progress"
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
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          My Goals
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Track your assigned goals,
          milestones, and achievements.
        </p>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* TOTAL */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                My Goals
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
                Active
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

        {/* AVG PROGRESS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Avg Progress
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">

                {filteredGoals.length > 0
                  ? Math.round(
                      filteredGoals.reduce(
                        (acc, goal) =>
                          acc +
                          goal.progress,
                        0
                      ) /
                        filteredGoals.length
                    )
                  : 0}
                %

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

              <Trophy className="text-purple-600" />

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

        {/* STATUS FILTER */}
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

      {/* GOALS */}
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
                  Status
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    goal.status ===
                    "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {goal.status}
                </span>

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

            {/* MILESTONES */}
            <div className="mt-6">

              <h3 className="font-semibold dark:text-white mb-3">
                Milestones
              </h3>

              <div className="space-y-3">

                {goal.milestones
                  ?.slice(0, 3)
                  .map(
                    (
                      milestone,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >

                        <div
                          className={`w-3 h-3 rounded-full ${
                            milestone.completed
                              ? "bg-emerald-500"
                              : "bg-slate-300 dark:bg-zinc-700"
                          }`}
                        />

                        <p className="text-sm dark:text-white">
                          {
                            milestone.title
                          }
                        </p>

                      </div>

                    )
                  )}

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
            No assigned goals available
            right now.
          </p>

        </div>

      )}

    </div>
  );
}

export default MemberGoals;