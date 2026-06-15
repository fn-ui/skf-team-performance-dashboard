import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { getAdminReportStats } from "../../services/reportsService";

import GenerateReportModal from "./GenerateReportModal";

import {
  FileText,
  Download,
  Search,
  Plus,
  BarChart3,
  CheckCircle,
  Clock,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";

function ManagerReports() {
  const { profile } = useAuth();

  const [loading, setLoading] =
    useState(true);

  // 🔥 REAL DATA
  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  // 🔍 FILTERS
  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");

  // 🔥 MODAL
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // 🔥 REPORTS
  const [reportList, setReportList] =
    useState([]);

  // 🔥 NEW REPORT
  const [newReport, setNewReport] =
    useState({
      title: "",
      category: "Performance",
      project: "",
      generatedBy:
        profile?.full_name ||
        "Team Manager",
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "Completed",
      type: "PDF",
    });

  /* ================= LOAD REPORTS ================= */

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const data =
        await getAdminReportStats();

      const allTasks =
        data?.tasks || [];

      const allProjects =
        data?.projects || [];

      const allUsers =
        data?.users || [];

      // 🔥 FILTER TEAM MEMBERS
      const teamUsers =
        allUsers.filter(
          (user) =>
            user.manager_id ===
              profile?.id ||
            user.role === "member"
        );

      const teamEmails =
        teamUsers.map(
          (user) => user.email
        );

      const teamNames =
        teamUsers.map(
          (user) =>
            user.full_name
        );

      // 🔥 FILTER TEAM TASKS
      const teamTasks =
        allTasks.filter(
          (task) =>
            teamEmails.includes(
              task.assigned_to_email
            ) ||
            teamNames.includes(
              task.assignee
            )
        );

      // 🔥 FILTER PROJECTS
      const teamProjects =
        allProjects.filter(
          (project) =>
            project.manager_id ===
              profile?.id ||
            project.manager ===
              profile?.full_name
        );

      setTasks(teamTasks);

      setProjects(teamProjects);

      setUsers(teamUsers);

      // 📊 STATS
      const completedTasks =
        teamTasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;

      const pendingTasks =
        teamTasks.filter(
          (task) =>
            task.status !==
            "Completed"
        ).length;

      const productivity =
        teamTasks.length === 0
          ? 0
          : Math.round(
              (completedTasks /
                teamTasks.length) *
                100
            );

      // 🔥 AUTO GENERATED REPORTS
      const generatedReports = [
        {
          id: 1,
          title:
            "Team Productivity Report",
          category:
            "Performance",
          project:
            "All Team Projects",
          generatedBy:
            profile?.full_name ||
            "Team Manager",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status:
            productivity >= 70
              ? "Completed"
              : "Pending",
          type: "PDF",
          metric:
            productivity +
            "% Productivity",
        },

        {
          id: 2,
          title:
            "Tasks Progress Report",
          category: "Tasks",
          project:
            "Team Tasks",
          generatedBy:
            profile?.full_name ||
            "Team Manager",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Completed",
          type: "Excel",
          metric:
            completedTasks +
            " Completed Tasks",
        },

        {
          id: 3,
          title:
            "Pending Tasks Analysis",
          category: "Tasks",
          project:
            "Team Tasks",
          generatedBy:
            profile?.full_name ||
            "Team Manager",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status:
            pendingTasks > 0
              ? "Pending"
              : "Completed",
          type: "PDF",
          metric:
            pendingTasks +
            " Pending Tasks",
        },

        {
          id: 4,
          title:
            "Projects Overview",
          category:
            "Projects",
          project:
            "Assigned Projects",
          generatedBy:
            profile?.full_name ||
            "Team Manager",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Completed",
          type: "PDF",
          metric:
            teamProjects.length +
            " Projects",
        },
      ];

      setReportList(
        generatedReports
      );
    } catch (error) {
      console.error(
        "REPORT ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER REPORTS ================= */

  const filteredReports =
    reportList
      .filter((report) =>
        report.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )
      .filter((report) =>
        categoryFilter ===
        "All"
          ? true
          : report.category ===
            categoryFilter
      );

  /* ================= STATS ================= */

  const totalReports =
    filteredReports.length;

  const completedReports =
    filteredReports.filter(
      (report) =>
        report.status ===
        "Completed"
    ).length;

  const pendingReports =
    filteredReports.filter(
      (report) =>
        report.status ===
        "Pending"
    ).length;

  const totalProjects =
    projects.length;

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const productivity =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  /* ================= TOP MEMBER ================= */

  const topMember = useMemo(() => {
    const stats = users.map(
      (user) => {
        const userTasks =
          tasks.filter(
            (task) =>
              task.assignee ===
                user.full_name ||
              task.assigned_to_email ===
                user.email
          );

        const completed =
          userTasks.filter(
            (task) =>
              task.status ===
              "Completed"
          ).length;

        const score =
          userTasks.length === 0
            ? 0
            : Math.round(
                (completed /
                  userTasks.length) *
                  100
              );

        return {
          name:
            user.full_name,
          score,
        };
      }
    );

    return stats.reduce(
      (prev, current) =>
        prev.score >
        current.score
          ? prev
          : current,
      {
        name: "No Data",
        score: 0,
      }
    );
  }, [tasks, users]);

  /* ================= GENERATE REPORT ================= */

  const handleGenerateReport =
    () => {
      if (
        !newReport.title ||
        !newReport.project
      )
        return;

      const report = {
        id: Date.now(),
        ...newReport,
        metric:
          productivity +
          "% Productivity",
      };

      setReportList((prev) => [
        report,
        ...prev,
      ]);

      setNewReport({
        title: "",
        category:
          "Performance",
        project: "",
        generatedBy:
          profile?.full_name ||
          "Team Manager",
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: "Completed",
        type: "PDF",
      });

      setIsModalOpen(false);
    };

  /* ================= DOWNLOAD ================= */

  const handleDownload = (
    report
  ) => {
    console.log(
      `Downloading ${report.title}`
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-10 dark:text-white">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Team Reports
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Monitor team
            productivity, project
            progress, and task
            analytics.
          </p>

        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition"
        >

          <Plus size={18} />

          Generate Report

        </button>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* REPORTS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Reports
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalReports}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <FileText className="text-emerald-600" />

            </div>

          </div>

        </div>

        {/* PROJECTS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Projects
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalProjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <FolderKanban className="text-emerald-600" />

            </div>

          </div>

        </div>

        {/* TEAM MEMBERS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Team Members
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {users.length}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <Users className="text-emerald-600" />

            </div>

          </div>

        </div>

        {/* PRODUCTIVITY */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Productivity
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {productivity}%
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <TrendingUp className="text-emerald-600" />

            </div>

          </div>

        </div>

      </div>

      {/* TOP MEMBER */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="flex items-center gap-3">

              <BarChart3 size={28} />

              <h2 className="text-2xl font-bold">
                Best Team Member
              </h2>

            </div>

            <p className="mt-4 text-lg">
              {topMember.name}
            </p>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {topMember.score}%
            </h1>

            <p className="mt-2 text-emerald-100">
              Productivity Score
            </p>

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
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
          />

        </div>

        {/* CATEGORY */}
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >

          <option>
            All
          </option>

          <option>
            Performance
          </option>

          <option>
            Projects
          </option>

          <option>
            Tasks
          </option>

        </select>

      </div>

      {/* REPORTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredReports.map(
          (report) => (

            <div
              key={report.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    {
                      report.title
                    }
                  </h2>

                  <p className="text-slate-500 dark:text-zinc-400 mt-2">
                    {
                      report.project
                    }
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status ===
                    "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >

                  {
                    report.status
                  }

                </span>

              </div>

              {/* DETAILS */}
              <div className="space-y-4 mt-6">

                <div className="flex items-center justify-between">

                  <p className="text-slate-500 dark:text-zinc-400">
                    Category
                  </p>

                  <p className="font-semibold dark:text-white">
                    {
                      report.category
                    }
                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-slate-500 dark:text-zinc-400">
                    Metric
                  </p>

                  <p className="font-semibold text-emerald-600">
                    {
                      report.metric
                    }
                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-slate-500 dark:text-zinc-400">
                    Export Type
                  </p>

                  <p className="font-semibold dark:text-white">
                    {
                      report.type
                    }
                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-slate-500 dark:text-zinc-400">
                    Date
                  </p>

                  <p className="font-semibold dark:text-white">
                    {
                      report.date
                    }
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 mt-8">

                <button
                  onClick={() =>
                    handleDownload(
                      report
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition"
                >

                  <Download
                    size={18}
                  />

                  Download

                </button>

              </div>

            </div>
          )
        )}

      </div>

      {/* EMPTY */}
      {filteredReports.length ===
        0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">

          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">

            <FileText
              size={36}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">
            No Reports Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No reports match your
            current filters.
          </p>

        </div>
      )}

      {/* MODAL */}
      <GenerateReportModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        newReport={newReport}
        setNewReport={
          setNewReport
        }
        handleGenerateReport={
          handleGenerateReport
        }
      />

    </div>
  );
}

export default ManagerReports;