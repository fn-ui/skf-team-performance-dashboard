import { useState } from "react";

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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

function Sidebar({ darkMode, toggleDarkMode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      name: "Members",
      icon: Users,
    },
    {
      name: "Projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      icon: CheckSquare,
    },
    {
      name: "Performance",
      icon: BarChart3,
    },
    {
      name: "Reports",
      icon: FileText,
    },
    {
      name: "Goals",
      icon: Target,
    },
    {
      name: "Calendar",
      icon: CalendarDays,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <div className="fixed top-4 left-4 z-[60] lg:hidden">

        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>

      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
    className={`fixed lg:sticky top-0 z-50 h-screen overflow-y-auto bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-900 border-r border-emerald-900 flex flex-col justify-between transition-all duration-500 dark:from-black dark:via-zinc-950 dark:to-black dark:border-zinc-800 ${
      collapsed ? "w-24" : "w-72"
    } ${
      mobileOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }`}
  >

        {/* TOP */}
        <div className="p-5">

          {/* LOGO + CONTROLS */}
          <div className="flex items-center justify-between mb-10">

            {/* LOGO */}
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                <Activity size={24} />
              </div>

              {!collapsed && (
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    WorkPulse
                  </h1>

                  <p className="text-xs tracking-wide text-emerald-200/70">
                    Team Performance
                  </p>
                </div>
              )}

            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-2">

              {/* COLLAPSE BUTTON */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10"
              >
                {collapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>

              {/* MOBILE CLOSE BUTTON */}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10"
              >
                <X size={20} />
              </button>

            </div>

          </div>

          {/* MENU */}
          <nav className="flex flex-col gap-3">

            {menus.map((menu, index) => {
              const Icon = menu.icon;

              return (
                <div
                  key={index}
                  className={`group flex cursor-pointer items-center rounded-xl p-3 transition-all duration-300 ${
                    collapsed
                      ? "justify-center"
                      : "gap-3"
                  } ${
                    menu.active
                      ? "bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >

                  <Icon
                    size={22}
                    className="min-w-[22px]"
                  />

                  {!collapsed && (
                    <span className="font-medium">
                      {menu.name}
                    </span>
                  )}

                </div>
              );
            })}

          </nav>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 p-5">

          {/* PROFILE */}
          <div
            className={`mb-5 rounded-2xl bg-white/5 backdrop-blur-md p-3 flex items-center ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }`}
          >

            {/* AVATAR */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-md">
              F
            </div>

            {!collapsed && (
              <div>
                <h3 className="font-semibold text-white">
                  Faith Njeri
                </h3>

                <p className="text-sm text-emerald-100/70">
                  Team Manager
                </p>
              </div>
            )}

          </div>

          {/* ACTION BUTTONS */}
          <div
            className={`flex items-center ${
              collapsed
                ? "flex-col gap-3"
                : "justify-between"
            }`}
          >
            {/* DARK MODE */}
            <button
              onClick={toggleDarkMode}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
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
    </>
  );
}

export default Sidebar;