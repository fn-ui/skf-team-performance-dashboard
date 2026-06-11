function GenerateReportModal({
  isOpen,
  onClose,
  newReport,
  setNewReport,
  handleGenerateReport,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold dark:text-white">
              Generate Report
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Create and export a new company report.
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <div className="space-y-6 mt-8">

          {/* TITLE */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Report Title
            </label>

            <input
              type="text"
              value={newReport.title}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  title: e.target.value,
                })
              }
              placeholder="Enter report title"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* PROJECT */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Project
            </label>

            <input
              type="text"
              value={newReport.project}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  project: e.target.value,
                })
              }
              placeholder="Project name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

          {/* CATEGORY + TYPE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* CATEGORY */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-2">
                Category
              </label>

              <select
                value={newReport.category}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option>Performance</option>
                <option>Projects</option>
                <option>Tasks</option>
                <option>Finance</option>

              </select>

            </div>

            {/* TYPE */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-2">
                Export Type
              </label>

              <select
                value={newReport.type}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    type: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
              >

                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>

              </select>

            </div>

          </div>

          {/* STATUS */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-2">
              Status
            </label>

            <select
              value={newReport.status}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  status: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            >

              <option>Completed</option>
              <option>Pending</option>

            </select>

          </div>

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
            onClick={handleGenerateReport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition"
          >
            Generate Report
          </button>

        </div>

      </div>

    </div>
  );
}

export default GenerateReportModal;