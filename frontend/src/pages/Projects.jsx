import { useState } from "react";
function Projects() {
const [showModal, setShowModal] = useState(false);

const [newProject, setNewProject] = useState({
  name: "",
  lead: "",
  team: "",
  deadline: "",
  progress: "",
  status: "Active",
  priority: "Medium",
});
const [search, setSearch] = useState("");
const [status, setStatus] = useState("All");
const [selectedProject, setSelectedProject] = useState(null);
const [projects, setProjects] = useState([
  {
    name: "WorkPulse Dashboard",
    lead: "Faith Njeri",
    team: 8,
    deadline: "12 Jun 2026",
    progress: 78,
    status: "Active",
    priority: "High",
    description:
  "A productivity management dashboard for monitoring team performance, analytics, and project progress.",

   avatars: ["FN", "JM", "GW"],
  },

  {
    name: "Mobile App UI",
    lead: "Grace Wambui",
    team: 5,
    deadline: "20 Jun 2026",
    progress: 54,
    status: "Pending",
    priority: "Medium",
    description:
  "A productivity management dashboard for monitoring team performance, analytics, and project progress.",

  avatars: ["FN", "JM", "GW"],
  },

  {
    name: "API Integration",
    lead: "Michael Otieno",
    team: 4,
    deadline: "02 Jul 2026",
    progress: 91,
    status: "Completed",
    priority: "Low",
    description:
  "A productivity management dashboard for monitoring team performance, analytics, and project progress.",

   avatars: ["FN", "JM", "GW"],
  },

  {
    name: "Analytics Module",
    lead: "John Mwangi",
    team: 6,
    deadline: "28 Jun 2026",
    progress: 36,
    status: "Delayed",
    priority: "High",
    description:
  "A productivity management dashboard for monitoring team performance, analytics, and project progress.",

  avatars: ["FN", "JM", "GW"],
  },
]);
const [editingProject, setEditingProject] = useState(null);

const [editForm, setEditForm] = useState({
  name: "",
  lead: "",
  team: "",
  deadline: "",
  progress: "",
  status: "",
  priority: "",
});
const [activities, setActivities] = useState([
  {
    title: "Dashboard UI Updated",
    desc: "Faith Njeri completed the dashboard redesign.",
    time: "2 hours ago",
    color: "bg-emerald-500",
  },

  {
    title: "API Integration Completed",
    desc: "Michael Otieno connected backend endpoints.",
    time: "5 hours ago",
    color: "bg-blue-500",
  },
]);
const filteredProjects = projects.filter((project) => {
  const matchesSearch = project.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesStatus =
    status === "All" || project.status === status;

  return matchesSearch && matchesStatus;
});
const handleAddProject = () => {

  // VALIDATION
  if (
    !newProject.name ||
    !newProject.lead ||
    !newProject.team ||
    !newProject.deadline
  ) {
    alert("Please fill all fields");
    return;
  }

  // NEW PROJECT OBJECT
  const projectToAdd = {
    ...newProject,

    team: Number(newProject.team),

    progress: Number(newProject.progress || 0),

    avatars: ["FN", "JM"],

    description:
      "New project recently added to the system.",
  };

  // ADD PROJECT
  setProjects([...projects, projectToAdd]);
    addActivity(
    "New Project Created",
    `${projectToAdd.name} was added by ${projectToAdd.lead}.`,
    "bg-emerald-500"
    );
  // CLOSE MODAL
  setShowModal(false);

  // RESET FORM
  setNewProject({
    name: "",
    lead: "",
    team: "",
    deadline: "",
    progress: "",
    status: "Active",
    priority: "Medium",
  });
};
const handleDeleteProject = (projectName) => {

  const updatedProjects = projects.filter(
    (project) => project.name !== projectName
  );

  setProjects(updatedProjects);

  // close modal if deleted project is open
  if (selectedProject?.name === projectName) {
    setSelectedProject(null);
  }
  addActivity(
    "Project Deleted",
    `${projectName} was removed from the system.`,
    "bg-red-500"
  );
};
const handleArchiveProject = (projectName) => {

  const updatedProjects = projects.map((project) =>

    project.name === projectName
      ? { ...project, status: "Archived" }
      : project
  );

  setProjects(updatedProjects);

  // update selected project
  if (selectedProject?.name === projectName) {

    setSelectedProject({
      ...selectedProject,
      status: "Archived",
    });
  }
  const handleArchiveProject = (projectName) => {

  addActivity(
    "Project Archived",
    `${projectName} was archived.`,
    "bg-yellow-500"
  );
};
};
const handleUpdateProject = () => {

  const updatedProjects = projects.map((project) =>

    project.name === editingProject.name
      ? {
          ...project,
          ...editForm,
          team: Number(editForm.team),
          progress: Number(editForm.progress),
        }
      : project
  );

  setProjects(updatedProjects);

  // update modal data too
  setSelectedProject({
    ...selectedProject,
    ...editForm,
  });

  // close edit modal
  setEditingProject(null);
  addActivity(
  "Project Updated",
  `${updatedProject.name} was edited successfully.`,
  "bg-blue-500"
);
};
const calculateDaysLeft = (deadline) => {

  const today = new Date();

  const dueDate = new Date(deadline);

  // difference in milliseconds
  const difference = dueDate - today;

  // convert to days
  const daysLeft = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  return daysLeft;
};
const addActivity = (title, desc, color) => {

  const newActivity = {
    title,
    desc,
    time: "Just now",
    color,
  };

  setActivities((prev) => [newActivity, ...prev]);
};

    return (
    <div className="flex-1 p-6 overflow-y-auto">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Projects
          </h1>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Manage and monitor all team projects.
          </p>
        </div>

        {/* ADD PROJECT BUTTON */}
                <button
        onClick={() => setShowModal(true)}
        className="rounded-2xl bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700 transition"
        >
        + Add Project
        </button>

      </div>
     {/* PROJECT STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

  {[
    {
      title: "Total Projects",
      value: projects.length,
      color: "bg-blue-100",
      text: "text-blue-600",
    },

    {
      title: "Active Projects",
      value: projects.filter((project) => project.status === "Active").length,
      color: "bg-emerald-100",
      text: "text-emerald-600",
    },

    {
      title: "Completed",
      value: projects.filter((project) => project.status === "Completed").length,
      color: "bg-purple-100",
      text: "text-purple-600",
    },

    {
      title: "Delayed",
      value: projects.filter((project) => project.status === "Delayed").length,
      color: "bg-red-100",
      text: "text-red-600",
    },
  ].map((stat, index) => (

    <div
      key={index}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {stat.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-800 dark:text-white">
            {stat.value}
          </h2>

        </div>

        {/* ICON BOX */}
        <div className={`${stat.color} rounded-2xl p-4`}>

          <div
            className={`h-5 w-5 rounded-full ${stat.text} bg-current`}
          />

        </div>

      </div>

    </div>

  ))}

</div>
{/* SEARCH + FILTERS */}
<div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

  {/* SEARCH */}
  <div className="w-full md:w-[320px]">

    <input
      type="text"
      placeholder="Search projects..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
    />

  </div>

  {/* FILTER */}
  <div className="flex items-center gap-3">

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
    >
      <option value="All">All Status</option>
      <option value="Active">Active</option>
      <option value="Completed">Completed</option>
      <option value="Pending">Pending</option>
      <option value="Delayed">Delayed</option>
    </select>

  </div>

</div>
{/* PROJECTS TABLE */}
<div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

  {/* TABLE HEADER */}
  <div className="grid grid-cols-8 gap-4 border-b border-slate-200 px-6 py-5 text-sm font-semibold text-slate-500 dark:border-zinc-800 dark:text-zinc-400 min-w-[1000px]">

    <p>Project</p>
    <p>Team Lead</p>
    <p>Team Size</p>
    <p>Deadline</p>
    <p>Progress</p>
    <p>Status</p>
    <p>Priority</p>
    <p>Actions</p>

  </div>
{/* EMPTY STATE */}
{filteredProjects.length === 0 && (

  <div className="flex flex-col items-center justify-center py-16">

    <h3 className="text-xl font-semibold text-slate-700 dark:text-white">
      No projects found
    </h3>

    <p className="mt-2 text-slate-500 dark:text-zinc-400">
      Try adjusting your search or filters.
    </p>

  </div>

)}
  {/* TABLE ROWS */}
  {filteredProjects.map((project, index) => (

    <div
      key={index}
      className="grid grid-cols-8 gap-4 items-center border-b border-slate-100 px-6 py-5 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40 min-w-[1000px]"
    >

      {/* PROJECT */}
      <h3 className="font-semibold text-slate-800 dark:text-white">
        {project.name}
      </h3>

      {/* LEAD */}
      <p className="text-slate-600 dark:text-zinc-300">
        {project.lead}
            </p>
        <p className="font-medium text-slate-700 dark:text-zinc-200">
        {project.team} Members
        </p>

      {/* DEADLINE */}
        <div>

        <p className="text-slate-600 dark:text-zinc-300">
            {project.deadline}
        </p>

        {/* DAYS LEFT */}
        <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            calculateDaysLeft(project.deadline) <= 3
                ? "bg-red-100 text-red-700"
                : calculateDaysLeft(project.deadline) <= 7
                ? "bg-yellow-100 text-yellow-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
        >

            {calculateDaysLeft(project.deadline) > 0
            ? `${calculateDaysLeft(project.deadline)} days left`
            : "overdue"}

        </span>

        </div>

      {/* PROGRESS */}
      <div>

        <p className="mb-1 text-sm font-semibold text-emerald-600">
          {project.progress}%
        </p>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            style={{ width: project.progress }}
          />

        </div>

      </div>

      {/* STATUS */}
      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          project.status === "Active"
            ? "bg-emerald-100 text-emerald-700"
            : project.status === "Completed"
            ? "bg-blue-100 text-blue-700"
            : project.status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {project.status}
      </span>

      {/* PRIORITY */}
      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          project.priority === "High"
            ? "bg-red-100 text-red-700"
            : project.priority === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {project.priority}
      </span>

      {/* ACTIONS */}
<div className="relative group">

  {/* BUTTON */}
  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700">
    More
  </button>

  {/* DROPDOWN */}
  <div className="invisible absolute right-0 top-12 z-20 w-44 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900">

    <button
  onClick={() => setSelectedProject(project)}
  className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
>
  View Project
</button>

    <button
  onClick={() => handleArchiveProject(project.name)}
  className="w-full rounded-xl px-4 py-3 text-left text-sm text-yellow-700 transition hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
>
  Archive
</button>

    <button
  onClick={() => handleDeleteProject(project.name)}
  className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
>
      Delete
    </button>

  </div>

</div>
        </div>

  ))}

</div>
{/* PAGINATION */}
<div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between dark:border-zinc-800">

  <p className="text-sm text-slate-500 dark:text-zinc-400">
    Showing all{" "}
    <span className="font-semibold text-slate-700 dark:text-white">
      {filteredProjects.length}
    </span>{" "}
    projects
  </p>

  <div className="flex items-center gap-2">

    <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      Previous
    </button>

    <button className="h-10 w-10 rounded-xl bg-emerald-600 text-sm font-semibold text-white">
      1
    </button>

    <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      Next
    </button>

  </div>

</div>
{/* PROJECT ACTIVITY TIMELINE */}
<div className="mt-10">

  {/* HEADER */}
  <div className="mb-6 flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Recent Activity
      </h2>

      <p className="mt-1 text-slate-500 dark:text-zinc-400">
        Latest updates across all projects
      </p>
    </div>

  </div>

  {/* TIMELINE CARD */}
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

    <div className="space-y-8">

      {activities.map((activity, index) => (

        <div
          key={index}
          className="relative flex gap-5"
        >

          {/* LINE */}
          {index !== activities.length - 1 && (
            <div className="absolute left-[14px] top-10 h-full w-[2px] bg-slate-200 dark:bg-zinc-700" />
          )}

          {/* DOT */}
          <div
            className={`mt-1 h-7 w-7 rounded-full ${activity.color} ring-4 ring-white dark:ring-zinc-900`}
          />

          {/* CONTENT */}
          <div className="flex-1">

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {activity.title}
              </h3>

              <span className="text-sm text-slate-500 dark:text-zinc-400">
                {activity.time}
              </span>

            </div>

            <p className="mt-2 text-slate-600 dark:text-zinc-300">
              {activity.desc}
            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

</div>
{/* DEADLINE COUNTDOWN */}
<div className="mt-10">

  {/* HEADER */}
  <div className="mb-6">

    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
      Upcoming Deadlines
    </h2>

    <p className="mt-1 text-slate-500 dark:text-zinc-400">
      Projects that need immediate attention
    </p>

  </div>

  {/* COUNTDOWN GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

    {[
      {
        project: "WorkPulse Dashboard",
        days: 4,
        progress: "78%",
        status: "On Track",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
      },

      {
        project: "Mobile App UI",
        days: 2,
        progress: "54%",
        status: "Risk",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      },

      {
        project: "Analytics Module",
        days: 1,
        progress: "36%",
        status: "Critical",
        color: "text-red-600",
        bg: "bg-red-100",
      },
    ].map((item, index) => (

      <div
        key={index}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >

        {/* TOP */}
        <div className="flex items-start justify-between">

          <div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {item.project}
            </h3>

            <p className="mt-2 text-slate-500 dark:text-zinc-400">
              Progress: {item.progress}
            </p>

          </div>

          <div
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${item.bg} ${item.color}`}
          >
            {item.status}
          </div>

        </div>

        {/* COUNTDOWN */}
        <div className="mt-8">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Days Remaining
          </p>

          <h2 className="mt-2 text-5xl font-bold text-slate-800 dark:text-white">
            {item.days}
          </h2>

        </div>

        {/* PROGRESS BAR */}
        <div className="mt-6">

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: item.progress }}
            />

          </div>

        </div>

      </div>

    ))}

  </div>

</div>
{/* PROJECT WORKFLOW BOARD */}
<div className="mt-10">

  {/* HEADER */}
  <div className="mb-6">

    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
      Project Workflow
    </h2>

    <p className="mt-1 text-slate-500 dark:text-zinc-400">
      Track projects across different stages
    </p>

  </div>

  {/* BOARD */}
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

    {[
      {
        title: "Planning",
        color: "bg-blue-500",
        projects: [
          "Client Portal Redesign",
          "Marketing Campaign",
        ],
      },

      {
        title: "Development",
        color: "bg-yellow-500",
        projects: [
          "WorkPulse Dashboard",
          "Mobile App UI",
        ],
      },

      {
        title: "Testing",
        color: "bg-purple-500",
        projects: [
          "Analytics Module",
        ],
      },

      {
        title: "Completed",
        color: "bg-emerald-500",
        projects: [
          "Team Management System",
          "HR Portal",
        ],
      },
    ].map((column, index) => (

      <div
        key={index}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >

        {/* COLUMN HEADER */}
        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className={`h-4 w-4 rounded-full ${column.color}`}
            />

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {column.title}
            </h3>

          </div>

          <span className="rounded-xl bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
            {column.projects.length}
          </span>

        </div>

        {/* PROJECT CARDS */}
        <div className="space-y-4">

          {column.projects.map((project, i) => (

            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50"
            >

              <h4 className="font-semibold text-slate-800 dark:text-white">
                {project}
              </h4>

              <div className="mt-4 flex items-center justify-between">

                <span className="text-sm text-slate-500 dark:text-zinc-400">
                  Active Project
                </span>

                <button className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700">
                  Open
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    ))}

  </div>

</div>
{/* PROJECT ANALYTICS */}
<div className="mt-10">

  {/* HEADER */}
  <div className="mb-6">

    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
      Project Analytics
    </h2>

    <p className="mt-1 text-slate-500 dark:text-zinc-400">
      Performance insights across all projects
    </p>

  </div>

  {/* ANALYTICS GRID */}
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

    {/* PROJECT SUCCESS RATE */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Success Rate
          </p>

          <h2 className="mt-3 text-5xl font-bold text-emerald-600">
            92%
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-2xl dark:bg-emerald-950/30">
          📈
        </div>

      </div>

      {/* BAR */}
      <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">

        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

      </div>

    </div>

    {/* ACTIVE PROJECTS */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Active Projects
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            12
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-950/30">
          🚀
        </div>

      </div>

      {/* MINI STATS */}
      <div className="mt-8 flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Completed
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
            8
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Delayed
          </p>

          <h3 className="mt-1 text-xl font-bold text-red-500">
            2
          </h3>
        </div>

      </div>

    </div>

    {/* TEAM PRODUCTIVITY */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Team Productivity
          </p>

          <h2 className="mt-3 text-5xl font-bold text-purple-600">
            87%
          </h2>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl dark:bg-purple-950/30">
          ⚡
        </div>

      </div>

      {/* WEEKLY BARS */}
      <div className="mt-8 flex items-end gap-3">

        {[40, 65, 55, 80, 72, 90, 87].map((height, index) => (

          <div
            key={index}
            className="flex-1 rounded-t-xl bg-gradient-to-t from-purple-500 to-purple-300"
            style={{ height: `${height}px` }}
          />

        ))}

      </div>

      {/* DAYS */}
      <div className="mt-3 flex justify-between text-xs text-slate-400">

        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
        <span>S</span>

      </div>

    </div>

  </div>

</div>
{/* PROJECT RESOURCES */}
<div className="mt-10">

  {/* HEADER */}
  <div className="mb-6">

    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
      Project Resources
    </h2>

    <p className="mt-1 text-slate-500 dark:text-zinc-400">
      Shared files and important documents
    </p>

  </div>

  {/* RESOURCES GRID */}
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

    {[
      {
        name: "Dashboard_UI.fig",
        type: "Figma Design",
        size: "14 MB",
        color: "bg-pink-100 text-pink-600",
      },

      {
        name: "API_Documentation.pdf",
        type: "Documentation",
        size: "6 MB",
        color: "bg-red-100 text-red-600",
      },

      {
        name: "Project_Report.docx",
        type: "Report File",
        size: "2 MB",
        color: "bg-blue-100 text-blue-600",
      },

      {
        name: "Team_Assets.zip",
        type: "Compressed Assets",
        size: "28 MB",
        color: "bg-emerald-100 text-emerald-600",
      },
    ].map((file, index) => (

      <div
        key={index}
        className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${file.color}`}
          >
            📁
          </div>

          {/* INFO */}
          <div>

            <h3 className="font-semibold text-slate-800 dark:text-white">
              {file.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {file.type} • {file.size}
            </p>

          </div>

        </div>

        {/* ACTION */}
        <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
          Download
        </button>

      </div>

    ))}

  </div>

</div>
{/* PROJECT MODAL */}
{selectedProject && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    {/* MODAL CARD */}
    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900">

      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            {selectedProject.name}
          </h2>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Managed by {selectedProject.lead}
          </p>

        </div>

        {/* CLOSE */}
        <button
          onClick={() => setSelectedProject(null)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ✕
        </button>

      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* STATUS */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Status
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
            {selectedProject.status}
          </h3>

        </div>

        {/* PRIORITY */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Priority
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
            {selectedProject.priority}
          </h3>

        </div>

        {/* DEADLINE */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Deadline
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
            {selectedProject.deadline}
          </h3>

        </div>

        {/* TEAM */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Team Members
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
            {selectedProject.team}
          </h3>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mt-8">

        <div className="mb-3 flex items-center justify-between">

          <p className="font-medium text-slate-700 dark:text-zinc-300">
            Project Progress
          </p>

          <span className="font-semibold text-emerald-600">
            {selectedProject.progress}
          </span>

        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            style={{ width: selectedProject.progress }}
          />

        </div>

      </div>
      {/* DESCRIPTION */}
        <div className="mt-8 rounded-2xl bg-slate-50 p-6 dark:bg-zinc-800/50">

        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Project Description
        </h3>

        <p className="mt-3 leading-relaxed text-slate-600 dark:text-zinc-300">
            {selectedProject.description}
        </p>

        </div>
        {/* TEAM MEMBERS */}
            <div className="mt-8">

            <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
                Team Members
            </h3>

            <div className="flex flex-wrap gap-4">

                {selectedProject.avatars.map((avatar, index) => (

                <div
                    key={index}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-lg"
                >
                    {avatar}
                </div>

                ))}

            </div>

            </div>
      {/* ACTIONS */}
      <div className="mt-8 flex flex-wrap gap-4">

        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-white font-medium transition hover:bg-emerald-700">
          Open Project
        </button>

        <button
        onClick={() => handleEditClick(selectedProject)}
        className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
        Edit Project
        </button>

      </div>

    </div>

  </div>

)}
{/* ADD PROJECT MODAL */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    {/* MODAL CARD */}
    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Add New Project
          </h2>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Create and manage a new project.
          </p>
        </div>

        {/* CLOSE */}
        <button
          onClick={() => setShowModal(false)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ✕
        </button>

      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PROJECT NAME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Project Name
          </label>

          <input
            type="text"
            placeholder="Enter project name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                name: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
        </div>

        {/* TEAM LEAD */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Team Lead
          </label>

          <input
            type="text"
            placeholder="Enter team lead"
            value={newProject.lead}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                lead: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
        </div>

        {/* TEAM SIZE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Team Size
          </label>

          <input
            type="number"
            placeholder="Team members"
            value={newProject.team}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                team: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
        </div>

        {/* DEADLINE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Deadline
          </label>

          <input
            type="date"
            value={newProject.deadline}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                deadline: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Status
          </label>

          <select
            value={newProject.status}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                status: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          >
            <option>Active</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Delayed</option>
          </select>
        </div>

        {/* PRIORITY */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Priority
          </label>

          <select
            value={newProject.priority}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                priority: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

      </div>
      {/* PROGRESS */}
<div>
  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
    Progress %
  </label>

  <input
    type="number"
    placeholder="0 - 100"
    value={newProject.progress}
    onChange={(e) =>
      setNewProject({
        ...newProject,
        progress: e.target.value,
      })
    }
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
  />
</div>

      {/* ACTIONS */}
      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() => setShowModal(false)}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>

         <button
            onClick={handleAddProject}
            className="rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700 transition"
            >
            Create Project
        </button>

      </div>

    </div>

  </div>
)}
{/* EDIT PROJECT MODAL */}
{editingProject && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Edit Project
          </h2>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Update project details.
          </p>
        </div>

        <button
          onClick={() => setEditingProject(null)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ✕
        </button>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Project Name"
          value={editForm.name}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              name: e.target.value,
            })
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />

        <input
          type="text"
          placeholder="Team Lead"
          value={editForm.lead}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              lead: e.target.value,
            })
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />

        <input
          type="number"
          placeholder="Team Size"
          value={editForm.team}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              team: e.target.value,
            })
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />

        <input
          type="number"
          placeholder="Progress"
          value={editForm.progress}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              progress: e.target.value,
            })
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />

      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() => setEditingProject(null)}
          className="rounded-2xl border border-slate-200 px-5 py-3"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdateProject}
          className="rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>

)}
    </div>
  );
}

export default Projects;