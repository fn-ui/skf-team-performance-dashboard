import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

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
  ChevronUp,
  User,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function Sidebar({
  darkMode,
  toggleDarkMode,
  collapsed,
  setCollapsed,
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);
    

  const [profileOpen, setProfileOpen] =
    useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const {
    user,
    profile,
    signOut,
  } = useAuth();

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      name: "Members",
      icon: Users,
      path: "/members",
      roles: [
        "admin",
        "Team Manager",
      ],
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      name: "Performance",
      icon: BarChart3,
      path: "/performance",
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/reports",
      roles: [
        "admin",
        "Team Manager",
      ],
    },
    {
      name: "Goals",
      icon: Target,
      path: "/goals",
    },
    {
      name: "Calendar",
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["admin"],
    },
    {
      name: "User Management",
      icon: Users,
      path: "/admin/users",
      roles: ["admin"],
    },
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      {!mobileOpen && (
        <div className="fixed left-4 top-4 z-[80] lg:hidden">
          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg"
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed left-0 top-0 z-[60]
          h-screen
          bg-gradient-to-b
          from-emerald-950 via-teal-950 to-emerald-900
          dark:from-black dark:via-zinc-950 dark:to-black
          border-r border-emerald-900 dark:border-zinc-800
          flex flex-col justify-between
          transition-[width,transform] duration-300
          overflow-y-hidden overflow-x-visible
          ${
            collapsed
              ? "w-24"
              : "w-72"
          }
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* TOP */}

        <div
          className={`
            relative flex-1 overflow-x-hidden p-5
            ${
              collapsed
                ? "overflow-y-auto"
                : "overflow-y-auto scrollbar-hide"
            }
          `}
        >
          {/* COLLAPSE BUTTON */}

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
            className="
              absolute right-3 top-8 z-[100]
              hidden h-7 w-7
              items-center justify-center
              rounded-full border
              border-slate-200
              bg-white text-slate-700
              shadow-md transition-all duration-300
              hover:scale-110
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-white
              lg:flex
            "
          >
            {collapsed ? (
              <ChevronRight
                size={14}
              />
            ) : (
              <ChevronLeft
                size={14}
              />
            )}
          </button>

          {/* LOGO */}

          <div
            className={`mb-10 flex items-center ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }`}
          >
            <div className="flex h-12 w-12 min-w-[48px] items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
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

          {/* MOBILE CLOSE BUTTON */}

          <div className="mb-6 flex justify-end lg:hidden">
            <button
              onClick={() =>
                setMobileOpen(false)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* MENU */}

          <nav className="flex flex-col gap-3 overflow-x-hidden">
            {menus
              .filter(
                (m) =>
                  !m.roles ||
                  m.roles.includes(
                    profile?.role ||
                      "member"
                  )
              )
              .map((menu, index) => {
                const Icon =
                  menu.icon;

                return (
                  <Link
                    key={index}
                    to={menu.path}
                    onClick={() => {
                      if (
                        window.innerWidth <
                        1024
                      ) {
                        setMobileOpen(
                          false
                        );
                      }
                    }}
                    className={`
                      group flex w-full items-center overflow-hidden rounded-xl p-3
                      transition-all duration-300
                      ${
                        collapsed
                          ? "justify-center"
                          : "gap-3"
                      }
                      ${
                        location.pathname ===
                        menu.path
                          ? "border border-emerald-500/20 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    `}
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
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* BOTTOM */}

        <div className="border-t border-white/10 p-5">
          {/* PROFILE */}

<div className="relative mb-5">
  <div
    onClick={() => {
      if (profile?.role !== "admin") {
        setProfileOpen(
          !profileOpen
        );
      }
    }}
    className={`
      rounded-2xl bg-white/5 p-3
      backdrop-blur-md flex items-center
      transition cursor-pointer
      hover:bg-white/10
      ${
        collapsed
          ? "justify-center"
          : "gap-3"
      }
    `}
  >
    

    {/* AVATAR */}

<div className="flex h-12 w-12 min-w-[48px] items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-lg font-bold text-white shadow-md">

  {profile?.avatar_url &&
   profile.avatar_url !== "" ? (
    <img
      key={profile.avatar_url}
      src={profile.avatar_url}
      alt="avatar"
      className="h-full w-full object-cover"
    />
  ) : (
    profile?.full_name
      ?.charAt(0)
      ?.toUpperCase() || "U"
  )}

</div>

    {!collapsed && (
      <>
        <div className="flex-1 overflow-hidden">
          <h3 className="truncate font-semibold text-white">
            {profile?.full_name ||
              user?.email ||
              "Guest"}
          </h3>

          <p className="text-sm text-emerald-100/70 capitalize">
            {profile?.role ||
              "member"}
          </p>
        </div>

        {/* ONLY SHOW DROPDOWN ICON FOR NON-ADMINS */}

        {profile?.role !==
          "admin" && (
          <ChevronRight
            size={18}
            className={`text-white/70 transition ${
              profileOpen
                ? "rotate-90"
                : ""
            }`}
          />
        )}
      </>
    )}
  </div>

  {/* DROPDOWN */}

  {!collapsed &&
    profileOpen &&
    profile?.role !==
      "admin" && (
      <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
        <Link
          to="/profile"
          onClick={() =>
            setProfileOpen(false)
          }
          className="block px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Edit Profile
        </Link>
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
              onClick={
                toggleDarkMode
              }
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
              <CircleHelp
                size={20}
              />
            </button>

            {/* LOGOUT */}

            <button
              onClick={() =>
                signOut()
              }
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;