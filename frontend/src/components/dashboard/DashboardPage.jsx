import { Link } from "react-router-dom";
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

const roleContent = {
  admin: {
    fallbackName: "Admin",
    subtitle: "Company-wide performance, workload, and team activity.",
    stats: [
      { title: "Total Members", value: "48", change: "+12%", icon: Users, tone: "blue" },
      { title: "Company Productivity", value: "87%", change: "+8%", icon: TrendingUp, tone: "emerald" },
      { title: "Active Projects", value: "12", change: "+2", icon: FolderKanban, tone: "violet" },
      { title: "Open Goals", value: "19", change: "+5", icon: Target, tone: "amber" },
    ],
    chartTitle: "Company Performance",
    taskTitle: "Tasks by Status",
    performanceData: [
      { day: "Mon", performance: 64 },
      { day: "Tue", performance: 72 },
      { day: "Wed", performance: 81 },
      { day: "Thu", performance: 76 },
      { day: "Fri", performance: 89 },
    ],
    taskData: [
      { name: "Completed", value: 156, color: "#10b981" },
      { name: "In Progress", value: 78, color: "#3b82f6" },
      { name: "Pending", value: 42, color: "#f59e0b" },
      { name: "Overdue", value: 24, color: "#ef4444" },
    ],
    activityTitle: "Recent Activity",
    activities: [
      { person: "Faith", action: "completed the SKF dashboard UI", time: "2 mins ago" },
      { person: "Brian", action: "created a new project", time: "15 mins ago" },
      { person: "Mercy", action: "updated team goals", time: "30 mins ago" },
      { person: "Kevin", action: "flagged a project deadline", time: "1 hour ago" },
    ],
    peopleTitle: "Top Performers",
    people: [
      { name: "Faith", role: "Frontend Developer", tasks: 34, productivity: "96%" },
      { name: "Brian", role: "Backend Developer", tasks: 29, productivity: "91%" },
      { name: "Mercy", role: "UI/UX Designer", tasks: 25, productivity: "88%" },
      { name: "Kevin", role: "Project Manager", tasks: 21, productivity: "84%" },
    ],
    deadlines: [
      { title: "SKF Dashboard Redesign", due: "Today", priority: "High" },
      { title: "Mobile App Testing", due: "Tomorrow", priority: "Medium" },
      { title: "Backend API Integration", due: "June 15", priority: "High" },
    ],
    actions: [
      { label: "Add Team Member", to: "/members" },
      { label: "Create Project", to: "/projects" },
      { label: "Generate Report", to: "/reports" },
    ],
  },
  manager: {
    fallbackName: "Manager",
    subtitle: "Team performance, deadlines, and delivery health.",
    stats: [
      { title: "Team Members", value: "12", change: "+2", icon: Users, tone: "blue" },
      { title: "Tasks Completed", value: "86", change: "+14%", icon: CheckCircle2, tone: "emerald" },
      { title: "Team Productivity", value: "91%", change: "+6%", icon: TrendingUp, tone: "violet" },
      { title: "Upcoming Reviews", value: "4", change: "+1", icon: CalendarDays, tone: "amber" },
    ],
    chartTitle: "Team Performance",
    taskTitle: "Team Tasks",
    performanceData: [
      { day: "Mon", performance: 35 },
      { day: "Tue", performance: 50 },
      { day: "Wed", performance: 72 },
      { day: "Thu", performance: 66 },
      { day: "Fri", performance: 91 },
    ],
    taskData: [
      { name: "Completed", value: 82, color: "#10b981" },
      { name: "In Progress", value: 24, color: "#3b82f6" },
      { name: "Pending", value: 18, color: "#f59e0b" },
      { name: "Overdue", value: 7, color: "#ef4444" },
    ],
    activityTitle: "Team Activity",
    activities: [
      { person: "Brian", action: "completed the UI redesign task", time: "10 mins ago" },
      { person: "Faith", action: "updated the analytics module", time: "35 mins ago" },
      { person: "Kevin", action: "submitted the weekly report", time: "1 hour ago" },
      { person: "Mercy", action: "resolved pending bugs", time: "2 hours ago" },
    ],
    peopleTitle: "Top Team Members",
    people: [
      { name: "Faith", role: "Frontend Developer", tasks: 28, productivity: "96%" },
      { name: "Brian", role: "Backend Developer", tasks: 24, productivity: "91%" },
      { name: "Mercy", role: "UI/UX Designer", tasks: 20, productivity: "89%" },
      { name: "Kevin", role: "QA Engineer", tasks: 18, productivity: "84%" },
    ],
    deadlines: [
      { title: "Team Sprint Review", due: "Today", priority: "High" },
      { title: "Client Dashboard Update", due: "Tomorrow", priority: "Medium" },
      { title: "Bug Fix Release", due: "June 15", priority: "High" },
    ],
    actions: [
      { label: "Assign Tasks", to: "/tasks" },
      { label: "Review Reports", to: "/reports" },
      { label: "Open Calendar", to: "/calendar" },
    ],
  },
  member: {
    fallbackName: "Member",
    subtitle: "Your tasks, productivity, goals, and upcoming deadlines.",
    stats: [
      { title: "My Tasks", value: "18", change: "+4", icon: CheckCircle2, tone: "emerald" },
      { title: "Productivity", value: "92%", change: "+8%", icon: TrendingUp, tone: "violet" },
      { title: "Goals Achieved", value: "7", change: "+2", icon: Target, tone: "amber" },
      { title: "Due This Week", value: "3", change: "-1", icon: Clock3, tone: "blue" },
    ],
    chartTitle: "Personal Productivity",
    taskTitle: "My Tasks",
    performanceData: [
      { day: "Mon", performance: 45 },
      { day: "Tue", performance: 58 },
      { day: "Wed", performance: 72 },
      { day: "Thu", performance: 68 },
      { day: "Fri", performance: 94 },
    ],
    taskData: [
      { name: "Completed", value: 14, color: "#10b981" },
      { name: "In Progress", value: 5, color: "#3b82f6" },
      { name: "Pending", value: 3, color: "#f59e0b" },
      { name: "Overdue", value: 1, color: "#ef4444" },
    ],
    activityTitle: "Recent Activity",
    activities: [
      { person: "You", action: "completed a UI design task", time: "1 hour ago" },
      { person: "You", action: "updated a dashboard report", time: "3 hours ago" },
      { person: "You", action: "commented on a team task", time: "Yesterday" },
      { person: "You", action: "finished API integration", time: "2 days ago" },
    ],
    peopleTitle: "Focus Areas",
    people: [
      { name: "Dashboard Testing", role: "Quality", tasks: 4, productivity: "80%" },
      { name: "Weekly Report", role: "Reporting", tasks: 2, productivity: "100%" },
      { name: "Team Documentation", role: "Documentation", tasks: 3, productivity: "70%" },
    ],
    deadlines: [
      { title: "Submit Weekly Report", due: "Today", priority: "High" },
      { title: "Complete Dashboard Testing", due: "Tomorrow", priority: "Medium" },
      { title: "Update Team Documentation", due: "June 15", priority: "Low" },
    ],
    actions: [
      { label: "Open My Tasks", to: "/tasks" },
      { label: "View Goals", to: "/goals" },
      { label: "Open Calendar", to: "/calendar" },
    ],
  },
};

const toneClasses = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
};

function DashboardPage({ mode }) {
  const { profile } = useAuth();
  const content = roleContent[mode] || roleContent.member;
  const firstName =
    profile?.full_name?.split(" ")[0] || profile?.role || content.fallbackName;
  const totalTasks = content.taskData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">{content.subtitle}</p>
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

          <button className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
            {String(firstName).charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {content.stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {content.chartTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Week-over-week productivity trend.
              </p>
            </div>
            <span className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 dark:border-zinc-800 dark:text-zinc-300">
              This Week
            </span>
          </div>

          <div className="h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={content.performanceData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`performance-${mode}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="performance"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill={`url(#performance-${mode})`}
                  dot={{ r: 4, fill: "#fff", stroke: "#10b981", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {content.taskTitle}
          </h2>

          <div className="mt-4 h-[240px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={content.taskData}
                  dataKey="value"
                  innerRadius="48%"
                  outerRadius="68%"
                  paddingAngle={3}
                >
                  {content.taskData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                  <Label
                    value={totalTasks}
                    position="center"
                    className="fill-slate-900 text-3xl font-bold dark:fill-white"
                  />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {content.taskData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-zinc-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title={content.activityTitle} actionLabel="View All" to="/tasks">
          <div className="space-y-4">
            {content.activities.map((activity) => (
              <div
                key={`${activity.person}-${activity.time}`}
                className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 dark:border-zinc-800"
              >
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {activity.person.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 dark:text-zinc-200">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {activity.person}
                    </span>{" "}
                    {activity.action}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={content.peopleTitle} actionLabel="Open Members" to="/members">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="py-3 font-semibold">Name</th>
                  <th className="py-3 font-semibold">Role</th>
                  <th className="py-3 font-semibold">Tasks</th>
                  <th className="py-3 font-semibold">Productivity</th>
                </tr>
              </thead>
              <tbody>
                {content.people.map((person) => (
                  <tr key={person.name} className="border-b border-slate-100 last:border-b-0 dark:border-zinc-800">
                    <td className="py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {person.name}
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-zinc-400">
                      {person.role}
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-zinc-400">
                      {person.tasks}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        {person.productivity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Panel title="Upcoming Deadlines" actionLabel="Open Calendar" to="/calendar">
          <div className="space-y-3">
            {content.deadlines.map((deadline) => (
              <div
                key={deadline.title}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-zinc-800"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {deadline.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                    Due: {deadline.due}
                  </p>
                </div>
                <PriorityBadge priority={deadline.priority} />
              </div>
            ))}
          </div>
        </Panel>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="mt-5 space-y-3">
            {content.actions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-500/10"
              >
                {action.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{stat.title}</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {stat.value}
          </h2>
          <p className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Activity size={13} className="mr-1" />
            {stat.change}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[stat.tone]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function Panel({ title, actionLabel, to, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
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

function PriorityBadge({ priority }) {
  const classes = {
    High: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[priority]}`}>
      {priority}
    </span>
  );
}

export default DashboardPage;
