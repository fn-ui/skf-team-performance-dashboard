function GenerateReportModal({
  isOpen,
  onClose,
  newReport,
  setNewReport,
  handleGenerateReport,
  projects = [],
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800 p-8 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              Generate Report
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Create analytics and export real-time company insights.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 transition"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <div className="space-y-7 mt-10">

          {/* TITLE */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-3">
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
              placeholder="e.g Team Productivity Report"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />

          </div>

          {/* PROJECT */}
          <div>

            <label className="block text-sm font-semibold dark:text-white mb-3">
              Project
            </label>

            <select
              value={newReport.project}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  project: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >

              <option value="">
                Select Project
              </option>

              <option value="All Projects">
                All Projects
              </option>

              {projects.map((project) => (

                <option
                  key={project.id}
                  value={project.name}
                >
                  {project.name}
                </option>

              ))}

            </select>

          </div>

          {/* CATEGORY + TYPE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CATEGORY */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-3">
                Report Category
              </label>

              <select
                value={newReport.category}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    category: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >

                <option>Performance</option>
                <option>Projects</option>
                <option>Tasks</option>
                <option>Analytics</option>
                <option>Finance</option>

              </select>

            </div>

            {/* EXPORT TYPE */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-3">
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
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >

                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>

              </select>

            </div>

          </div>

          {/* STATUS + DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* STATUS */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-3">
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
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >

                <option>Completed</option>
                <option>Pending</option>

              </select>

            </div>

            {/* DATE */}
            <div>

              <label className="block text-sm font-semibold dark:text-white mb-3">
                Report Date
              </label>

              <input
                type="date"
                value={newReport.date}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    date: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />

            </div>

          </div>

          {/* INFO CARD */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5">

            <h3 className="font-bold text-emerald-700 dark:text-emerald-400">
              Report Summary
            </h3>

            <div className="grid grid-cols-2 gap-5 mt-4">

              <div>

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Category
                </p>

                <p className="font-semibold dark:text-white mt-1">
                  {newReport.category}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Export Type
                </p>

                <p className="font-semibold dark:text-white mt-1">
                  {newReport.type}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Project
                </p>

                <p className="font-semibold dark:text-white mt-1">
                  {newReport.project || "Not Selected"}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Status
                </p>

                <p className="font-semibold text-emerald-600 mt-1">
                  {newReport.status}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerateReport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg shadow-emerald-500/20"
          >
            Generate Report
          </button>

        </div>

      </div>

    </div>
  );
}

export default GenerateReportModal;