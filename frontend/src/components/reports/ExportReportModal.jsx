import { FileDown } from "lucide-react";

function ExportReportModal({
  isOpen,
  onClose,
  selectedFormat,
  setSelectedFormat,
  handleExport,
  exportStats,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800 p-8 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-5">

              <FileDown
                size={28}
                className="text-emerald-600"
              />

            </div>

            <h2 className="text-3xl font-bold dark:text-white">
              Export Reports
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              Download company analytics, performance insights,
              tasks, and projects in your preferred format.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition"
          >
            ✕
          </button>

        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Reports
            </p>

            <h3 className="text-2xl font-bold mt-2 dark:text-white">
              {exportStats?.reports || 0}
            </h3>

          </div>

          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Projects
            </p>

            <h3 className="text-2xl font-bold mt-2 dark:text-white">
              {exportStats?.projects || 0}
            </h3>

          </div>

          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Tasks
            </p>

            <h3 className="text-2xl font-bold mt-2 dark:text-white">
              {exportStats?.tasks || 0}
            </h3>

          </div>

          <div className="bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4">

            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Productivity
            </p>

            <h3 className="text-2xl font-bold mt-2 text-emerald-600">
              {exportStats?.productivity || 0}%
            </h3>

          </div>

        </div>

        {/* EXPORT OPTIONS */}
        <div className="space-y-5 mt-10">

          {/* PDF */}
          <button
            onClick={() =>
              setSelectedFormat("PDF")
            }
            className={`w-full border rounded-3xl p-6 text-left transition-all
              ${
                selectedFormat === "PDF"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm"
                  : "border-slate-200 dark:border-zinc-800 hover:border-emerald-300"
              }
            `}
          >

            <div className="flex items-start justify-between gap-5">

              <div>

                <h3 className="text-xl font-bold dark:text-white">
                  PDF Export
                </h3>

                <p className="text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Export professional reports ready for presentations,
                  printing, and sharing with stakeholders.
                </p>

              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedFormat === "PDF"
                      ? "border-emerald-600"
                      : "border-slate-300 dark:border-zinc-700"
                  }
                `}
              >

                {selectedFormat === "PDF" && (
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                )}

              </div>

            </div>

          </button>

          {/* EXCEL */}
          <button
            onClick={() =>
              setSelectedFormat("Excel")
            }
            className={`w-full border rounded-3xl p-6 text-left transition-all
              ${
                selectedFormat === "Excel"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm"
                  : "border-slate-200 dark:border-zinc-800 hover:border-emerald-300"
              }
            `}
          >

            <div className="flex items-start justify-between gap-5">

              <div>

                <h3 className="text-xl font-bold dark:text-white">
                  Excel Export
                </h3>

                <p className="text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Best for analytics, charts, pivot tables, and advanced
                  spreadsheet analysis.
                </p>

              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedFormat === "Excel"
                      ? "border-emerald-600"
                      : "border-slate-300 dark:border-zinc-700"
                  }
                `}
              >

                {selectedFormat === "Excel" && (
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                )}

              </div>

            </div>

          </button>

          {/* CSV */}
          <button
            onClick={() =>
              setSelectedFormat("CSV")
            }
            className={`w-full border rounded-3xl p-6 text-left transition-all
              ${
                selectedFormat === "CSV"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm"
                  : "border-slate-200 dark:border-zinc-800 hover:border-emerald-300"
              }
            `}
          >

            <div className="flex items-start justify-between gap-5">

              <div>

                <h3 className="text-xl font-bold dark:text-white">
                  CSV Export
                </h3>

                <p className="text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Lightweight raw-data export compatible with databases
                  and external systems.
                </p>

              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedFormat === "CSV"
                      ? "border-emerald-600"
                      : "border-slate-300 dark:border-zinc-700"
                  }
                `}
              >

                {selectedFormat === "CSV" && (
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                )}

              </div>

            </div>

          </button>

        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-200 dark:border-zinc-800">

          <div>

            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Selected Format:
            </p>

            <p className="font-bold text-emerald-600 mt-1">
              {selectedFormat}
            </p>

          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-2xl transition font-semibold shadow-lg shadow-emerald-600/20"
            >

              <FileDown size={18} />

              Export Report

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ExportReportModal;