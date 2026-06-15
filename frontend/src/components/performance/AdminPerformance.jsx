import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import {
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Award,
  Loader2,
} from "lucide-react";

function AdminPerformance() {
  const [profiles, setProfiles] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= LOAD REAL DATA ================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        { data: users, error: usersError },

        { data: taskData, error: tasksError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            email,
            role
          `)
          .neq("role", "admin"),

        supabase
          .from("tasks")
          .select("*"),
      ]);

      if (usersError)
        throw usersError;

      if (tasksError)
        throw tasksError;

      setProfiles(users || []);

      setTasks(taskData || []);
    } catch (error) {
      console.error(
        "PERFORMANCE ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= BUILD PERFORMANCE ================= */

  const performanceData =
    profiles.map((user) => {
      const userTasks =
        tasks.filter((task) => {
          return (
            task.assignee ===
              user.full_name ||
            task.assigned_to_email ===
              user.email ||
            task.assigned_to ===
              user.id ||
            task.owner_id === user.id
          );
        });

      const completedTasks =
        userTasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;

      const pendingTasks =
        userTasks.filter(
          (task) =>
            task.status !==
            "Completed"
        ).length;

      const totalTasks =
        userTasks.length;

      const productivity =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks /
                totalTasks) *
                100
            );

      return {
        id: user.id,

        member:
          user.full_name ||
          "Unknown User",

        role:
          user.role || "member",

        completedTasks,

        pendingTasks,

        productivity,

        attendance:
          totalTasks === 0
            ? 0
            : 100,
      };
    });

  /* ================= SORT ================= */

  const sortedPerformance =
    [...performanceData].sort(
      (a, b) =>
        b.productivity -
        a.productivity
    );

  /* ================= STATS ================= */

  const totalEmployees =
    performanceData.length;

  const totalCompleted =
    performanceData.reduce(
      (acc, member) =>
        acc +
        member.completedTasks,
      0
    );

  const totalPending =
    performanceData.reduce(
      (acc, member) =>
        acc +
        member.pendingTasks,
      0
    );

  const averageProductivity =
    performanceData.length === 0
      ? 0
      : Math.round(
          performanceData.reduce(
            (acc, member) =>
              acc +
              member.productivity,
            0
          ) /
            performanceData.length
        );

  /* ================= TOP PERFORMER ================= */

  const topPerformer =
    sortedPerformance[0] || {
      member: "No Data",
      role: "-",
      productivity: 0,
    };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-10 dark:text-white">
        <Loader2 className="animate-spin" />

        Loading performance data...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Performance Overview
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Monitor employee productivity
          and task completion in real
          time.
        </p>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* EMPLOYEES */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Employees
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalEmployees}
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
                Avg Productivity
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

      {/* TOP PERFORMER */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="flex items-center gap-3">

              <Award size={28} />

              <h2 className="text-2xl font-bold">
                Top Performer
              </h2>

            </div>

            <p className="mt-4 text-emerald-50 text-lg font-semibold">
              {topPerformer.member}
            </p>

            <p className="mt-2 text-emerald-100 capitalize">
              {topPerformer.role}
            </p>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {
                topPerformer.productivity
              }
              %
            </h1>

            <p className="mt-2 text-emerald-100">
              Productivity Score
            </p>

          </div>

        </div>

      </div>

      {/* TABLE */}
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
                  Employee
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

              {sortedPerformance.map(
                (member) => (

                  <tr
                    key={member.id}
                    className="border-t border-slate-200 dark:border-zinc-800"
                  >

                    <td className="p-5 font-semibold dark:text-white">
                      {member.member}
                    </td>

                    <td className="p-5 text-slate-500 dark:text-zinc-400 capitalize">
                      {member.role}
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        member.completedTasks
                      }
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        member.pendingTasks
                      }
                    </td>

                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        <div className="w-32 bg-slate-200 dark:bg-zinc-700 rounded-full h-3">

                          <div
                            className="bg-emerald-500 h-3 rounded-full transition-all"
                            style={{
                              width: `${member.productivity}%`,
                            }}
                          />

                        </div>

                        <span className="font-semibold dark:text-white">
                          {
                            member.productivity
                          }
                          %
                        </span>

                      </div>

                    </td>

                    <td className="p-5 dark:text-white">
                      {member.attendance}
                      %
                    </td>

                  </tr>

                )
              )}

              {sortedPerformance.length ===
                0 && (
                <tr>

                  <td
                    colSpan="6"
                    className="p-10 text-center text-slate-500 dark:text-zinc-400"
                  >
                    No performance data
                    available.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminPerformance;