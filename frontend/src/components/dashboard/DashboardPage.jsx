import { Link } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileBarChart2,
  FolderKanban,
  Gauge,
  Loader2,
  PlusCircle,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAuth } from "../../contexts/AuthContext";

import { getTasks } from "../../services/tasksService";
import { getProjects } from "../../services/projectsService";
import { getEvents } from "../../services/calendarService";
import { getGoals } from "../../services/goalsService";
import { getUsers } from "../../services/userService";
import {
  getNotifications,
  markNotificationAsRead as markNotificationReadService,
  markAllNotificationsAsRead,
  subscribeToNotifications,
} from "../../services/notificationsService";

const toneClasses = {
  emerald: {
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
    bar: "from-emerald-500 to-teal-400",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20",
    bar: "from-cyan-500 to-sky-400",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    bar: "from-amber-500 to-orange-400",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    badge: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
    bar: "from-rose-500 to-red-400",
  },
  indigo: {
    icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20",
    bar: "from-indigo-500 to-cyan-400",
  },
};

const taskColors = {
  Completed: "#10b981",
  "In Progress": "#0891b2",
  Pending: "#f59e0b",
  Overdue: "#ef4444",
};

function DashboardPage({ mode }) {
  const { profile } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [members, setMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const userRole = normalizeRole(profile?.role);
  const isAdmin = userRole.includes("admin");
  const isManager =
    userRole.includes("manager") || userRole.includes("team manager");
  const isMember = !isAdmin && !isManager;

  const loadDashboardData = useCallback(async (options = {}) => {
    const silent = options.silent === true;

    try {
      if (!silent) {
        setLoading(true);
      }

      setErrorMessage("");

      const [
        tasksData,
        projectsData,
        eventsData,
        goalsData,
        membersData,
      ] = await Promise.all([
        getTasks(),
        getProjects(),
        getEvents(),
        getGoals(),
        getUsers(),
      ]);

      setTasks(tasksData || []);
      setProjects(projectsData || []);
      setEvents(eventsData || []);
      setGoals(goalsData || []);
      setMembers(membersData || []);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error.message);
      setErrorMessage("Dashboard data could not be loaded. Try refreshing the page.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!profile?.id) {
      return;
    }

    try {
      const data = await getNotifications(profile.id);
      setNotifications(data || []);
    } catch (error) {
      console.error("NOTIFICATION ERROR:", error.message);
    }
  }, [profile?.id]);

  useEffect(() => {
    loadDashboardData();

    const refreshInterval = setInterval(() => {
      loadDashboardData({ silent: true });
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadDashboardData, profile?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!profile?.id) {
      return undefined;
    }

    const channel = subscribeToNotifications(profile.id, loadNotifications);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [profile?.id, loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(".notification-wrapper")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "User";

  const teamMembers = useMemo(() => {
    if (!isManager) {
      return [];
    }

    return members.filter((member) => {
      const role = normalizeRole(member.role);

      return (
        !role.includes("admin") &&
        !role.includes("manager") &&
        member.manager_id === profile?.id
      );
    });
  }, [members, profile?.id, isManager]);

  const filteredTasks = useMemo(() => {
    if (isAdmin) {
      return tasks;
    }

    if (isManager) {
      return tasks.filter((task) => {
        if (
          task.created_by === profile?.id ||
          taskBelongsToProfile(task, profile)
        ) {
          return true;
        }

        return teamMembers.some((member) => taskBelongsToProfile(task, member));
      });
    }

    return tasks.filter((task) => taskBelongsToProfile(task, profile));
  }, [tasks, profile, teamMembers, isAdmin, isManager]);

  const filteredProjects = useMemo(() => {
    if (isAdmin) {
      return projects;
    }

    if (isManager) {
      return projects.filter(
        (project) =>
          project.manager_id === profile?.id ||
          project.created_by === profile?.id
      );
    }

    return projects.filter((project) => projectBelongsToProfile(project, profile));
  }, [projects, profile, isAdmin, isManager]);

  const filteredEvents = useMemo(() => {
    if (isAdmin) {
      return events;
    }

    if (isManager) {
      return events.filter(
        (event) => !event.assigned_to || event.assigned_to === profile?.id
      );
    }

    return events.filter((event) => event.assigned_to === profile?.id);
  }, [events, profile?.id, isAdmin, isManager]);

  const filteredGoals = useMemo(() => {
    if (isAdmin) {
      return goals;
    }

    if (isManager) {
      return goals.filter(
        (goal) =>
          goal.owner_id === profile?.id ||
          goal.created_by === profile?.id
      );
    }

    return goals.filter((goal) => goal.owner_id === profile?.id);
  }, [goals, profile?.id, isAdmin, isManager]);

  const completedTasks = filteredTasks.filter(isCompleted).length;
  const inProgressTasks = filteredTasks.filter(isInProgress).length;
  const pendingTasks = filteredTasks.filter(isPending).length;
  const overdueTasks = filteredTasks.filter(isOverdue).length;
  const activeProjects = filteredProjects.filter(isActiveProject).length;

  const productivity =
    filteredTasks.length > 0
      ? Math.round((completedTasks / filteredTasks.length) * 100)
      : 0;

  const workspaceHealth = clamp(
    productivity + (activeProjects > 0 ? 8 : 0) - overdueTasks * 5
  );

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => isFutureDate(event.date))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 4);
  }, [filteredEvents]);

  const recentTasks = useMemo(() => {
    return [...filteredTasks]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5);
  }, [filteredTasks]);

  const performanceData = useMemo(() => {
    return buildPerformanceData(filteredTasks, productivity);
  }, [filteredTasks, productivity]);

  const taskData = useMemo(
    () => [
      {
        name: "Completed",
        value: completedTasks,
        color: taskColors.Completed,
      },
      {
        name: "In Progress",
        value: inProgressTasks,
        color: taskColors["In Progress"],
      },
      {
        name: "Pending",
        value: pendingTasks,
        color: taskColors.Pending,
      },
      {
        name: "Overdue",
        value: overdueTasks,
        color: taskColors.Overdue,
      },
    ],
    [completedTasks, inProgressTasks, pendingTasks, overdueTasks]
  );

  const totalTasks = taskData.reduce((sum, item) => sum + item.value, 0);

  const stats = useMemo(() => {
    if (isAdmin) {
      const nonAdminMembers = members.filter(
        (member) => !normalizeRole(member.role).includes("admin")
      ).length;

      return [
        {
          title: "People",
          value: nonAdminMembers,
          caption: `${members.length} total accounts`,
          icon: Users,
          tone: "cyan",
          progress: clamp(nonAdminMembers * 8),
        },
        {
          title: "Productivity",
          value: `${productivity}%`,
          caption: `${completedTasks} tasks completed`,
          icon: TrendingUp,
          tone: "emerald",
          progress: productivity,
        },
        {
          title: "Active Projects",
          value: activeProjects,
          caption: `${filteredProjects.length} projects tracked`,
          icon: FolderKanban,
          tone: "indigo",
          progress: filteredProjects.length
            ? clamp((activeProjects / filteredProjects.length) * 100)
            : 0,
        },
        {
          title: "Attention",
          value: overdueTasks,
          caption: overdueTasks ? "Overdue tasks need review" : "No overdue tasks",
          icon: AlertTriangle,
          tone: overdueTasks ? "rose" : "amber",
          progress: clamp(overdueTasks * 16),
        },
      ];
    }

    if (isManager) {
      return [
        {
          title: "Team Members",
          value: teamMembers.length,
          caption: "Direct reports in scope",
          icon: Users,
          tone: "cyan",
          progress: clamp(teamMembers.length * 12),
        },
        {
          title: "Projects",
          value: filteredProjects.length,
          caption: `${activeProjects} active right now`,
          icon: FolderKanban,
          tone: "indigo",
          progress: clamp(activeProjects * 18),
        },
        {
          title: "Team Tasks",
          value: filteredTasks.length,
          caption: `${completedTasks} completed`,
          icon: ClipboardList,
          tone: "emerald",
          progress: productivity,
        },
        {
          title: "Meetings",
          value: upcomingEvents.length,
          caption: `${filteredEvents.length} events on calendar`,
          icon: CalendarDays,
          tone: "amber",
          progress: clamp(upcomingEvents.length * 22),
        },
      ];
    }

    return [
      {
        title: "My Tasks",
        value: filteredTasks.length,
        caption: `${completedTasks} completed`,
        icon: CheckCircle2,
        tone: "emerald",
        progress: productivity,
      },
      {
        title: "Productivity",
        value: `${productivity}%`,
        caption: "Completion rate",
        icon: TrendingUp,
        tone: "cyan",
        progress: productivity,
      },
      {
        title: "Goals",
        value: filteredGoals.length,
        caption: "Personal targets",
        icon: Target,
        tone: "amber",
        progress: clamp(filteredGoals.length * 18),
      },
      {
        title: "Overdue",
        value: overdueTasks,
        caption: overdueTasks ? "Needs attention" : "All clear",
        icon: Clock3,
        tone: overdueTasks ? "rose" : "indigo",
        progress: clamp(overdueTasks * 18),
      },
    ];
  }, [
    isAdmin,
    isManager,
    members,
    productivity,
    completedTasks,
    activeProjects,
    filteredProjects,
    overdueTasks,
    teamMembers.length,
    filteredTasks.length,
    upcomingEvents.length,
    filteredEvents.length,
    filteredGoals.length,
  ]);

  const quickActions = useMemo(() => {
    if (isAdmin) {
      return [
        {
          label: "Add Member",
          description: "Invite or manage people",
          to: "/members",
          icon: UserPlus,
        },
        {
          label: "Create Project",
          description: "Plan a new delivery stream",
          to: "/projects",
          icon: FolderKanban,
        },
        {
          label: "Generate Report",
          description: "Export executive insights",
          to: "/reports",
          icon: FileBarChart2,
        },
      ];
    }

    if (isManager) {
      return [
        {
          label: "Assign Tasks",
          description: "Balance team workload",
          to: "/tasks",
          icon: ClipboardList,
        },
        {
          label: "Schedule Event",
          description: "Open the team calendar",
          to: "/calendar",
          icon: CalendarDays,
        },
        {
          label: "Review Reports",
          description: "Check team outcomes",
          to: "/reports",
          icon: FileBarChart2,
        },
      ];
    }

    return [
      {
        label: "Open Tasks",
        description: "Review your work queue",
        to: "/tasks",
        icon: ClipboardList,
      },
      {
        label: "View Goals",
        description: "Track target progress",
        to: "/goals",
        icon: Target,
      },
      {
        label: "Open Calendar",
        description: "See upcoming events",
        to: "/calendar",
        icon: CalendarDays,
      },
    ];
  }, [isAdmin, isManager]);

  const topPerformers = useMemo(() => {
    return members
      .filter((member) => {
        const role = normalizeRole(member.role);

        if (isAdmin) {
          return !role.includes("admin");
        }

        if (isManager) {
          return (
            !role.includes("admin") &&
            !role.includes("manager") &&
            member.manager_id === profile?.id
          );
        }

        return false;
      })
      .map((member) => {
        const memberTasks = tasks.filter((task) => taskBelongsToProfile(task, member));
        const memberCompleted = memberTasks.filter(isCompleted).length;
        const memberProductivity =
          memberTasks.length > 0
            ? Math.round((memberCompleted / memberTasks.length) * 100)
            : 0;

        return {
          id: member.id,
          name: member.full_name || member.email || "Unnamed member",
          role: member.role || "member",
          tasks: memberTasks.length,
          productivity: memberProductivity,
        };
      })
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, 5);
  }, [members, tasks, isAdmin, isManager, profile?.id]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length < 2) {
      return [];
    }

    const includesQuery = (...values) =>
      values
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    return [
      ...filteredTasks
        .filter((task) => includesQuery(task.title, task.description, task.status))
        .map((task) => ({
          id: `task-${task.id}`,
          label: task.title,
          meta: `Task - ${task.status || "No status"}`,
          to: "/tasks",
          icon: CheckCircle2,
        })),
      ...filteredProjects
        .filter((project) => includesQuery(project.name, project.description, project.status))
        .map((project) => ({
          id: `project-${project.id}`,
          label: project.name,
          meta: `Project - ${project.status || "No status"}`,
          to: "/projects",
          icon: FolderKanban,
        })),
      ...filteredGoals
        .filter((goal) => includesQuery(goal.title, goal.name, goal.status))
        .map((goal) => ({
          id: `goal-${goal.id}`,
          label: goal.title || goal.name || "Goal",
          meta: `Goal - ${goal.status || "In progress"}`,
          to: "/goals",
          icon: Target,
        })),
      ...filteredEvents
        .filter((event) => includesQuery(event.title, event.description, event.date))
        .map((event) => ({
          id: `event-${event.id}`,
          label: event.title,
          meta: `Event - ${formatDate(event.date)}`,
          to: "/calendar",
          icon: CalendarDays,
        })),
    ].slice(0, 6);
  }, [searchQuery, filteredTasks, filteredProjects, filteredGoals, filteredEvents]);

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const handleReadNotification = async (notificationId) => {
    try {
      await markNotificationReadService(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(profile?.id);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-5 pb-8">
      <section className="relative overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(135deg,rgba(4,120,87,0.96)_0%,rgba(8,94,104,0.96)_48%,rgba(113,73,24,0.92)_100%)] p-5 text-white shadow-[0_26px_80px_rgba(4,120,87,0.22)] dark:border-white/10 dark:shadow-black/40 sm:p-5">
        <div className="fine-noise absolute inset-0 opacity-20" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-emerald-50 backdrop-blur">
              <Sparkles size={14} />
              Live workspace
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              {getGreeting()}, {firstName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              {getScopeDescription(mode)}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeroChip icon={Gauge} label={`${workspaceHealth}% health`} />
              <HeroChip icon={CheckCircle2} label={`${completedTasks} completed`} />
              <HeroChip icon={CalendarDays} label={`${upcomingEvents.length} upcoming`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HeroMetric
              label="Focus Score"
              value={`${workspaceHealth}%`}
              detail="Workload balance"
              icon={Gauge}
            />
            <HeroMetric
              label="Active Work"
              value={activeProjects}
              detail="Projects moving"
              icon={FolderKanban}
            />
            <HeroMetric
              label="Open Tasks"
              value={filteredTasks.length}
              detail={`${pendingTasks + inProgressTasks} not done`}
              icon={ClipboardList}
            />
            <HeroMetric
              label="Next Event"
              value={upcomingEvents[0] ? formatDate(upcomingEvents[0].date, { month: "short", day: "numeric" }) : "None"}
              detail={upcomingEvents[0]?.title || "Calendar clear"}
              icon={CalendarDays}
            />
          </div>
        </div>
      </section>

      <div className="surface-panel relative z-20 flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tasks, projects, goals, or calendar..."
            className="focus-ring w-full rounded-xl border border-slate-200/80 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-white"
          />

          {searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    onSelect={() => setSearchQuery("")}
                  />
                ))
              ) : (
                <div className="px-4 py-5 text-sm text-slate-500 dark:text-zinc-400">
                  No matching workspace items found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="notification-wrapper relative">
            <button
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              aria-label="Open notifications"
              className="focus-ring relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onClose={() => setShowNotifications(false)}
                onRead={handleReadNotification}
                onMarkAll={handleMarkAllAsRead}
              />
            )}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                String(firstName).charAt(0).toUpperCase()
              )}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {profile?.full_name || "Workspace user"}
              </p>
              <p className="text-xs capitalize text-slate-500 dark:text-zinc-400">
                {profile?.role || "member"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="surface-panel flex items-start gap-3 border-amber-200 bg-amber-50/90 p-4 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Panel
          title="Productivity Overview"
          description="Recent completion quality across your current scope."
          icon={TrendingUp}
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient
                    id={`performance-${mode}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.35)"
                />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(148, 163, 184, 0.28)",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="performance"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill={`url(#performance-${mode})`}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Task Mix"
          description="Current delivery status breakdown."
          icon={CheckCircle2}
        >
          {totalTasks > 0 ? (
            <>
              <div className="h-[245px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskData.filter((item) => item.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={96}
                      paddingAngle={4}
                    >
                      {taskData
                        .filter((item) => item.value > 0)
                        .map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}

                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;

                          return (
                            <text
                              x={cx}
                              y={cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={cx}
                                dy={0}
                                className="fill-slate-900 text-3xl font-bold dark:fill-white"
                              >
                                {totalTasks}
                              </tspan>
                              <tspan
                                x={cx}
                                dy={24}
                                className="fill-slate-500 text-sm"
                              >
                                Tasks
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 space-y-3">
                {taskData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-600 dark:text-zinc-300">
                        {item.name}
                      </span>
                    </div>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No tasks yet"
              message="Task activity will appear here once work is assigned."
            />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title={
            mode === "admin"
              ? "Recent Member Activity"
              : mode === "manager"
                ? "Recent Team Activity"
                : "Recent Tasks"
          }
          actionLabel="View Tasks"
          to="/tasks"
          icon={Activity}
        >
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <ListItem
                  key={task.id}
                  title={task.title || "Untitled task"}
                  meta={`${getTaskOwnerLabel(task)} - ${task.status || "No status"}`}
                  icon={CheckCircle2}
                  trailing={<PriorityBadge priority={task.priority} />}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No recent activity"
              message="Fresh task movement will show up here."
            />
          )}
        </Panel>

        {isMember ? (
          <ActionList actions={quickActions} />
        ) : (
          <Panel
            title={mode === "admin" ? "Top Performers" : "Top Team Performers"}
            actionLabel="Open Performance"
            to="/performance"
            icon={Users}
          >
            {topPerformers.length > 0 ? (
              <div className="space-y-3">
                {topPerformers.map((person, index) => (
                  <ListItem
                    key={person.id}
                    title={person.name}
                    meta={`${person.role} - ${person.tasks} tasks`}
                    icon={Users}
                    badge={`#${index + 1}`}
                    trailing={
                      <div className="text-right">
                        <p className="font-bold text-emerald-600 dark:text-emerald-300">
                          {person.productivity}%
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500">
                          productivity
                        </p>
                      </div>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No ranking data"
                message="Performance rankings appear after tasks are assigned."
              />
            )}
          </Panel>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <Panel
          title="Upcoming Events"
          actionLabel="Open Calendar"
          to="/calendar"
          icon={CalendarDays}
        >
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <ListItem
                  key={event.id}
                  title={event.title || "Calendar event"}
                  meta={`${formatDate(event.date)}${event.time ? ` - ${event.time}` : ""}`}
                  icon={CalendarDays}
                  trailing={<PriorityBadge priority={event.priority || "Medium"} />}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Calendar is clear"
              message="Upcoming meetings and milestones will appear here."
            />
          )}
        </Panel>

        {!isMember && <ActionList actions={quickActions} />}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      <div className="surface-panel min-h-[220px] animate-pulse p-5">
        <div className="h-8 w-44 rounded-full bg-slate-200 dark:bg-zinc-800" />
        <div className="mt-8 h-10 w-2/3 rounded-full bg-slate-200 dark:bg-zinc-800" />
        <div className="mt-4 h-4 w-1/2 rounded-full bg-slate-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="surface-panel h-36 animate-pulse p-5">
            <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-zinc-800" />
            <div className="mt-6 h-9 w-20 rounded-full bg-slate-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="flex min-h-[180px] items-center justify-center text-slate-500 dark:text-zinc-400">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading dashboard...
      </div>
    </div>
  );
}

function HeroChip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
      <Icon size={16} />
      {label}
    </span>
  );
}

function HeroMetric({ label, value, detail, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800">
        <Icon size={18} />
      </div>
      <p className="text-xs font-semibold uppercase text-emerald-50/75">
        {label}
      </p>
      <p className="mt-1 truncate text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 truncate text-xs text-emerald-50/70">{detail}</p>
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  const tone = toneClasses[stat.tone] || toneClasses.emerald;

  return (
    <div className="surface-panel hover-lift overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {stat.title}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
            {stat.value}
          </h2>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.icon}`}>
          <Icon size={23} />
        </div>
      </div>

      <p className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone.badge}`}>
        {stat.caption}
      </p>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`}
          style={{ width: `${clamp(stat.progress)}%` }}
        />
      </div>
    </div>
  );
}

function Panel({
  title,
  description,
  actionLabel,
  to,
  icon: Icon,
  children,
}) {
  return (
    <section className="surface-panel p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Icon size={18} />
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
        </div>

        {to && actionLabel && (
          <Link
            to={to}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
          >
            {actionLabel}
            <ArrowUpRight size={15} />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}

function ActionList({ actions }) {
  return (
    <Panel title="Quick Actions" description="Shortcuts for the next useful move." icon={PlusCircle}>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-white group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-900">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {action.label}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-zinc-400">
                    {action.description}
                  </span>
                </span>
              </span>

              <ArrowUpRight
                size={17}
                className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600"
              />
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

function ListItem({
  title,
  meta,
  icon: Icon,
  trailing,
  badge,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/70 p-3 transition hover:border-emerald-100 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-900/60">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
          <Icon size={18} />
          {badge && (
            <span className="absolute -right-2 -top-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
              {badge}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="truncate text-sm text-slate-500 dark:text-zinc-400">
            {meta}
          </p>
        </div>
      </div>

      <div className="shrink-0">{trailing}</div>
    </div>
  );
}

function SearchResult({ result, onSelect }) {
  const Icon = result.icon;

  return (
    <Link
      to={result.to}
      onClick={onSelect}
      className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-emerald-50 dark:border-zinc-800 dark:hover:bg-emerald-950/20"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
          {result.label}
        </span>
        <span className="block truncate text-xs text-slate-500 dark:text-zinc-400">
          {result.meta}
        </span>
      </span>
    </Link>
  );
}

function NotificationPanel({
  notifications,
  unreadCount,
  onClose,
  onRead,
  onMarkAll,
}) {
  return (
    <div className="absolute right-0 top-14 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <h3 className="font-semibold text-slate-950 dark:text-white">
            Notifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {unreadCount} unread
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="focus-ring rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          <X size={16} />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            message="You are all caught up."
            compact
          />
        ) : (
          notifications.map((notification) => (
            <button
              type="button"
              key={notification.id}
              onClick={() => onRead(notification.id)}
              className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900 ${
                notification.is_read ? "" : "bg-emerald-50/60 dark:bg-emerald-950/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${getNotificationTone(notification.type)}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                    {notification.title}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500 dark:text-zinc-400">
                    {notification.message}
                  </span>
                  <span className="mt-2 block text-xs text-slate-400 dark:text-zinc-500">
                    {formatDateTime(notification.created_at)}
                  </span>
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 p-3 dark:border-zinc-800">
        <button
          type="button"
          onClick={onMarkAll}
          disabled={unreadCount === 0}
          className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
  compact = false,
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center dark:border-zinc-800 dark:bg-zinc-900/40 ${compact ? "m-4 p-5" : "min-h-[220px] p-5"}`}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
        <Icon size={22} />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-zinc-400">
        {message}
      </p>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const value = priority || "Normal";
  const classes = {
    High: "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20",
    Medium: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20",
    Low: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20",
    Normal: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${classes[value] || classes.Normal}`}>
      {value}
    </span>
  );
}

function normalizeRole(role) {
  return String(role || "").toLowerCase().trim();
}

function normalizeStatus(status) {
  return String(status || "").toLowerCase().trim();
}

function isCompleted(item) {
  return normalizeStatus(item?.status) === "completed";
}

function isInProgress(item) {
  return normalizeStatus(item?.status) === "in progress";
}

function isPending(item) {
  return normalizeStatus(item?.status) === "pending";
}

function isOverdue(task) {
  if (!task?.due_date || isCompleted(task)) {
    return false;
  }

  const dueDate = new Date(task.due_date);

  return !Number.isNaN(dueDate.getTime()) && dueDate < startOfToday();
}

function isActiveProject(project) {
  const status = normalizeStatus(project?.status);
  return status !== "completed" && status !== "archived";
}

function isFutureDate(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date >= startOfToday();
}

function taskBelongsToProfile(task, person) {
  if (!task || !person) {
    return false;
  }

  const personValues = [person.id, person.email, person.full_name]
    .filter(Boolean)
    .map(String);

  const taskValues = [
    task.assignee_id,
    task.assigned_to,
    task.assigned_to_email,
    task.assignee,
    ...(task.task_assignees || []).flatMap((assignee) => [
      assignee.user_id,
      assignee.profiles?.id,
      assignee.profiles?.email,
      assignee.profiles?.full_name,
    ]),
  ]
    .filter(Boolean)
    .map(String);

  return taskValues.some((value) => personValues.includes(value));
}

function projectBelongsToProfile(project, person) {
  if (!project || !person) {
    return false;
  }

  return (
    project.manager_id === person.id ||
    project.created_by === person.id ||
    project.member_id === person.id ||
    (project.project_members || []).some(
      (member) =>
        member.user_id === person.id ||
        member.profiles?.id === person.id
    )
  );
}

function buildPerformanceData(tasks, fallbackProductivity) {
  const today = startOfToday();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (5 - index));

    const dayTasks = tasks.filter((task) => {
      const rawDate = task.updated_at || task.created_at || task.due_date;
      if (!rawDate) {
        return false;
      }

      const taskDate = new Date(rawDate);
      return !Number.isNaN(taskDate.getTime()) && isSameDay(taskDate, date);
    });

    const completed = dayTasks.filter(isCompleted).length;

    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      performance:
        dayTasks.length > 0
          ? Math.round((completed / dayTasks.length) * 100)
          : fallbackProductivity,
    };
  });
}

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function clamp(value) {
  const number = Number(value) || 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

function getScopeDescription(mode) {
  if (mode === "admin") {
    return "A polished command view of team capacity, delivery health, and organization-wide activity.";
  }

  if (mode === "manager") {
    return "A focused view for tracking team momentum, task ownership, project delivery, and upcoming meetings.";
  }

  return "Your personal workspace for tasks, goals, productivity, and the next moments that need attention.";
}

function getTaskOwnerLabel(task) {
  if (task?.creator?.full_name) {
    return task.creator.full_name;
  }

  if (task?.assignee) {
    return task.assignee;
  }

  const assignee = task?.task_assignees?.[0]?.profiles?.full_name;
  return assignee || "Unassigned";
}

function getNotificationTone(type) {
  const tone = String(type || "").toLowerCase();

  if (tone === "warning") {
    return "bg-rose-500";
  }

  if (tone === "success") {
    return "bg-emerald-500";
  }

  if (tone === "event") {
    return "bg-cyan-500";
  }

  return "bg-indigo-500";
}

function formatDate(value, options = { month: "short", day: "numeric" }) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, options);
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default DashboardPage;
