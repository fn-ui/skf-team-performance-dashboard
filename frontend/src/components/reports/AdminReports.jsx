import { useEffect, useMemo, useState } from "react";

import { getAdminReportStats } from "../../services/reportsService";

import GenerateReportModal from "./GenerateReportModal";
import ExportReportModal from "./ExportReportModal";

import {
  FileText,
  Download,
  Search,
  Plus,
  CheckCircle,
  Clock,
  BarChart3,
  FolderKanban,
  Users,
  FolderOpen,
  TrendingUp,
} from "lucide-react";

function AdminReports() {
  const [loading, setLoading] =
    useState(true);

  // 🔥 REAL DATA
  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  // 🔥 REPORTS
  const [reportList, setReportList] =
    useState([]);

  // 🔥 MODALS
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    isExportModalOpen,
    setIsExportModalOpen,
  ] = useState(false);

  // 🔥 EXPORT
  const [
    selectedFormat,
    setSelectedFormat,
  ] = useState("PDF");

  // 🔥 FILTERS
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // 🔥 NEW REPORT
  const [newReport, setNewReport] =
    useState({
      title: "",
      category: "Performance",
      project: "",
      generatedBy: "Admin",
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "Completed",
      type: "PDF",
    });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      const data =
        await getAdminReportStats();

      const tasksData =
        data?.tasks || [];

      const projectsData =
        data?.projects || [];

      const usersData =
        data?.users || [];

      setTasks(tasksData);

      setProjects(projectsData);

      setUsers(usersData);

      /* ================= AUTO GENERATED REPORTS ================= */

      const completedTasks =
        tasksData.filter(
          (task) =>
            task.status === "Completed"
        ).length;

      const pendingTasks =
        tasksData.filter(
          (task) =>
            task.status !== "Completed"
        ).length;

      const activeProjects =
        projectsData.filter(
          (project) =>
            project.status !==
            "Completed"
        ).length;

      const productivity =
        tasksData.length === 0
          ? 0
          : Math.round(
              (completedTasks /
                tasksData.length) *
                100
            );

      const generatedReports = [
        {
          id: 1,
          title:
            "Company Performance Report",
          category: "Performance",
          project: "All Projects",
          generatedBy: "System",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Completed",
          type: "PDF",
          metric:
            productivity + "% Productivity",
        },

        {
          id: 2,
          title:
            "Projects Overview Report",
          category: "Projects",
          project: "All Projects",
          generatedBy: "System",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Completed",
          type: "Excel",
          metric:
            activeProjects +
            " Active Projects",
        },

        {
          id: 3,
          title:
            "Task Analytics Report",
          category: "Tasks",
          project: "All Projects",
          generatedBy: "System",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Completed",
          type: "PDF",
          metric:
            completedTasks +
            " Completed Tasks",
        },

        {
          id: 4,
          title:
            "Team Activity Report",
          category: "Employees",
          project: "Company Wide",
          generatedBy: "System",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status: "Completed",
          type: "PDF",
          metric:
            usersData.length +
            " Employees",
        },

        {
          id: 5,
          title:
            "Pending Tasks Summary",
          category: "Tasks",
          project: "All Projects",
          generatedBy: "System",
          date: new Date()
            .toISOString()
            .split("T")[0],
          status:
            pendingTasks > 0
              ? "Pending"
              : "Completed",
          type: "Excel",
          metric:
            pendingTasks +
            " Pending Tasks",
        },
      ];

      setReportList(generatedReports);
    } catch (error) {
      console.error(
        "REPORT FETCH ERROR:",
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
        statusFilter === "All"
          ? true
          : report.status ===
            statusFilter
      );

  /* ================= REAL STATS ================= */

  const totalReports =
    reportList.length;

  const completedReports =
    reportList.filter(
      (report) =>
        report.status === "Completed"
    ).length;

  const pendingReports =
    reportList.filter(
      (report) =>
        report.status === "Pending"
    ).length;

  const totalProjects =
    projects.length;

  const totalUsers = users.length;

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const productivity =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  /* ================= TOP PERFORMER ================= */

  const topPerformer = useMemo(() => {
    const memberStats = users.map(
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
          role: user.role,
          score,
        };
      }
    );

    return memberStats.reduce(
      (prev, current) =>
        prev.score > current.score
          ? prev
          : current,
      {
        name: "No Data",
        role: "-",
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
        category: "Performance",
        project: "",
        generatedBy: "Admin",
        date: new Date()
          .toISOString()
          .split("T")[0],
        status: "Completed",
        type: "PDF",
      });

      setIsModalOpen(false);
    };

  /* ================= EXPORT ================= */

  const handleExport = () => {
    console.log(
      `Exporting reports as ${selectedFormat}`
    );

    setIsExportModalOpen(false);
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
            Company Reports
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Generate, monitor, and
            export real-time company
            reports.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              setIsExportModalOpen(
                true
              )
            }
            className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 px-5 py-3 rounded-xl dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >

            <Download size={18} />

            Export

          </button>

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

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL REPORTS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Total Reports
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalReports}
              </h2>

            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">

              <FileText
                size={24}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

        {/* PROJECTS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Projects
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalProjects}
              </h2>

            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">

              <FolderOpen
                size={24}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

        {/* EMPLOYEES */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Employees
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {totalUsers}
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

        {/* PRODUCTIVITY */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Productivity
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {productivity}%
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

      {/* TOP PERFORMER */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="flex items-center gap-3">

              <BarChart3 size={28} />

              <h2 className="text-2xl font-bold">
                Top Performer
              </h2>

            </div>

            <p className="mt-4 text-lg">
              {topPerformer.name}
            </p>

            <p className="text-emerald-100 mt-2">
              {topPerformer.role}
            </p>

          </div>

          <div className="text-center lg:text-right">

            <h1 className="text-6xl font-bold">
              {topPerformer.score}%
            </h1>

            <p className="mt-2 text-emerald-100">
              Performance Score
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

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >

          <option>
            All
          </option>

          <option>
            Completed
          </option>

          <option>
            Pending
          </option>

        </select>

      </div>

      {/* REPORTS TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 dark:bg-zinc-800">

              <tr>

                <th className="text-left p-5 dark:text-white">
                  Report
                </th>

                <th className="text-left p-5 dark:text-white">
                  Category
                </th>

                <th className="text-left p-5 dark:text-white">
                  Metric
                </th>

                <th className="text-left p-5 dark:text-white">
                  Generated By
                </th>

                <th className="text-left p-5 dark:text-white">
                  Date
                </th>

                <th className="text-left p-5 dark:text-white">
                  Status
                </th>

                <th className="text-left p-5 dark:text-white">
                  Type
                </th>

                <th className="text-left p-5 dark:text-white">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReports.map(
                (report) => (

                  <tr
                    key={
                      report.id
                    }
                    className="border-t border-slate-200 dark:border-zinc-800"
                  >

                    <td className="p-5 font-semibold dark:text-white">
                      {
                        report.title
                      }
                    </td>

                    <td className="p-5 text-slate-500 dark:text-zinc-400">
                      {
                        report.category
                      }
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        report.metric
                      }
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        report.generatedBy
                      }
                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        report.date
                      }
                    </td>

                    <td className="p-5">

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

                    </td>

                    <td className="p-5 dark:text-white">
                      {
                        report.type
                      }
                    </td>

                    <td className="p-5">

                      <button
                        onClick={() =>
                          handleDownload(
                            report
                          )
                        }
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition"
                      >

                        <Download
                          size={
                            18
                          }
                        />

                        Download

                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredReports.length ===
        0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">

          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">

            <FolderKanban
              size={36}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold dark:text-white">
            No Reports Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No reports match
            your search or
            filters.
          </p>

        </div>
      )}

      {/* MODALS */}
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

      <ExportReportModal
        isOpen={
          isExportModalOpen
        }
        onClose={() =>
          setIsExportModalOpen(
            false
          )
        }
        selectedFormat={
          selectedFormat
        }
        setSelectedFormat={
          setSelectedFormat
        }
        handleExport={
          handleExport
        }
      />

    </div>
  );
}

export default AdminReports;