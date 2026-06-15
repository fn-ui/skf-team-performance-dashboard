import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTasks } from "../../services/tasksService";

import {
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Award,
  Loader2,
} from "lucide-react";

function MemberPerformance() {
  const { profile } = useAuth();

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= LOAD TASKS ================= */

  useEffect(() => {
    if (profile?.id) {
      loadTasks();
    }
  }, [profile]);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const data =
        await getTasks();

      setTasks(data || []);
    } catch (error) {
      console.error(
        "TASK FETCH ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= MEMBER TASKS ================= */

  const memberTasks =
    tasks.filter((task) => {
      const assignees =
        task?.task_assignees ||
        [];

      return assignees.some(
        (a) =>
          a?.user_id ===
          profile?.id
      );
    });

  /* ================= STATS ================= */

  const completed =
    memberTasks.filter(
      (t) =>
        t.status ===
        "Completed"
    ).length;

  const pending =
    memberTasks.filter(
      (t) =>
        t.status === "Pending"
    ).length;

  const inProgress =
    memberTasks.filter(
      (t) =>
        t.status ===
        "In Progress"
    ).length;

  const total =
    memberTasks.length;

  const productivity =
    total === 0
      ? 0
      : Math.round(
          (completed / total) *
            100
        );

  const attendance =
    productivity >= 80
      ? 98
      : productivity >= 60
      ? 92
      : 85;

  /* ================= MEMBER DATA ================= */

  const member = {
    member:
      profile?.full_name ||
      "Member",

    role:
      profile?.role || "Member",

    completedTasks:
      completed,

    pendingTasks: pending,

    inProgressTasks:
      inProgress,

    productivity,

    attendance,

    weeklyPerformance: [
      Math.max(
        productivity - 20,
        20
      ),

      Math.max(
        productivity - 10,
        30
      ),

      Math.max(
        productivity - 5,
        40
      ),

      productivity,
    ],
  };

  /* ================= COLORS ================= */

  const getProductivityColor =
    (value) => {
      if (value >= 85)
        return "bg-emerald-500";

      if (value >= 70)
        return "bg-emerald-400";

      return "bg-amber-500";
    };

  /* ================= LABEL ================= */

  const getPerformanceLabel =
    (value) => {
      if (value >= 85)
        return "Excellent";

      if (value >= 70)
        return "Good";

      if (value >= 50)
        return "Average";

      return "Needs Improvement";
    };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

        <div className="flex items-center gap-3 dark:text-white">

          <Loader2 className="animate-spin" />

          Loading performance...

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          My Performance
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Track your
          productivity,
          attendance, and task
          completion progress.
        </p>

      </div>

      {/* PROFILE OVERVIEW */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <h2 className="text-3xl font-bold">
              {member.member}
            </h2>

            <p className="text-emerald-100 mt-3 text-lg capitalize">
              {member.role}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl">

              <Award size={18} />

              <span className="font-medium">
                {getPerformanceLabel(
                  member.productivity
                )}
              </span>

            </div>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {
                member.productivity
              }
              %
            </h1>

            <p className="text-emerald-100 mt-2">
              Productivity Score
            </p>

          </div>

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* COMPLETED */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed Tasks
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {
                  member.completedTasks
                }
              </h2>

            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">

              <CheckCircle
                size={24}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

        {/* PENDING */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Pending Tasks
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {
                  member.pendingTasks
                }
              </h2>

            </div>

            <div className="bg-amber-100 p-3 rounded-xl">

              <Clock
                size={24}
                className="text-amber-600"
              />

            </div>

          </div>

        </div>

        {/* IN PROGRESS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                In Progress
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {
                  member.inProgressTasks
                }
              </h2>

            </div>

            <div className="bg-blue-100 p-3 rounded-xl">

              <TrendingUp
                size={24}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* ATTENDANCE */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Attendance
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {
                  member.attendance
                }
                %
              </h2>

            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">

              <Calendar
                size={24}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* PERFORMANCE SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* PRODUCTIVITY */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold dark:text-white">
            Productivity
            Overview
          </h2>

          <div className="mt-8">

            <div className="flex items-center justify-between mb-3">

              <p className="text-slate-500 dark:text-zinc-400">
                Current
                Productivity
              </p>

              <p className="font-bold dark:text-white">
                {
                  member.productivity
                }
                %
              </p>

            </div>

            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">

              <div
                className={`${getProductivityColor(
                  member.productivity
                )} h-4 rounded-full transition-all duration-500`}
                style={{
                  width: `${member.productivity}%`,
                }}
              />

            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center justify-between">

              <p className="text-slate-500 dark:text-zinc-400">
                Completed
                Tasks
              </p>

              <p className="font-semibold dark:text-white">
                {
                  member.completedTasks
                }
              </p>

            </div>

            <div className="flex items-center justify-between">

              <p className="text-slate-500 dark:text-zinc-400">
                Pending Tasks
              </p>

              <p className="font-semibold dark:text-white">
                {
                  member.pendingTasks
                }
              </p>

            </div>

            <div className="flex items-center justify-between">

              <p className="text-slate-500 dark:text-zinc-400">
                In Progress
              </p>

              <p className="font-semibold dark:text-white">
                {
                  member.inProgressTasks
                }
              </p>

            </div>

          </div>

        </div>

        {/* WEEKLY PERFORMANCE */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center gap-3">

            <Award
              size={24}
              className="text-emerald-600"
            />

            <h2 className="text-2xl font-bold dark:text-white">
              Weekly Progress
            </h2>

          </div>

          <div className="mt-8 space-y-5">

            {member.weeklyPerformance.map(
              (
                score,
                index
              ) => (

                <div
                  key={index}
                >

                  <div className="flex items-center justify-between mb-2">

                    <p className="text-slate-500 dark:text-zinc-400">
                      Week{" "}
                      {index + 1}
                    </p>

                    <p className="font-semibold dark:text-white">
                      {score}%
                    </p>

                  </div>

                  <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">

                    <div
                      className="bg-emerald-500 h-3 rounded-full"
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      {/* PERFORMANCE MESSAGE */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

        <h2 className="text-2xl font-bold dark:text-white">
          Performance Summary
        </h2>

        <p className="text-slate-500 dark:text-zinc-400 mt-5 leading-relaxed text-lg">

          {member.productivity >=
          85
            ? "Excellent work performance. You are consistently delivering high-quality results and maintaining strong productivity levels."
            : member.productivity >=
              70
            ? "Good progress overall. Continue improving task completion speed and consistency to reach top performer level."
            : "Performance needs improvement. Focus on task completion, time management, and productivity optimization."}

        </p>

      </div>

    </div>
  );
}

export default MemberPerformance;