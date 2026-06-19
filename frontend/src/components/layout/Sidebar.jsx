import { useState } from "react";
import {
  Link,
  useLocation,
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
  Activity,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  HelpCircle,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import HelpModal from "../help/HelpModal";

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

  const [isHelpOpen, setIsHelpOpen] =
  useState(false);

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
            aria-label="Open navigation"
            className="focus-ring flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-emerald-600 text-white shadow-[0_18px_40px_rgba(16,185,129,0.28)] backdrop-blur transition hover:bg-emerald-500"
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
          bg-[linear-gradient(180deg,#04251f_0%,#0b3535_52%,#151812_100%)]
          dark:bg-[linear-gradient(180deg,#030706_0%,#06110f_52%,#0f0f0b_100%)]
          border-r border-white/10
          flex flex-col justify-between
          transition-[width,transform] duration-300
          overflow-y-hidden overflow-x-visible
          shadow-[18px_0_70px_rgba(4,37,31,0.25)]
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
              border-white/70
              bg-white/95 text-slate-700
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
            <div className="flex h-12 w-12 min-w-[48px] items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-amber-300 text-white shadow-lg shadow-emerald-950/30">
              <Activity size={24} />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-2xl font-bold text-white">
                  WorkPulse
                </h1>

                <p className="text-xs font-medium uppercase text-emerald-100/70">
                  Team Performance HQ
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
              aria-label="Close navigation"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
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
                    title={menu.name}
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
                      group relative flex w-full items-center overflow-hidden rounded-xl border p-3
                      transition-all duration-300
                      ${
                        collapsed
                          ? "justify-center"
                          : "gap-3"
                      }
                      ${
                        location.pathname ===
                        menu.path
                          ? "border-white/20 bg-white text-emerald-950 shadow-lg shadow-emerald-950/20"
                          : "border-transparent text-white/80 hover:border-white/10 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {location.pathname ===
                      menu.path && (
                      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />
                    )}

                    <Icon
                      size={22}
                      className="min-w-[22px] transition group-hover:scale-105"
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
      rounded-2xl border border-white/10 bg-white/10 p-3
      backdrop-blur-md flex items-center
      transition cursor-pointer
      hover:border-white/20 hover:bg-white/15
      ${
        collapsed
          ? "justify-center"
          : "gap-3"
      }
    `}
  >
    

  {/* AVATAR */}
<div className="flex h-12 w-12 min-w-[48px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-bold text-white shadow-md ring-2 ring-white/20">

  {profile?.avatar_url && profile.avatar_url !== "" ? (
    <img
      key={profile.avatar_url}
      src={profile.avatar_url}
      alt="avatar"
      className="h-full w-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none'; // Hide broken image
      }}
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
              aria-label="Toggle theme"
              title="Toggle theme"
              className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* HELP */}

            <button
                onClick={() =>
                  setIsHelpOpen(true)
                }
                aria-label="Open help"
                title="Help"
                className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-100 transition hover:bg-amber-400/25 hover:text-white"
              >

                <HelpCircle size={20} />

              </button>

            {/* LOGOUT */}

            <button
              onClick={() =>
                signOut()
              }
              aria-label="Sign out"
              title="Sign out"
              className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-red-100"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() =>
          setIsHelpOpen(false)
        }
      />
    </>
  );
}

export default Sidebar;
