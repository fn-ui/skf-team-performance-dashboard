import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import PerformanceActionCenter from "./PerformanceActionCenter";

import {
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Award,
  Loader2,
  Briefcase,
  Target,
} from "lucide-react";

function AdminPerformance() {
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
          .select("*")
          .not(
            "role",
            "ilike",
            "%admin%"
          ),

        supabase
          .from("tasks")
          .select("*"),

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
        "PERFORMANCE ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  

  const managers =
    profiles.filter((user) => {

      const role =
        user.role
          ?.toLowerCase()
          .trim();

      return (
        role?.includes(
          "manager"
        )
      );
    });

  const members =
    profiles.filter((user) => {

      const role =
        user.role
          ?.toLowerCase()
          .trim();

      return (
        role &&
        !role.includes(
          "manager"
        ) &&
        role !== "admin"
      );
    });

  const managerPerformance =
    managers.map((manager) => {
      const managerProjects =
        projects.filter(
          (project) =>
            project.manager_id ===
            manager.id
        );

      const completedProjects =
        managerProjects.filter(
          (project) =>
            project.status ===
            "Completed"
        ).length;

      const activeProjects =
        managerProjects.filter(
          (project) =>
            project.status ===
            "Active"
        ).length;

      const totalProjects =
        managerProjects.length;

      const avgProgress =
        totalProjects === 0
          ? 0
          : Math.round(
              managerProjects.reduce(
                (acc, project) =>
                  acc +
                  (project.progress ||
                    0),
                0
              ) / totalProjects
            );

      const managedMembers =
        members.filter(
          (member) =>
            member.manager_id ===
            manager.id
        ).length;

      return {
        id: manager.id,

        manager:
          manager.full_name ||
          "Unknown Manager",

        totalProjects,

        completedProjects,

        activeProjects,

        managedMembers,

        productivity:
          avgProgress,
      };
    });


  const memberPerformance =
    members.map((member) => {
      const memberTasks =
        tasks.filter(
          (task) =>
            task.assignee_id ===
            member.id
        );

      const completedTasks =
        memberTasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;

      const pendingTasks =
        memberTasks.filter(
          (task) =>
            task.status ===
            "Pending"
        ).length;

      const inProgressTasks =
        memberTasks.filter(
          (task) =>
            task.status ===
            "In Progress"
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

      const manager =
        profiles.find(
          (profile) =>
            profile.id ===
            member.manager_id
        );

      return {
        id: member.id,

        member:
          member.full_name ||
          "Unknown Member",

        manager:
          manager?.full_name ||
          "Not Assigned",

        completedTasks,

        pendingTasks,

        inProgressTasks,

        totalTasks,

        productivity,

        attendance:
          totalTasks === 0
            ? 0
            : productivity >= 80
            ? 98
            : productivity >= 60
            ? 92
            : 85,
      };
    });


  const sortedManagers =
    [...managerPerformance].sort(
      (a, b) =>
        b.productivity -
        a.productivity
    );

  const sortedMembers =
    [...memberPerformance].sort(
      (a, b) =>
        b.productivity -
        a.productivity
    );


  const topManager =
    sortedManagers[0] || {
      manager: "No Manager",
      productivity: 0,
    };

  const topMember =
    sortedMembers[0] || {
      member: "No Member",
      productivity: 0,
    };


  const totalEmployees =
    profiles.length;

  const totalCompleted =
    memberPerformance.reduce(
      (acc, member) =>
        acc +
        member.completedTasks,
      0
    );

  const totalPending =
    memberPerformance.reduce(
      (acc, member) =>
        acc +
        member.pendingTasks,
      0
    );

  const averageProductivity =
    memberPerformance.length === 0
      ? 0
      : Math.round(
          memberPerformance.reduce(
            (acc, member) =>
              acc +
              member.productivity,
            0
          ) /
            memberPerformance.length
        );

  const productivityColor =
    (value) => {
      if (value >= 80)
        return "bg-emerald-500";

      if (value >= 60)
        return "bg-emerald-400";

      return "bg-amber-500";
    };


  if (loading) {
    return (
      <div className="flex items-center gap-3 p-5 text-emerald-600">
        <Loader2 className="animate-spin" />

        Loading performance...
      </div>
    );
  }

  return (
    <div className="space-y-6">


      <div>
        <h1 className="text-3xl font-bold dark:text-white">
          Performance Overview
        </h1>

        <p className="mt-2 text-slate-500 dark:text-zinc-400">
          Monitor manager leadership,
          project execution, and
          employee productivity.
        </p>
      </div>


      <PerformanceActionCenter roleMode="admin" tasks={tasks} projects={projects} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Employees
              </p>

              <h2 className="mt-3 text-3xl font-bold dark:text-white">
                {totalEmployees}
              </h2>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">
              <Users className="text-emerald-600" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Completed Tasks
              </p>

              <h2 className="mt-3 text-3xl font-bold dark:text-white">
                {totalCompleted}
              </h2>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">
              <CheckCircle className="text-emerald-600" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Pending Tasks
              </p>

              <h2 className="mt-3 text-3xl font-bold dark:text-white">
                {totalPending}
              </h2>

            </div>

            <div className="rounded-2xl bg-amber-100 p-4">
              <Clock className="text-amber-600" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Avg Productivity
              </p>

              <h2 className="mt-3 text-3xl font-bold dark:text-white">
                {averageProductivity}%
              </h2>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">
              <TrendingUp className="text-emerald-600" />
            </div>

          </div>

        </div>

      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


        <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-5 text-white shadow-xl">

          <div className="flex items-center gap-3">
            <Briefcase size={28} />

            <h2 className="text-2xl font-bold">
              Best Team Manager
            </h2>
          </div>

          <p className="mt-6 text-3xl font-bold">
            {topManager.manager}
          </p>

          <p className="mt-3 text-emerald-100">
            {topManager.productivity}%
            leadership score
          </p>

        </div>


        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 p-5 text-white shadow-xl">

          <div className="flex items-center gap-3">
            <Target size={28} />

            <h2 className="text-2xl font-bold">
              Best Performing Member
            </h2>
          </div>

          <p className="mt-6 text-3xl font-bold">
            {topMember.member}
          </p>

          <p className="mt-3 text-emerald-100">
            {topMember.productivity}%
            productivity score
          </p>

        </div>

      </div>


      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

        <div className="border-b border-slate-200 p-5 dark:border-zinc-800">

          <h2 className="text-2xl font-bold dark:text-white">
            Team Manager Rankings
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-emerald-50 dark:bg-zinc-800">

              <tr>

                <th className="p-5 text-left dark:text-white">
                  Manager
                </th>

                <th className="p-5 text-left dark:text-white">
                  Team Size
                </th>

                <th className="p-5 text-left dark:text-white">
                  Projects
                </th>

                <th className="p-5 text-left dark:text-white">
                  Completed
                </th>

                <th className="p-5 text-left dark:text-white">
                  Productivity
                </th>

              </tr>

            </thead>

            <tbody>

              {sortedManagers.map(
                (manager) => (

                  <tr
                    key={manager.id}
                    className="border-t border-slate-200 dark:border-zinc-800"
                  >

                    <td className="p-5 font-semibold dark:text-white">
                      {manager.manager}
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        manager.managedMembers
                      }
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        manager.totalProjects
                      }
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        manager.completedProjects
                      }
                    </td>

                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-zinc-700">

                          <div
                            className={`h-3 rounded-full ${productivityColor(
                              manager.productivity
                            )}`}
                            style={{
                              width: `${manager.productivity}%`,
                            }}
                          />

                        </div>

                        <span className="font-semibold dark:text-white">
                          {
                            manager.productivity
                          }
                          %
                        </span>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

        <div className="border-b border-slate-200 p-5 dark:border-zinc-800">

          <h2 className="text-2xl font-bold dark:text-white">
            Member Rankings
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-emerald-50 dark:bg-zinc-800">

              <tr>

                <th className="p-5 text-left dark:text-white">
                  Member
                </th>

                <th className="p-5 text-left dark:text-white">
                  Under Manager
                </th>

                <th className="p-5 text-left dark:text-white">
                  Completed
                </th>

                <th className="p-5 text-left dark:text-white">
                  Pending
                </th>

                <th className="p-5 text-left dark:text-white">
                  In Progress
                </th>

                <th className="p-5 text-left dark:text-white">
                  Productivity
                </th>

              </tr>

            </thead>

            <tbody>

              {sortedMembers.map(
                (member) => (

                  <tr
                    key={member.id}
                    className="border-t border-slate-200 dark:border-zinc-800"
                  >

                    <td className="p-5 font-semibold dark:text-white">
                      {member.member}
                    </td>

                    <td className="p-5 text-slate-500 dark:text-zinc-400">
                      {member.manager}
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

                    <td className="p-5 dark:text-white">
                      {
                        member.inProgressTasks
                      }
                    </td>

                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-zinc-700">

                          <div
                            className={`h-3 rounded-full ${productivityColor(
                              member.productivity
                            )}`}
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

export default AdminPerformance;
