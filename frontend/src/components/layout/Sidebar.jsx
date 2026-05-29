import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart3,
  FileText,
  Target,
  CalendarDays,
  FolderKanban,
  Settings,
  LogOut,
  CircleHelp,
  Activity,
} from "lucide-react";

function Sidebar() {
  // MENU STYLE
  const menuClass =
    "flex cursor-pointer items-center gap-3 rounded-xl p-3 text-white/80 transition hover:bg-white/10 hover:text-white";

  return (
    <div className="flex min-h-screen w-72 flex-col justify-between border-r border-emerald-900 bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-900 p-5">

      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div className="mb-10 flex items-center gap-3">

          {/* LOGO ICON */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
            <Activity size={24} />
          </div>

          {/* LOGO TEXT */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              WorkPulse
            </h1>

            <p className="text-xs tracking-wide text-emerald-200/70">
              Team Performance
            </p>
          </div>

        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-3">

          {/* DASHBOARD */}
          <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-emerald-500/20 p-3 text-emerald-300 transition">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>

          {/* MEMBERS */}
          <div className={menuClass}>
            <Users size={20} />
            <span>Members</span>
          </div>

          {/* PROJECTS */}
          <div className={menuClass}>
            <FolderKanban size={20} />
            <span>Projects</span>
          </div>

          {/* TASKS */}
          <div className={menuClass}>
            <CheckSquare size={20} />
            <span>Tasks</span>
          </div>

          {/* PERFORMANCE */}
          <div className={menuClass}>
            <BarChart3 size={20} />
            <span>Performance</span>
          </div>

          {/* REPORTS */}
          <div className={menuClass}>
            <FileText size={20} />
            <span>Reports</span>
          </div>

          {/* GOALS */}
          <div className={menuClass}>
            <Target size={20} />
            <span>Goals</span>
          </div>

          {/* CALENDAR */}
          <div className={menuClass}>
            <CalendarDays size={20} />
            <span>Calendar</span>
          </div>

          {/* SETTINGS */}
          <div className={`mt-4 ${menuClass}`}>
            <Settings size={20} />
            <span>Settings</span>
          </div>

        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-white/10 pt-5">

        {/* PROFILE */}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur-md">

          {/* AVATAR */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-md">
            F
          </div>

          {/* USER INFO */}
          <div>
            <h3 className="font-semibold text-white">
              Faith Njeri
            </h3>

            <p className="text-sm text-emerald-100/70">
              Team Manager
            </p>
          </div>

        </div>

        {/* BOTTOM ICONS */}
        <div className="flex items-center justify-between">

          {/* HELP */}
          <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white">
            <CircleHelp size={20} />
          </button>

          {/* LOGOUT */}
          <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500/20">
            <LogOut size={20} />
          </button>

        </div>
      </div>
    </div>
  );
}

export default Sidebar;