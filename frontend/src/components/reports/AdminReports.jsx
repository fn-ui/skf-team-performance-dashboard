import { useState } from "react";

import { reportsData } from "../../data/reportsData";
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
} from "lucide-react";

function AdminReports() {

    const [isModalOpen, setIsModalOpen] =
  useState(false);

const [reportList, setReportList] =
  useState(reportsData);

const [newReport, setNewReport] =
  useState({
    title: "",
    category: "Performance",
    project: "",
    generatedBy: "Admin",
    date: "2026-06-10",
    status: "Completed",
    type: "PDF",
  });

  const [isExportModalOpen, setIsExportModalOpen] =
  useState(false);

const [selectedFormat, setSelectedFormat] =
  useState("PDF");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // FILTER REPORTS
  const filteredReports = reportList
    .filter((report) =>
      report.title
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((report) =>
      statusFilter === "All"
        ? true
        : report.status === statusFilter
    );

  // STATS
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

    const handleGenerateReport = () => {
  if (
    !newReport.title ||
    !newReport.project
  )
    return;

  const report = {
    id: Date.now(),
    ...newReport,
  };

  setReportList([
    report,
    ...reportList,
  ]);

  setNewReport({
    title: "",
    category: "Performance",
    project: "",
    generatedBy: "Admin",
    date: "2026-06-10",
    status: "Completed",
    type: "PDF",
  });

  setIsModalOpen(false);
};

const handleExport = () => {
  console.log(
    `Exporting reports as ${selectedFormat}`
  );

  setIsExportModalOpen(false);
};

const handleDownload = (report) => {
  console.log(
    `Downloading ${report.title}`
  );
};
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Company Reports
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Generate, monitor, and export company-wide reports.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
                setIsExportModalOpen(true)
            }
            className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 px-5 py-3 rounded-xl dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >

            <Download size={18} />

            Export

            </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition"
            >
            <Plus size={18} />
            Generate Report
            </button>

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL */}
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

            <div className="bg-blue-100 p-3 rounded-xl">

              <FileText
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
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {completedReports}
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
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {pendingReports}
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

        {/* CATEGORIES */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-zinc-400">
                Categories
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                4
              </h2>

            </div>

            <div className="bg-purple-100 p-3 rounded-xl">

              <BarChart3
                size={24}
                className="text-purple-600"
              />

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
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
          />

        </div>

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >

          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>

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
                  Project
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

              {filteredReports.map((report) => (

                <tr
                  key={report.id}
                  className="border-t border-slate-200 dark:border-zinc-800"
                >

                  <td className="p-5 font-semibold dark:text-white">
                    {report.title}
                  </td>

                  <td className="p-5 text-slate-500 dark:text-zinc-400">
                    {report.category}
                  </td>

                  <td className="p-5 dark:text-white">
                    {report.project}
                  </td>

                  <td className="p-5 dark:text-white">
                    {report.generatedBy}
                  </td>

                  <td className="p-5 dark:text-white">
                    {report.date}
                  </td>

                  <td className="p-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          report.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      `}
                    >
                      {report.status}
                    </span>

                  </td>

                  <td className="p-5 dark:text-white">
                    {report.type}
                  </td>

                  <td className="p-5">

                    <td className="p-5">

                <button
                    onClick={() =>
                    handleDownload(report)
                    }
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition"
                >

                    <Download size={18} />

                    Download

                </button>

                </td>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredReports.length === 0 && (

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
            No reports match your search or filters.
          </p>

        </div>

      )}
      <GenerateReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newReport={newReport}
        setNewReport={setNewReport}
        handleGenerateReport={handleGenerateReport}
        />

            <ExportReportModal
            isOpen={isExportModalOpen}
            onClose={() =>
                setIsExportModalOpen(false)
            }
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            handleExport={handleExport}
            />

    </div>
  );
}

export default AdminReports;