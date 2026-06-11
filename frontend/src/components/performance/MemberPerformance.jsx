import { useAuth } from "../../contexts/AuthContext";

import { performanceData } from "../../data/performanceData";

import {
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Award,
} from "lucide-react";

function MemberPerformance() {
  const { profile } = useAuth();

  // CURRENT USER PERFORMANCE
  const member =
    performanceData.find(
      (item) =>
        item.member ===
        profile?.full_name
    ) || performanceData[0];

  // PRODUCTIVITY COLOR
  const getProductivityColor = (
    productivity
  ) => {
    if (productivity >= 85)
      return "bg-emerald-500";

    if (productivity >= 70)
      return "bg-blue-500";

    return "bg-amber-500";
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          My Performance
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Track your productivity, attendance, and task completion progress.
        </p>

      </div>

      {/* PROFILE OVERVIEW */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <h2 className="text-3xl font-bold">
              {member.member}
            </h2>

            <p className="text-emerald-100 mt-3 text-lg">
              {member.role}
            </p>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {member.productivity}%
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
                {member.completedTasks}
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
                {member.pendingTasks}
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

        {/* PRODUCTIVITY */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Productivity
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {member.productivity}%
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
                {member.attendance}%
              </h2>

            </div>

            <div className="bg-purple-100 p-3 rounded-xl">

              <Calendar
                size={24}
                className="text-purple-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* PERFORMANCE BREAKDOWN */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* PRODUCTIVITY BAR */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold dark:text-white">
            Productivity Overview
          </h2>

          <div className="mt-8">

            <div className="flex items-center justify-between mb-3">

              <p className="text-slate-500 dark:text-zinc-400">
                Current Productivity
              </p>

              <p className="font-bold dark:text-white">
                {member.productivity}%
              </p>

            </div>

            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-4">

              <div
                className={`${getProductivityColor(
                  member.productivity
                )} h-4 rounded-full`}
                style={{
                  width: `${member.productivity}%`,
                }}
              />

            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div>

              <div className="flex items-center justify-between">

                <p className="text-slate-500 dark:text-zinc-400">
                  Completed Tasks
                </p>

                <p className="font-semibold dark:text-white">
                  {member.completedTasks}
                </p>

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between">

                <p className="text-slate-500 dark:text-zinc-400">
                  Pending Tasks
                </p>

                <p className="font-semibold dark:text-white">
                  {member.pendingTasks}
                </p>

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between">

                <p className="text-slate-500 dark:text-zinc-400">
                  Attendance Rate
                </p>

                <p className="font-semibold dark:text-white">
                  {member.attendance}%
                </p>

              </div>

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
              (score, index) => (

                <div key={index}>

                  <div className="flex items-center justify-between mb-2">

                    <p className="text-slate-500 dark:text-zinc-400">
                      Week {index + 1}
                    </p>

                    <p className="font-semibold dark:text-white">
                      {score}%
                    </p>

                  </div>

                  <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3">

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

          {member.productivity >= 85
            ? "Excellent work performance. You are consistently delivering high-quality results and maintaining strong productivity levels."
            : member.productivity >= 70
            ? "Good progress overall. Continue improving task completion speed and consistency to reach top performer level."
            : "Performance needs improvement. Focus on task completion, time management, and productivity optimization."}

        </p>

      </div>

    </div>
  );
}

export default MemberPerformance;