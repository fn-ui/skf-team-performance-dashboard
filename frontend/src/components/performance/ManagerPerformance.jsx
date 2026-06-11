import { useAuth } from "../../contexts/AuthContext";

import { performanceData } from "../../data/performanceData";

import {
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

function ManagerPerformance() {
  const { profile } = useAuth();

  // SIMULATED TEAM FILTER
  // Later Supabase will filter real team members
  const teamMembers = performanceData.filter(
    (member) =>
      member.member !== profile?.full_name
  );

  // STATS
  const totalMembers =
    teamMembers.length;

  const totalCompleted =
    teamMembers.reduce(
      (acc, member) =>
        acc + member.completedTasks,
      0
    );

  const totalPending =
    teamMembers.reduce(
      (acc, member) =>
        acc + member.pendingTasks,
      0
    );

  const averageProductivity = Math.round(
    teamMembers.reduce(
      (acc, member) =>
        acc + member.productivity,
      0
    ) / teamMembers.length
  );

  // BEST MEMBER
  const bestMember =
    teamMembers.reduce((prev, current) =>
      prev.productivity >
      current.productivity
        ? prev
        : current
    );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Team Performance
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Monitor your team's productivity and performance.
        </p>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TEAM MEMBERS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Team Members
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalMembers}
              </h2>

            </div>

            <div className="bg-blue-100 p-3 rounded-xl">

              <Users
                size={24}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* COMPLETED */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed Tasks
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalCompleted}
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
                {totalPending}
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
                Team Productivity
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {averageProductivity}%
              </h2>

            </div>

            <div className="bg-purple-100 p-3 rounded-xl">

              <TrendingUp
                size={24}
                className="text-purple-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* TOP MEMBER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="flex items-center gap-3">

              <Award size={28} />

              <h2 className="text-2xl font-bold">
                Best Performing Member
              </h2>

            </div>

            <p className="mt-4 text-blue-50 text-lg">
              {bestMember.member}
            </p>

            <p className="mt-2 text-blue-100">
              {bestMember.role}
            </p>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {bestMember.productivity}%
            </h1>

            <p className="mt-2 text-blue-100">
              Productivity Score
            </p>

          </div>

        </div>

      </div>

      {/* TEAM TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden">

        <div className="p-6 border-b border-slate-200 dark:border-zinc-800">

          <h2 className="text-2xl font-bold dark:text-white">
            Team Rankings
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 dark:bg-zinc-800">

              <tr>

                <th className="text-left p-5 dark:text-white">
                  Member
                </th>

                <th className="text-left p-5 dark:text-white">
                  Role
                </th>

                <th className="text-left p-5 dark:text-white">
                  Completed
                </th>

                <th className="text-left p-5 dark:text-white">
                  Pending
                </th>

                <th className="text-left p-5 dark:text-white">
                  Productivity
                </th>

                <th className="text-left p-5 dark:text-white">
                  Attendance
                </th>

              </tr>

            </thead>

            <tbody>

              {teamMembers.map((member) => (

                <tr
                  key={member.id}
                  className="border-t border-slate-200 dark:border-zinc-800"
                >

                  <td className="p-5 font-semibold dark:text-white">
                    {member.member}
                  </td>

                  <td className="p-5 text-slate-500 dark:text-zinc-400">
                    {member.role}
                  </td>

                  <td className="p-5 dark:text-white">
                    {member.completedTasks}
                  </td>

                  <td className="p-5 dark:text-white">
                    {member.pendingTasks}
                  </td>

                  <td className="p-5">

                    <div className="flex items-center gap-3">

                      <div className="w-32 bg-slate-200 dark:bg-zinc-700 rounded-full h-3">

                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{
                            width: `${member.productivity}%`,
                          }}
                        />

                      </div>

                      <span className="font-semibold dark:text-white">
                        {member.productivity}%
                      </span>

                    </div>

                  </td>

                  <td className="p-5 dark:text-white">
                    {member.attendance}%
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ManagerPerformance;