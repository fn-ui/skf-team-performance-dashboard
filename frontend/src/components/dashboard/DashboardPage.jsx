import { Link } from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Search,
  Target,
  TrendingUp,
  Users,
  X,
  CheckCheck,
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
  blue:
    "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",

  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",

  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",

  amber:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
};

function DashboardPage({ mode }) {
  const { profile } = useAuth();

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [events, setEvents] =
    useState([]);

  const [goals, setGoals] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    // ========================================
// NOTIFICATIONS
// ========================================
const [
  showNotifications,
  setShowNotifications,
] = useState(false);



// ========================================
// AUTO REFRESH
// ========================================

useEffect(() => {
  const refreshInterval =
    setInterval(() => {
      loadDashboardData();
    }, 30000);

  return () => {
    clearInterval(refreshInterval);
  };
}, [profile?.id]);

  // ========================================
  // ROLE DETECTION
  // ========================================

  const userRole = String(
    profile?.role || ""
  )
    .toLowerCase()
    .trim();

  const isAdmin =
    userRole.includes("admin");

  const isManager =
    userRole.includes(
      "manager"
    ) ||
    userRole.includes(
      "team manager"
    );

  const isMember =
    !isAdmin && !isManager;

  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData =
    async () => {
      try {
        setLoading(true);

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

        setProjects(
          projectsData || []
        );

        setEvents(eventsData || []);

        setGoals(goalsData || []);

        setMembers(
          membersData || []
        );

        console.log(
            "Dashboard refreshed at:",
            new Date().toLocaleTimeString()
          );

        console.log(
          "TASKS:",
          tasksData
        );

        console.log(
          "MEMBERS:",
          membersData
        );

        console.log(
          "PROFILE:",
          profile
        );
      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  // ========================================
  // USER INFO
  // ========================================

  const firstName =
    profile?.full_name?.split(
      " "
    )[0] || "User";

  // ========================================
  // TEAM MEMBERS
  // ========================================

  const teamMembers = useMemo(() => {
    if (!isManager)
      return [];

    return members.filter(
      (member) => {
        const role = String(
          member.role || ""
        )
          .toLowerCase()
          .trim();

        return (
          !role.includes(
            "admin"
          ) &&
          !role.includes(
            "manager"
          ) &&
          member.manager_id ===
            profile?.id
        );
      }
    );
  }, [
    members,
    profile,
    isManager,
  ]);

  // ========================================
  // FILTER TASKS
  // ========================================

  const filteredTasks =
    useMemo(() => {
      // ADMIN
      if (isAdmin) {
        return tasks;
      }

      // MANAGER
      if (isManager) {
        return tasks.filter(
          (task) => {
            // DIRECT TASKS
            const isMine =
              task.created_by ===
                profile?.id ||
              task.assigned_to ===
                profile?.id ||
              task.assigned_to_email ===
                profile?.email ||
              task.assignee ===
                profile?.full_name;

            if (isMine)
              return true;

            // TEAM TASKS
            const assignedMember =
              teamMembers.find(
                (member) =>
                  member.id ===
                    task.assigned_to ||
                  member.email ===
                    task.assigned_to_email ||
                  member.full_name ===
                    task.assignee
              );

            return !!assignedMember;
          }
        );
      }

      // MEMBER
      return tasks.filter(
        (task) =>
          task.assigned_to ===
            profile?.id ||
          task.assigned_to_email ===
            profile?.email ||
          task.assignee ===
            profile?.full_name
      );
    }, [
      tasks,
      profile,
      teamMembers,
      isAdmin,
      isManager,
    ]);

  // ========================================
  // FILTER PROJECTS
  // ========================================

  const filteredProjects =
    useMemo(() => {
      if (isAdmin)
        return projects;

      if (isManager) {
        return projects.filter(
          (project) =>
            project.manager_id ===
              profile?.id ||
            project.created_by ===
              profile?.id
        );
      }

      return projects.filter(
        (project) =>
          project.member_id ===
            profile?.id
      );
    }, [
      projects,
      profile,
      isAdmin,
      isManager,
    ]);

  // ========================================
  // FILTER EVENTS
  // ========================================

  const filteredEvents =
    useMemo(() => {
      if (isAdmin)
        return events;

      if (isManager) {
        return events.filter(
          (event) =>
            !event.assigned_to ||
            event.assigned_to ===
              profile?.id
        );
      }

      return events.filter(
        (event) =>
          event.assigned_to ===
            profile?.id
      );
    }, [
      events,
      profile,
      isAdmin,
      isManager,
    ]);

  // ========================================
  // FILTER GOALS
  // ========================================

  const filteredGoals =
    useMemo(() => {
      if (isAdmin)
        return goals;

      if (isManager) {
        return goals.filter(
          (goal) =>
            goal.owner_id ===
              profile?.id ||
            goal.created_by ===
              profile?.id
        );
      }

      return goals.filter(
        (goal) =>
          goal.owner_id ===
          profile?.id
      );
    }, [
      goals,
      profile,
      isAdmin,
      isManager,
    ]);

  // ========================================
  // TASK STATS
  // ========================================

  const completedTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const inProgressTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    ).length;

  const pendingTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "Pending"
    ).length;

  const overdueTasks =
    filteredTasks.filter(
      (task) => {
        if (!task.due_date)
          return false;

        return (
          new Date(
            task.due_date
          ) < new Date() &&
          task.status !==
            "Completed"
        );
      }
    ).length;

  // ========================================
  // PRODUCTIVITY
  // ========================================

  const productivity =
    filteredTasks.length > 0
      ? Math.round(
          (completedTasks /
            filteredTasks.length) *
            100
        )
      : 0;

  // ========================================
  // UPCOMING EVENTS
  // ========================================

  const upcomingEvents =
    filteredEvents
      .filter((event) => {
        if (!event.date)
          return false;

        return (
          new Date(
            event.date
          ) >= new Date()
        );
      })
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      )
      .slice(0, 4);

  // ========================================
  // RECENT TASKS
  // ========================================

  const recentTasks =
    [...filteredTasks]
      .sort(
        (a, b) =>
          new Date(
            b.created_at
          ) -
          new Date(
            a.created_at
          )
      )
      .slice(0, 5);

  // ========================================
  // PERFORMANCE DATA
  // ========================================

  const performanceData =
    [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ].map((day) => ({
      day,
      performance:
        productivity,
    }));

  // ========================================
  // PIE CHART DATA
  // ========================================

  const taskData = [
    {
      name: "Completed",
      value: completedTasks,
      color: "#10b981",
    },

    {
      name: "In Progress",
      value: inProgressTasks,
      color: "#3b82f6",
    },

    {
      name: "Pending",
      value: pendingTasks,
      color: "#f59e0b",
    },

    {
      name: "Overdue",
      value: overdueTasks,
      color: "#ef4444",
    },
  ];

  const totalTasks =
    taskData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  // ========================================
  // TOTAL MEMBERS
  // ========================================

  const totalMembers =
    teamMembers.length;

  // ========================================
  // DASHBOARD STATS
  // ========================================

  const stats = useMemo(() => {
    // ADMIN
    if (isAdmin) {
      return [
        {
          title:
            "Total Members",

          value:
            members.filter(
              (member) => {
                const role =
                  String(
                    member.role ||
                      ""
                  )
                    .toLowerCase()
                    .trim();

                return !role.includes(
                  "admin"
                );
              }
            ).length,

          change: "+12%",

          icon: Users,

          tone: "blue",
        },

        {
          title:
            "Productivity",

          value: `${productivity}%`,

          change: "+8%",

          icon:
            TrendingUp,

          tone: "emerald",
        },

        {
          title:
            "Projects",

          value:
            projects.length,

          change: "+2",

          icon:
            FolderKanban,

          tone: "violet",
        },

        {
          title: "Goals",

          value:
            goals.length,

          change: "+5",

          icon: Target,

          tone: "amber",
        },
      ];
    }

    // MANAGER
    if (isManager) {
      return [
        {
          title:
            "Team Members",

          value:
            totalMembers,

          change: "+2",

          icon: Users,

          tone: "blue",
        },

        {
          title:
            "My Projects",

          value:
            filteredProjects.length,

          change: "+1",

          icon:
            FolderKanban,

          tone: "emerald",
        },

        {
          title:
            "Team Tasks",

          value:
            filteredTasks.length,

          change: "+6%",

          icon:
            CheckCircle2,

          tone: "violet",
        },

        {
          title:
            "Meetings",

          value:
            filteredEvents.length,

          change: "+2",

          icon:
            CalendarDays,

          tone: "amber",
        },
      ];
    }

    // MEMBER
    return [
      {
        title:
          "My Tasks",

        value:
          filteredTasks.length,

        change: "+4",

        icon:
          CheckCircle2,

        tone: "emerald",
      },

      {
        title:
          "Productivity",

        value: `${productivity}%`,

        change: "+8%",

        icon:
          TrendingUp,

        tone: "violet",
      },

      {
        title: "Goals",

        value:
          filteredGoals.length,

        change: "+2",

        icon: Target,

        tone: "amber",
      },

      {
        title:
          "Overdue",

        value:
          overdueTasks,

        change: "-1",

        icon: Clock3,

        tone: "blue",
      },
    ];
  }, [
    isAdmin,
    isManager,
    members,
    projects,
    goals,
    productivity,
    filteredProjects,
    filteredTasks,
    filteredGoals,
    filteredEvents,
    overdueTasks,
    totalMembers,
  ]);

  // ========================================
  // QUICK ACTIONS
  // ========================================

  const quickActions =
    isAdmin
      ? [
          {
            label:
              "Add Member",
            to: "/members",
          },

          {
            label:
              "Create Project",
            to: "/projects",
          },

          {
            label:
              "Generate Report",
            to: "/reports",
          },
        ]
      : isManager
      ? [
          {
            label:
              "Assign Tasks",
            to: "/tasks",
          },

          {
            label:
              "Open Calendar",
            to: "/calendar",
          },

          {
            label:
              "Review Reports",
            to: "/reports",
          },
        ]
      : [
          {
            label:
              "Open My Tasks",
            to: "/tasks",
          },

          {
            label:
              "View Goals",
            to: "/goals",
          },

          {
            label:
              "Open Calendar",
            to: "/calendar",
          },
        ];

        // ========================================
// ========================================
// NOTIFICATIONS
// ========================================

const [
  notifications,
  setNotifications,
] = useState([]);

// ========================================
// LOAD NOTIFICATIONS
// ========================================

useEffect(() => {
  if (!profile?.id)
    return;

  loadNotifications();
}, [profile?.id]);

const loadNotifications =
  async () => {
    try {
      const data =
        await getNotifications(
          profile?.id
        );

      setNotifications(
        data || []
      );
    } catch (error) {
      console.error(
        "NOTIFICATION ERROR:",
        error.message
      );
    }
  };

// ========================================
// REALTIME SUBSCRIPTION
// ========================================

useEffect(() => {
  if (!profile?.id)
    return;

  const channel =
    subscribeToNotifications(
      profile.id,
      () => {
        loadNotifications();
      }
    );

  return () => {
    if (channel) {
      channel.unsubscribe();
    }
  };
}, [profile?.id]);

// ========================================
// UNREAD COUNT
// ========================================

const unreadCount =
  notifications.filter(
    (notification) =>
      !notification.is_read
  ).length;

// ========================================
// MARK SINGLE AS READ
// ========================================

const handleReadNotification =
  async (
    notificationId
  ) => {
    try {
      await markNotificationReadService(notificationId);

      setNotifications(
        (prev) =>
          prev.map((n) =>
            n.id ===
            notificationId
              ? {
                  ...n,
                  is_read: true,
                }
              : n
          )
      );
    } catch (error) {
      console.error(error);
    }
  };

// ========================================
// MARK ALL AS READ
// ========================================

const handleMarkAllAsRead =
  async () => {
    try {
      await markAllNotificationsAsRead(
        profile?.id
      );

      setNotifications(
        (prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
          }))
      );
    } catch (error) {
      console.error(error);
    }
  };

// ========================================
// CLOSE DROPDOWN OUTSIDE CLICK
// ========================================

useEffect(() => {
  const handleClickOutside =
    (event) => {
      if (
        !event.target.closest(
          ".notification-wrapper"
        )
      ) {
        setShowNotifications(
          false
        );
      }
    };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
  // ========================================
  // TOP PERFORMERS
  // ========================================

  const topPerformers =
    members
      .filter((member) => {
        const role = String(
          member.role || ""
        )
          .toLowerCase()
          .trim();

        // ADMIN
        if (isAdmin) {
          return !role.includes(
            "admin"
          );
        }

        // MANAGER
        if (isManager) {
          return (
            !role.includes(
              "admin"
            ) &&
            !role.includes(
              "manager"
            ) &&
            member.manager_id ===
              profile?.id
          );
        }

        return false;
      })

      .map((member) => {
        const memberTasks =
          tasks.filter(
            (task) =>
              task.assigned_to ===
                member.id ||
              task.assigned_to_email ===
                member.email ||
              task.assignee ===
                member.full_name
          );

        const completed =
          memberTasks.filter(
            (task) =>
              task.status ===
              "Completed"
          ).length;

        const memberProductivity =
          memberTasks.length > 0
            ? Math.round(
                (completed /
                  memberTasks.length) *
                  100
              )
            : 0;

        return {
          id: member.id,

          name:
            member.full_name,

          role:
            member.role,

          tasks:
            memberTasks.length,

          productivity:
            memberProductivity,
        };
      })

      .sort(
        (a, b) =>
          b.productivity -
          a.productivity
      )

      .slice(0, 5);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="p-10 dark:text-white">
        <div className="flex items-center justify-center min-h-[60vh]">
  <div className="flex flex-col items-center gap-3">
    <div className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Loading dashboard...
    </p>
  </div>
</div>
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

            {getGreeting()},
            {" "}
            {firstName}

          </h1>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">

            {
              mode === "admin"
                ? "System-wide overview of organization activity."
                : mode === "manager"
                ? "Overview of your team activity and assigned work."
                : "Track your tasks, goals and productivity."
            }

          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="relative hidden sm:block">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search workspace..."
              className="w-72 rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />

          </div>

          <div className="relative">
  <button
    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }
    className="relative rounded-xl border border-slate-200 bg-white p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
  >
    <Bell
      size={20}
      className="text-slate-700 dark:text-slate-300"
    />

    {unreadCount > 0 && (
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
        {unreadCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Notifications
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {unreadCount} unread
          </p>
        </div>

        <button
          onClick={() =>
            setShowNotifications(
              false
            )
          }
          className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X
            size={16}
            className="text-slate-500"
          />
        </button>
      </div>

      {/* CONTENT */}

      <div className="max-h-[450px] overflow-y-auto">
        
        {notifications.length ===
        0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No notifications available.
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <div
                      key={
                        notification.id
                      }
                      onClick={() =>
                        markNotificationAsRead(
                          notification.id
                        )
                      }
                className="border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  
                  <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
    
                    <span
                      className={`h-2 w-2 rounded-full ${
                        notification.type ===
                        "warning"
                          ? "bg-red-500"
                          : notification.type ===
                            "success"
                          ? "bg-emerald-500"
                          : notification.type ===
                            "event"
                          ? "bg-blue-500"
                          : "bg-violet-500"
                      }`}
                    />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {
                        notification.title
                      }
                    </h4>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {
                        notification.message
                      }
                    </p>

                    <span className="mt-2 block text-xs text-slate-400">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </span>
                  </div>

                  {notification.unread && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* FOOTER */}

      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <button onClick={handleMarkAllAsRead} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          
          <CheckCheck size={16} />

          Mark all as read
        </button>
      </div>
    </div>
  )}
</div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">

            {String(firstName)
              .charAt(0)
              .toUpperCase()}

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            stat={stat}
          />
        ))}

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

        {/* AREA CHART */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">

              Productivity Overview

            </h2>

            <p className="text-sm text-slate-500 dark:text-zinc-400">

              Weekly productivity trend.

            </p>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  performanceData
                }
              >

                <defs>

                  <linearGradient
                    id={`performance-${mode}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#10b981"
                      stopOpacity={
                        0.5
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="#10b981"
                      stopOpacity={
                        0.03
                      }
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="day" />

                <YAxis
                  domain={[
                    0,
                    100,
                  ]}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="performance"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill={`url(#performance-${mode})`}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* PIE CHART */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">

            Tasks Overview

          </h2>

          <div className="mt-4 h-[240px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={taskData.filter(
                    (item) =>
                      item.value > 0
                  )}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={3}
                >

                  {taskData
                    .filter(
                      (item) =>
                        item.value >
                        0
                    )
                    .map((entry) => (
                      <Cell
                        key={
                          entry.name
                        }
                        fill={
                          entry.color
                        }
                      />
                    ))}

                  <Label
                    content={({
                      viewBox,
                    }) => {
                      const {
                        cx,
                        cy,
                      } = viewBox;

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
                            className="fill-slate-900 dark:fill-white text-3xl font-bold"
                          >
                            {
                              totalTasks
                            }
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

          <div className="mt-6 space-y-3">

            {taskData.map(
              (item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span className="text-sm text-slate-600 dark:text-zinc-300">
                      {item.name}
                    </span>

                  </div>

                  <span className="font-semibold dark:text-white">
                    {item.value}
                  </span>

                </div>
              )
            )}

          </div>

        </section>

      </div>

      {/* ACTIVITY + TOP PERFORMERS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ACTIVITY */}
        <Panel
          title={
            mode === "admin"
              ? "Recent Member Activity"
              : mode ===
                "manager"
              ? "Recent Team Activity"
              : "Recent Tasks"
          }
          actionLabel="View Tasks"
          to="/tasks"
        >

          <div className="space-y-4">

            {recentTasks.map(
              (task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800"
                >

                  <div>

                    <h3 className="font-semibold dark:text-white">
                      {
                        task.title
                      }
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-zinc-400">

                      {mode ===
                      "member"
                        ? task.status
                        : `${
                            task.assignee ||
                            "Unassigned"
                          } • ${
                            task.status
                          }`}

                    </p>

                  </div>

                  <PriorityBadge
                    priority={
                      task.priority
                    }
                  />

                </div>
              )
            )}

          </div>

        </Panel>

        {/* TOP PERFORMERS / QUICK ACTIONS */}
        {(mode === "admin" ||
          mode ===
            "manager") ? (

          <Panel
            title={
              mode ===
              "admin"
                ? "Top Performers"
                : "Top Team Performers"
            }
            actionLabel="Open Perfomance"
            to="/performance"
          >

            <div className="space-y-4">

              {topPerformers.map(
                (person) => (
                  <div
                    key={
                      person.id
                    }
                    className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800"
                  >

                    <div>

                      <h3 className="font-semibold dark:text-white">
                        {
                          person.name
                        }
                      </h3>

                      <p className="text-sm capitalize text-slate-500 dark:text-zinc-400">
                        {
                          person.role
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-emerald-600">

                        {
                          person.productivity
                        }
                        %

                      </p>

                      <p className="text-xs text-slate-500">

                        {
                          person.tasks
                        }
                        {" "}
                        tasks

                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          </Panel>

        ) : (

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">

              Quick Actions

            </h2>

            <div className="mt-5 space-y-3">

              {quickActions.map(
                (action) => (
                  <Link
                    key={
                      action.label
                    }
                    to={action.to}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-500/10"
                  >

                    {
                      action.label
                    }

                    <ArrowUpRight
                      size={16}
                    />

                  </Link>
                )
              )}

            </div>

          </section>

        )}

      </div>

      {/* EVENTS + QUICK ACTIONS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">

        <Panel
          title="Upcoming Events"
          actionLabel="Open Calendar"
          to="/calendar"
        >

          <div className="space-y-4">

            {upcomingEvents.map(
              (event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800"
                >

                  <div>

                    <h3 className="font-semibold dark:text-white">

                      {
                        event.title
                      }

                    </h3>

                    <p className="text-sm text-slate-500 dark:text-zinc-400">

                      {event.date}
                      {" "}
                      •
                      {" "}
                      {event.time}

                    </p>

                  </div>

                  <PriorityBadge
                    priority={
                      event.priority
                    }
                  />

                </div>
              )
            )}

          </div>

        </Panel>

        {(mode === "admin" ||
          mode ===
            "manager") && (

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">

              Quick Actions

            </h2>

            <div className="mt-5 space-y-3">

              {quickActions.map(
                (action) => (
                  <Link
                    key={
                      action.label
                    }
                    to={action.to}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-500/10"
                  >

                    {
                      action.label
                    }

                    <ArrowUpRight
                      size={16}
                    />

                  </Link>
                )
              )}

            </div>

          </section>

        )}

      </div>

    </div>
  );
}

function getGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12)
    return "Good Morning";

  if (hour < 18)
    return "Good Afternoon";

  return "Good Evening";
}

function StatCard({
  stat,
}) {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-sm text-slate-500 dark:text-zinc-400">

            {stat.title}

          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">

            {stat.value}

          </h2>

          <p className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">

            <Activity
              size={13}
              className="mr-1"
            />

            {stat.change}

          </p>

        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[stat.tone]}`}
        >

          <Icon size={24} />

        </div>

      </div>

    </div>
  );
}

function Panel({
  title,
  actionLabel,
  to,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="mb-5 flex items-center justify-between gap-3">

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">

          {title}

        </h2>

        <Link
          to={to}
          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-300"
        >

          {actionLabel}

        </Link>

      </div>

      {children}

    </section>
  );
}

function PriorityBadge({
  priority,
}) {
  const classes = {
    High:
      "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",

    Medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",

    Low:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        classes[
          priority
        ] ||
        "bg-slate-100 text-slate-700"
      }`}
    >

      {priority}

    </span>
  );
}

export default DashboardPage;