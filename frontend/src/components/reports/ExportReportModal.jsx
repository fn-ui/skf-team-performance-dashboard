import {
  FileDown,
} from "lucide-react";

function ExportReportModal({
  isOpen,
  onClose,
  selectedFormat,
  setSelectedFormat,
  handleExport,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-zinc-800 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Export Reports
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Choose your preferred export format.
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>

        </div>

        {/* EXPORT OPTIONS */}
        <div className="space-y-4 mt-8">

          {/* PDF */}
          <button
            onClick={() =>
              setSelectedFormat("PDF")
            }
            className={`w-full border rounded-2xl p-5 text-left transition
              ${
                selectedFormat === "PDF"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                  : "border-slate-200 dark:border-zinc-800"
              }
            `}
          >

            <h3 className="font-bold dark:text-white">
              PDF Export
            </h3>

            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm">
              Best for printing and presentations.
            </p>

          </button>

          {/* EXCEL */}
          <button
            onClick={() =>
              setSelectedFormat("Excel")
            }
            className={`w-full border rounded-2xl p-5 text-left transition
              ${
                selectedFormat === "Excel"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                  : "border-slate-200 dark:border-zinc-800"
              }
            `}
          >

            <h3 className="font-bold dark:text-white">
              Excel Export
            </h3>

            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm">
              Best for analytics and spreadsheets.
            </p>

          </button>

          {/* CSV */}
          <button
            onClick={() =>
              setSelectedFormat("CSV")
            }
            className={`w-full border rounded-2xl p-5 text-left transition
              ${
                selectedFormat === "CSV"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                  : "border-slate-200 dark:border-zinc-800"
              }
            `}
          >

            <h3 className="font-bold dark:text-white">
              CSV Export
            </h3>

            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm">
              Lightweight export for raw data.
            </p>

          </button>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition"
          >

            <FileDown size={18} />

            Export

          </button>

        </div>

      </div>

    </div>
  );
}

export default ExportReportModal;