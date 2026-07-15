import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import GenerateReportModal from "./GenerateReportModal";
import ExportReportModal from "./ExportReportModal";

import { supabase } from "../../lib/supabase";

import {
  FileText,
  Download,
  Search,
  Plus,
  FolderKanban,
  TrendingUp,
  Users,
  FolderOpen,
  BarChart3,
} from "lucide-react";

function ManagerReports() {
  const { profile } = useAuth();

  const [loading, setLoading] =
    useState(true);


  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [users, setUsers] =
    useState([]);


  const [reportList, setReportList] =
    useState([]);


  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    isExportModalOpen,
    setIsExportModalOpen,
  ] = useState(false);


  const [
    selectedFormat,
    setSelectedFormat,
  ] = useState("PDF");


  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");


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


  useEffect(() => {
    if (profile?.id) {
      loadReports();
    }
  }, [profile]);

  const loadReports =
    async () => {
      try {
        setLoading(true);

        const [
          { data: tasksData },
          { data: projectsData },
          { data: usersData },
        ] = await Promise.all([
          supabase
            .from("tasks")
            .select("*"),

          supabase
            .from("projects")
            .select("*"),

          supabase
            .from("profiles")
            .select("*"),
        ]);

        const allTasks =
          tasksData || [];

        const allProjects =
          projectsData || [];

        const allUsers =
          usersData || [];


        const teamUsers =
          allUsers.filter(
            (user) =>
              user.manager_id ===
                profile?.id ||
              user.id ===
                profile?.id
          );


        const teamTasks =
          allTasks.filter(
            (task) =>
              teamUsers.some(
                (member) =>
                  member.id ===
                  task.assignee_id
              )
          );


        const teamProjects =
          allProjects.filter(
            (project) =>
              project.manager_id ===
              profile?.id
          );

        setTasks(teamTasks);

        setProjects(teamProjects);

        setUsers(teamUsers);


        const completedTasks =
          teamTasks.filter(
            (task) =>
              task.status ===
              "Completed"
          ).length;

        const pendingTasks =
          teamTasks.filter(
            (task) =>
              task.status ===
              "Pending"
          ).length;

        const inProgressTasks =
          teamTasks.filter(
            (task) =>
              task.status ===
              "In Progress"
          ).length;

        const overdueTasks =
          teamTasks.filter(
            (task) =>
              task.due_date &&
              new Date(
                task.due_date
              ) < new Date() &&
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

            date:
              new Date()
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
              "Completed Tasks Report",

            category:
              "Tasks",

            project:
              "Team Tasks",

            generatedBy:
              profile?.full_name ||
              "Team Manager",

            date:
              new Date()
                .toISOString()
                .split("T")[0],

            status:
              "Completed",

            type: "Excel",

            metric:
              completedTasks +
              " Completed Tasks",
          },

          {
            id: 3,

            title:
              "Pending Tasks Analysis",

            category:
              "Tasks",

            project:
              "Team Tasks",

            generatedBy:
              profile?.full_name ||
              "Team Manager",

            date:
              new Date()
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
              "In Progress Tasks Report",

            category:
              "Tasks",

            project:
              "Team Tasks",

            generatedBy:
              profile?.full_name ||
              "Team Manager",

            date:
              new Date()
                .toISOString()
                .split("T")[0],

            status:
              "Completed",

            type: "PDF",

            metric:
              inProgressTasks +
              " Active Tasks",
          },

          {
            id: 5,

            title:
              "Overdue Tasks Report",

            category:
              "Tasks",

            project:
              "Team Tasks",

            generatedBy:
              profile?.full_name ||
              "Team Manager",

            date:
              new Date()
                .toISOString()
                .split("T")[0],

            status:
              overdueTasks > 0
                ? "Pending"
                : "Completed",

            type: "PDF",

            metric:
              overdueTasks +
              " Overdue Tasks",
          },

          {
            id: 6,

            title:
              "Projects Overview Report",

            category:
              "Projects",

            project:
              "Assigned Projects",

            generatedBy:
              profile?.full_name ||
              "Team Manager",

            date:
              new Date()
                .toISOString()
                .split("T")[0],

            status:
              "Completed",

            type: "PDF",

            metric:
              teamProjects.length +
              " Projects",
          },

          {
            id: 7,

            title:
              "Team Activity Report",

            category:
              "Employees",

            project:
              "Team Members",

            generatedBy:
              profile?.full_name ||
              "Team Manager",

            date:
              new Date()
                .toISOString()
                .split("T")[0],

            status:
              "Completed",

            type: "Excel",

            metric:
              teamUsers.length +
              " Team Members",
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
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );


  const totalReports =
    filteredReports.length;

  const totalProjects =
    projects.length;

  const totalUsers =
    users.length;

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


  const topMember = useMemo(() => {
    const stats = users.map(
      (user) => {
        const userTasks =
          tasks.filter(
            (task) =>
              task.assignee_id ===
              user.id
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

        status:
          "Completed",

        type: "PDF",
      });

      setIsModalOpen(false);
    };


  const handleDownload =
    (report) => {

      const content = `
======================================
${report.title}
======================================

Category:
${report.category}

Project:
${report.project}

Metric:
${report.metric}

Generated By:
${report.generatedBy}

Date:
${report.date}

Status:
${report.status}

Type:
${report.type}

======================================
Generated from WorkPulse
======================================
`;

      const blob = new Blob(
        [content],
        {
          type:
            "text/plain",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        report.title
          .toLowerCase()
          .replace(/\s+/g, "-") +
        ".txt";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );
    };


  const handleExport =
    () => {

      const exportData =
        filteredReports.map(
          (report) => ({
            Title:
              report.title,

            Category:
              report.category,

            Metric:
              report.metric,

            GeneratedBy:
              report.generatedBy,

            Date:
              report.date,

            Status:
              report.status,

            Type:
              report.type,
          })
        );

      const blob = new Blob(
        [
          JSON.stringify(
            exportData,
            null,
            2
          ),
        ],
        {
          type:
            "application/json",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "manager-reports.json";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      setIsExportModalOpen(
        false
      );
    };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">

        <div className="flex flex-col items-center gap-4">

          <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />

          <p className="text-slate-500 dark:text-zinc-400">
            Loading reports...
          </p>

        </div>

      </div>
    );
  }

  

  return (
    <div className="space-y-6">

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

    

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredReports.map(
          (report) => (

            <div
              key={report.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5"
            >

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

      {filteredReports.length ===
        0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 text-center">

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
