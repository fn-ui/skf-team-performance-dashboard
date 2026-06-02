
import {
  Users,
  CheckCircle,
  TrendingUp,
  FolderKanban,
  Bell,
  Search,
  Download,
  Star,
  AlertTriangle,
  
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Label,
} from "recharts";
const stats = [
  {
    title: "Total Members",
    value: "48",
    change: "+12%",
    icon: Users,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    changeColor: "text-green-600",
  },
  {
    title: "Tasks Completed",
    value: "156",
    change: "+18%",
    icon: CheckCircle,
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
    changeColor: "text-green-600",
  },
  {
    title: "Productivity",
    value: "87%",
    change: "+8%",
    icon: TrendingUp,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    changeColor: "text-green-600",
  },
  {
    title: "Active Projects",
    value: "12",
    change: "+2",
    icon: FolderKanban,
    color: "bg-pink-100",
    iconColor: "text-pink-600",
    changeColor: "text-green-600",
  },
  {
  title: "Overdue Tasks",
  value: "24",
  change: "-5%",
  icon: AlertTriangle,
  color: "bg-red-100",
  iconColor: "text-red-600",
  changeColor: "text-red-600",
},
];
const performanceData = [
  { day: "Mon", performance: 20 },
  { day: "Tue", performance: 45 },
  { day: "Wed", performance: 70 },
  { day: "Thu", performance: 55 },
  { day: "Fri", performance: 95 },
  
];

const taskData = [
  { name: "Completed", value: 156, color: "#10b981" },
  { name: "In Progress", value: 78, color: "#3b82f6" },
  { name: "Pending", value: 42, color: "#f59e0b" },
  { name: "Overdue", value: 24, color: "#ef4444" },
];
function Dashboard({ darkMode, toggleDarkMode }) {
  const hour = new Date().getHours();

let greeting = "Good Evening";

if (hour < 12) {
  greeting = "Good Morning";
} else if (hour < 18) {
  greeting = "Good Afternoon";
}
  
    return (
  <>
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-500">

        
        {/* Header */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

  {/* LEFT SIDE */}
  <div>
    <h1 className="text-4xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
  {greeting}, Admin 👋
</h1>

    <p className="text-slate-500 dark:text-zinc-400 mt-2 transition-colors duration-300">
      Here's what's happening with your team today.
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-4">

    {/* SEARCH BAR */}
    <div className="relative">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search..."
        className="w-[250px] rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
      />

    </div>
{/* EXPORT REPORT BUTTON */}
<button className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-sm transition hover:bg-emerald-700">

  <Download size={18} />

  <span className="hidden sm:block font-medium">
    Export Report
  </span>

</button>
    {/* NOTIFICATION BUTTON */}
    <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-sm transition hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">

      <Bell size={20} />

      {/* NOTIFICATION DOT */}
      <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />

    </button>

    

  </div>

</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

  {stats.map((card, index) => {
    const Icon = card.icon;

    return (
      <div
        key={index}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800"
      >
        <div className="flex items-center justify-between">

          <div>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              {card.title}
            </p>

           <h2 className={`text-4xl font-bold mt-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
              {card.value}
            </h2>

            <p className={`mt-3 text-sm font-medium ${card.changeColor}`}>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
          ↑ {card.change}
        </span>
            </p>
          </div>

          <div className={`${card.color} p-4 rounded-2xl`}>
            <Icon
              className={card.iconColor}
              size={30}
            />
          </div>

        </div>
      </div>
    );
  })}

</div>

       
        {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

  {/* Line Chart */}
  <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Team Performance Overview
      </h2>

      <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 dark:text-zinc-300 dark:border-zinc-800">
        This Week
      </button>
    </div>

    <div className="h-[300px]">

      <ResponsiveContainer width="100%" height="100%">
  <AreaChart
    data={performanceData}
    margin={{
      top: 10,
      right: 10,
      left: -20,
      bottom: 0,
    }}
  >

    {/* GRADIENT */}
    <defs>
      <linearGradient
  id="colorPerformance"
  x1="0"
  y1="0"
  x2="0"
  y2="1"
>

  {/* TOP */}
  <stop
    offset="0%"
    stopColor="#10b981"
    stopOpacity={0.55}
  />

  {/* MIDDLE */}
  <stop
    offset="55%"
    stopColor="#10b981"
    stopOpacity={0.25}
  />

  {/* BOTTOM */}
  <stop
    offset="100%"
    stopColor="#10b981"
    stopOpacity={0.03}
  />

</linearGradient>
    </defs>

    {/* GRID */}
    <CartesianGrid
      strokeDasharray="3 3"
      vertical={false}
      stroke={darkMode ? "#27272a" : "#e2e8f0"}
    />

    {/* X AXIS */}
    <XAxis
      dataKey="day"
      axisLine={false}
      tickLine={false}
      tick={{
     fill: darkMode ? "#a1a1aa" : "#64748b",
     fontSize: 12,
      }}
    />

    {/* Y AXIS */}
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{
      fill: darkMode ? "#a1a1aa" : "#64748b",
       fontSize: 12,
       }}
      domain={[0, 100]}
      ticks={[0, 25, 50, 75, 100]}
      tickFormatter={(value) => `${value}%`}
    />

    {/* TOOLTIP */}
    <Tooltip />

    <Area
  type="monotone"
  dataKey="performance"
  stroke="#10b981"
  strokeWidth={4}
  fill="url(#colorPerformance)"
  dot={{
    r: 5,
    fill: "#fff",
    stroke: "#10b981",
    strokeWidth: 3,
  }}
  activeDot={{
    r: 7,
  }}
/>

    

   
  </AreaChart>
</ResponsiveContainer>

    </div>

  </div>

  {/* Pie Chart */}
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
      Tasks by Status
    </h2>

    <div className="h-[300px] flex items-center justify-center">

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>

          <Pie
          data={taskData}
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
        >

          {taskData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.color}
            />
          ))}

          {/* TOTAL NUMBER */}
        <Label
          value={taskData.reduce((acc, item) => acc + item.value, 0)}
          position="center"
          className={`${darkMode ? "fill-white" : "fill-slate-800"} text-3xl font-bold`}
        />

        {/* TEXT BELOW */}
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${darkMode ? "fill-white" : "fill-slate-500"} text-sm`}
        >
          Total Tasks
        </text>

        </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>

    {/* Legend */}
    <div className="space-y-3 mt-4">

      {taskData.map((task, index) => (
        <div
          key={index}
          className="flex items-center justify-between"
        >

          <div className="flex items-center gap-2">

            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: task.color }}
            />

            <p className="text-sm text-slate-600">
              {task.name}
            </p>

          </div>

          <p className="text-sm font-medium text-slate-700 dark:text-zinc-400">
            {task.value}
          </p>

        </div>
      ))}

    </div>

  </div>

</div>
{/* Bottom Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

  {/* Top Performers */}
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

    <div className="flex items-center justify-between mb-6">

      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Top Performers
      </h2>

      <button className="text-emerald-600 text-sm font-medium dark:text-emerald-400">
        View all
      </button>

    </div>

    <div className="space-y-5">

      {[
  {
    name: "John Mwangi",
    role: "Frontend Developer",
    tasks: 24,
    productivity: "96%",
    avatar: "JM",
    color: "bg-blue-500",
    rating: 5
  },
  {
    name: "Grace Wambui",
    role: "UI/UX Designer",
    tasks: 22,
    productivity: "93%",
    avatar: "GW",
    color: "bg-pink-500",
    rating: 4
  },
  {
    name: "Michael Otieno",
    role: "Backend Developer",
    tasks: 20,
    productivity: "90%",
    avatar: "MO",
    color: "bg-emerald-500",
    rating: 4
  },
  {
    name: "Emily Atieno",
    role: "QA Engineer",
    tasks: 18,
    productivity: "88%",
    avatar: "EA",
    color: "bg-purple-500",
    rating: 3
  },
].map((member, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b border-slate-100 pb-4"
        >

          <div className="flex items-center gap-3">

          {/* AVATAR */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${member.color}`}
          >
            {member.avatar}
          </div>

          {/* USER INFO */}
          <div>
            <h3 className="font-semibold text-slate-800">
              {member.name}
            </h3>

            <p className="text-sm text-slate-500">
              {member.role}
            </p>
          </div>

     </div>

          <div className="text-right">

  <p className="font-bold text-slate-800 dark:text-white">
    {member.tasks} Tasks
  </p>

  <p className="text-sm text-emerald-600 font-medium dark:text-emerald-400">
    {member.productivity}
  </p>

  {/* RATING */}
  <div className="flex items-center justify-end gap-1 mt-2">

    {[...Array(member.rating)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className="fill-yellow-400 text-yellow-400"
      />
    ))}

  </div>

</div>

        </div>
      ))}

    </div>

  </div>

  {/* Recent Activity */}
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

    <div className="flex items-center justify-between mb-6">

      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Recent Activity
      </h2>

      <button className="text-emerald-600 text-sm font-medium dark:text-emerald-400">
        View all
      </button>

    </div>

    <div className="space-y-5">

      {[
  {
    activity: "John completed a task",
    time: "2 mins ago",
  },
  {
    activity: "Grace uploaded a design file",
    time: "10 mins ago",
  },
  {
    activity: "Michael updated project status",
    time: "25 mins ago",
  },
  {
    activity: "Faith added a new member",
    time: "1 hour ago",
  },
  {
    activity: "Emily reviewed a pull request",
    time: "3 hours ago",
  },
].map((activity, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-slate-100 pb-4"
        >

          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            ✓
          </div>

          <div className="flex-1 flex items-center justify-between gap-4">

          {/* ACTIVITY TEXT */}
          <div>
            <p className="text-slate-700 font-medium">
              {activity.activity}
            </p>
          </div>

          {/* TIMELINE */}
          <p className="text-sm whitespace-nowrap text-slate-400">
            {activity.time}
          </p>

        </div>

        </div>
      ))}

    </div>

  </div>

</div>
{/* Productivity + Quick Actions */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

  {/* QUICK ACTIONS */}
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 h-fit dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

    <h2 className="text-2xl font-semibold text-slate-800 mb-6 dark:text-white">
      Quick Actions
    </h2>

    <div className="space-y-4">

      {[
        {
          title: "Create Project",
          desc: "Start a new project",
          color: "bg-emerald-500",
        },
        {
          title: "Add Member",
          desc: "Invite team members",
          color: "bg-blue-500",
        },
        {
          title: "Export Report",
          desc: "Download analytics",
          color: "bg-purple-500",
        },
      ].map((action, index) => (
        <button
          key={index}
          className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 text-left transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >

          <div
            className={`w-3 h-3 rounded-full mb-3 ${action.color}`}
          />

          <h3 className="font-semibold text-slate-800">
            {action.title}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {action.desc}
          </p>

        </button>
      ))}

    </div>

  </div>

  {/* DEPARTMENT PRODUCTIVITY */}
  <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

    <div className="flex items-center justify-between mb-8">

      <div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
          Department Productivity
        </h2>

        <p className="text-slate-500 text-sm mt-1 dark:text-zinc-400">
          Performance across all departments
        </p>
      </div>

      <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm text-slate-600 dark:text-zinc-400">
        Monthly Report
      </button>

    </div>

    <div className="space-y-5">

      {[
        {
          department: "Frontend Development",
          progress: 92,
          color: "bg-blue-500",
        },
        {
          department: "Backend Development",
          progress: 84,
          color: "bg-emerald-500",
        },
        {
          department: "UI/UX Design",
          progress: 76,
          color: "bg-purple-500",
        },
        {
          department: "Quality Assurance",
          progress: 68,
          color: "bg-pink-500",
        },
        {
          department: "Project Management",
          progress: 88,
          color: "bg-orange-500",
        },
      ].map((dept, index) => (
        <div key={index}>

          <div className="flex items-center justify-between mb-2">

            <h3 className="font-medium text-slate-700">
              {dept.department}
            </h3>

            <p className="font-semibold text-slate-800">
              {dept.progress}%
            </p>

          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">

            <div
              className={`h-full rounded-full ${dept.color} transition-all duration-1000`}
              style={{ width: `${dept.progress}%` }}
            />

          </div>

        </div>
      ))}

    </div>

  </div>

</div>


  {/* Upcoming Deadlines */}
<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 mt-8 dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
        Upcoming Deadlines
      </h2>

      <p className="text-slate-500 text-sm mt-1 dark:text-zinc-400">
        Tasks requiring immediate attention
      </p>
    </div>

    <button className="text-emerald-600 text-sm font-medium dark:text-emerald-400">
      View Calendar
    </button>

  </div>

  {/* DEADLINE CARDS */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

    {[
      {
        title: "Mobile App Development",
        team: "Frontend Team",
        progress: 85,
        deadline: "Tomorrow",
        color: "bg-blue-500",
      },
      {
        title: "Marketing Dashboard",
        team: "Marketing Team",
        progress: 70,
        deadline: "3 Days Left",
        color: "bg-orange-500",
      },
      {
        title: "Performance Review",
        team: "HR Team",
        progress: 92,
        deadline: "Friday",
        color: "bg-pink-500",
      },
      {
        title: "Authentication API",
        team: "Backend Team",
        progress: 65,
        deadline: "2 Days Left",
        color: "bg-emerald-500",
      },
    ].map((task, index) => (
      <div
        key={index}
        className="rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      >

        {/* TOP */}
        <div className="flex items-start justify-between mb-4">

          <div>
            <h3 className="font-semibold text-slate-800">
              {task.title}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {task.team}
            </p>
          </div>

          <p className="text-sm font-medium text-red-500 whitespace-nowrap">
            {task.deadline}
          </p>

        </div>

        {/* PROGRESS */}
        <div className="mb-2 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Progress
          </p>

          <p className="text-sm font-semibold text-slate-700">
            {task.progress}%
          </p>

        </div>

        {/* BAR */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">

          <div
            className={`h-full rounded-full ${task.color}`}
            style={{ width: `${task.progress}%` }}
          />

        </div>

      </div>
    ))}

  </div>

</div>
</main>

      
    </>
  );
}


export default Dashboard;