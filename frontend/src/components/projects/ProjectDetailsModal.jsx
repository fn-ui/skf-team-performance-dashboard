import {
  X,
  FolderKanban,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock3,
  Flag,
} from "lucide-react";

function ProjectDetailsModal({
  isOpen,
  onClose,
  selectedProject,
}) {
  if (
    !isOpen ||
    !selectedProject
  )
    return null;

  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-amber-100 text-amber-700";

      case "Low":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 overflow-y-auto max-h-[95vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold dark:text-white">
              Project Details
            </h2>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Complete overview of the
              selected project.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center transition"
          >

            <X
              size={22}
              className="dark:text-white"
            />

          </button>

        </div>

        {/* PROJECT CARD */}
        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

          {/* TOP */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

                  <FolderKanban className="text-emerald-600" />

                </div>

                <div>

                  <h2 className="text-3xl font-bold dark:text-white">
                    {selectedProject.name}
                  </h2>

                  <p className="text-slate-500 dark:text-zinc-400 mt-2">
                    {
                      selectedProject.description
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* PRIORITY */}
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${getPriorityColor(
                selectedProject.priority
              )}`}
            >

              {selectedProject.priority} Priority

            </span>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

            {/* MANAGER */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Project Manager
              </p>

              <h3 className="text-lg font-bold mt-3 dark:text-white">
                {selectedProject.manager}
              </h3>

            </div>

            {/* STATUS */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Current Status
              </p>

              <h3 className="text-lg font-bold mt-3 text-blue-600">
                {selectedProject.status}
              </h3>

            </div>

            {/* DEADLINE */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Deadline
              </p>

              <div className="flex items-center gap-2 mt-3">

                <CalendarDays
                  size={18}
                  className="text-red-500"
                />

                <h3 className="text-lg font-bold text-red-500">
                  {
                    selectedProject.deadline
                  }
                </h3>

              </div>

            </div>

            {/* TASKS */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Tasks Completed
              </p>

              <div className="flex items-center gap-2 mt-3">

                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="text-lg font-bold dark:text-white">

                  {
                    selectedProject.completedTasks
                  }
                  /
                  {
                    selectedProject.totalTasks
                  }

                </h3>

              </div>

            </div>

          </div>

          {/* PROGRESS */}
          <div className="mt-10">

            <div className="flex items-center justify-between mb-3">

              <p className="font-medium dark:text-white">
                Project Progress
              </p>

              <p className="font-bold text-emerald-600">
                {
                  selectedProject.progress
                }
                %
              </p>

            </div>

            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-4">

              <div
                className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${selectedProject.progress}%`,
                }}
              />

            </div>

          </div>

          {/* TEAM MEMBERS */}
          <div className="mt-10">

            <div className="flex items-center gap-3 mb-6">

              <Users className="text-purple-600" />

              <h3 className="text-xl font-bold dark:text-white">
                Team Members
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {selectedProject.members.map(
                (member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">

                        {member.charAt(0)}

                      </div>

                      <div>

                        <h4 className="font-semibold dark:text-white">
                          {member}
                        </h4>

                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                          Team Member
                        </p>

                      </div>

                    </div>

                    <Clock3
                      size={18}
                      className="text-slate-400"
                    />

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >

            Close

          </button>

          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition font-medium">

            Open Workspace

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetailsModal;