import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import PerformanceActionCenter from "./PerformanceActionCenter";

import {
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  Loader2,
} from "lucide-react";

function ManagerPerformance() {
  const { profile } = useAuth();

  const [profiles, setProfiles] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        { data: users, error: usersError },

        { data: taskData, error: tasksError },

        {
          data: projectData,
          error: projectsError,
        },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*"),

        supabase
          .from("tasks")
          .select(`
            *,
            task_assignees (
              user_id
            )
          `),

        supabase
          .from("projects")
          .select("*"),
      ]);

      if (usersError)
        throw usersError;

      if (tasksError)
        throw tasksError;

      if (projectsError)
        throw projectsError;

      setProfiles(users || []);

      setTasks(taskData || []);

      setProjects(projectData || []);
    } catch (error) {
      console.error(
        "MANAGER PERFORMANCE ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };


  const managerProjects =
    projects.filter(
      (project) =>
        project.manager_id ===
        profile?.id
    );

  const managerProjectIds =
    managerProjects.map(
      (project) => project.id
    );


  const teamMembers =
    profiles.filter(
      (member) =>
        member.manager_id ===
        profile?.id
    );


  const teamPerformance =
    teamMembers.map((member) => {

      const memberTasks =
  tasks.filter((task) => {
    const assignees =
      task.task_assignees || [];

    return (
      managerProjectIds.includes(
        task.project_id
      ) &&
      assignees.some(
        (a) =>
          a.user_id === member.id
      )
    );
  });

      const completedTasks =
        memberTasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;

      const pendingTasks =
        memberTasks.filter(
          (task) =>
            task.status !==
            "Completed"
        ).length;

      const totalTasks =
        memberTasks.length;

      const productivity =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks /
                totalTasks) *
                100
            );

      return {
        id: member.id,

        member:
          member.full_name ||
          "Unknown Member",

        role:
          member.role ||
          "member",

        completedTasks,

        pendingTasks,

        productivity,

        attendance:
          totalTasks === 0
            ? 0
            : productivity >= 80
            ? 98
            : productivity >= 50
            ? 92
            : 85,
      };
    });


  const sortedPerformance =
    [...teamPerformance].sort(
      (a, b) =>
        b.productivity -
        a.productivity
    );


  const totalMembers =
    teamPerformance.length;

  const totalCompleted =
    teamPerformance.reduce(
      (acc, member) =>
        acc +
        member.completedTasks,
      0
    );

  const totalPending =
    teamPerformance.reduce(
      (acc, member) =>
        acc +
        member.pendingTasks,
      0
    );

  const averageProductivity =
    Math.round(
      teamPerformance.reduce(
        (acc, member) =>
          acc +
          member.productivity,
        0
      ) /
        (teamPerformance.length ||
          1)
    );


  const bestMember =
    sortedPerformance[0] || {
      member: "No Team Member",
      role: "N/A",
      productivity: 0,
    };


  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5">

        <div className="flex items-center gap-3 dark:text-white">

          <Loader2 className="animate-spin" />

          Loading team performance...

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Team Performance
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Monitor your team's
          productivity and
          performance.
        </p>

      </div>

      <PerformanceActionCenter roleMode="manager" tasks={tasks.filter((task) => managerProjectIds.includes(task.project_id))} projects={managerProjects} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Team Members
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalMembers}
              </h2>

            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">

              <Users
                size={24}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Team Productivity
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {averageProductivity}%
              </h2>

            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">

              <TrendingUp
                size={24}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3">

              <Award size={28} />

              <h2 className="text-2xl font-bold">
                Best Performing Member
              </h2>

            </div>

            <p className="mt-4 text-emerald-50 text-lg">
              {bestMember.member}
            </p>

            <p className="mt-2 text-emerald-100">
              {bestMember.role}
            </p>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {bestMember.productivity}%
            </h1>

            <p className="mt-2 text-emerald-100">
              Productivity Score
            </p>

          </div>

        </div>

      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-200 dark:border-zinc-800">

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

              {sortedPerformance.map(
                (member) => (

                  <tr
                    key={member.id}
                    className="border-t border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
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

                        <div className="w-32 bg-slate-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden">

                          <div
                            className="bg-emerald-500 h-3 rounded-full"
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
                      {
                        member.attendance
                      }
                      %
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ManagerPerformance;
