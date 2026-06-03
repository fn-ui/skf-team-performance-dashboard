import { useState } from "react";

function Tasks() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [taskDueDate, setTaskDueDate] = useState("");
  const handleEditTask = (task, index) => {

  setTaskTitle(task.title);
  setTaskProject(task.project);
  setTaskAssignee(task.assignee);
  setTaskPriority(task.priority);
  setTaskStatus(task.status);
  setTaskDueDate(task.dueDate);

  setEditingTaskIndex(index);

  setShowTaskModal(true);
  };
  const handleSaveTask = () => {

  if (
    !taskTitle ||
    !taskProject ||
    !taskAssignee ||
    !taskDueDate
  ) {
    return;
  }

  const updatedTask = {
    title: taskTitle,
    project: taskProject,
    assignee: taskAssignee,
    priority: taskPriority,
    status: taskStatus,
    dueDate: taskDueDate,
    progress:
      taskStatus === "Completed"
        ? 100
        : taskStatus === "In Progress"
        ? 60
        : 10,
  };

  if (editingTaskIndex !== null) {

    const updatedTasks = [...tasks];

    updatedTasks[editingTaskIndex] =
      updatedTask;

    setTasks(updatedTasks);

  } else {

    setTasks([updatedTask, ...tasks]);

  }

  /* RESET */
  setTaskTitle("");
  setTaskProject("");
  setTaskAssignee("");
  setTaskPriority("Medium");
  setTaskStatus("Pending");
  setTaskDueDate("");

  setEditingTaskIndex(null);

  setShowTaskModal(false);
};
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Dashboard UI",
      project: "WorkPulse Dashboard",
      assignee: "Grace Wambui",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-06-30",
      progress: 75,
    },

    {
      id: 2,
      title: "Build Authentication",
      project: "Client Portal",
      assignee: "Michael Otieno",
      priority: "Medium",
      status: "Pending",
      dueDate: "2026-06-18",
      progress: 40,
    },

    {
      id: 3,
      title: "Fix Mobile Responsiveness",
      project: "Marketing Website",
      assignee: "John Mwangi",
      priority: "Low",
      status: "Completed",
      dueDate: "2026-06-05",
      progress: 100,
    },
  ]);

  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter(
          (task) => task.status === statusFilter
        );
    const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    };
    const getDaysLeft = (dueDate) => {
  const today = new Date();

  const due = new Date(dueDate);

  const diffTime = due - today;

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  return diffDays;
};
const totalTasks = tasks.length;

const inProgressTasks = tasks.filter(
  (task) => task.status === "In Progress"
).length;

const completedTasks = tasks.filter(
  (task) => task.status === "Completed"
).length;

const overdueTasks = tasks.filter((task) => {
  return (
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed"
  );
}).length;
  return (
    <div className="flex-1 p-6 overflow-y-auto">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Tasks
          </h1>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Manage project tasks and team productivity.
          </p>
        </div>

        <button
        onClick={() => setShowTaskModal(true)}
        className="rounded-2xl bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700 transition"
        >
        + Create Task
        </button>

      </div>

     {/* TASK STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

  {[
    {
       title: "Total Tasks",
       value: totalTasks,
    },

    {
      title: "In Progress",
      value: inProgressTasks,
    },

    {
      title: "Completed",
      value: completedTasks,
    },

    {
      title: "Overdue",
      value: overdueTasks,
    },
  ].map((stat, index) => (
    <div
      key={index}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >

      <p className="text-sm text-slate-500 dark:text-zinc-400">
        {stat.title}
      </p>

      <h2 className="mt-4 text-4xl font-bold text-slate-800 dark:text-white">
        {stat.value}
      </h2>

    </div>
  ))}

</div>

      {/* FILTER BAR */}
      <div className="mt-8 flex flex-wrap items-center gap-4">

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

      </div>

      {/* TASK TABLE */}
      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-8 gap-4 border-b border-slate-200 px-6 py-5 text-sm font-semibold text-slate-500 dark:border-zinc-800 dark:text-zinc-400 min-w-[1000px]">

          <p>Task</p>
          <p>Project</p>
          <p>Assigned To</p>
          <p>Priority</p>
          <p>Status</p>
          <p>Progress</p>
          <p>Due Date</p>
          <p>Actions</p>
        </div>

        {/* TASK ROWS */}
        {filteredTasks.map((task, index) => (

          <div
            key={index}
            className="grid grid-cols-8 gap-4 items-center border-b border-slate-100 px-6 py-5 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40 min-w-[1000px]"
          >

            {/* TASK */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">
                {task.title}
              </h3>
            </div>

            {/* PROJECT */}
            <p className="text-slate-600 dark:text-zinc-300">
              {task.project}
            </p>

            {/* ASSIGNEE */}
            <p className="text-slate-600 dark:text-zinc-300">
              {task.assignee}
            </p>

            {/* PRIORITY */}
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                task.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {task.priority}
            </span>

            {/* STATUS */}
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                task.status === "Completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : task.status === "In Progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {task.status}
            </span>

            {/* PROGRESS */}
            <div>

              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                {task.progress}%
              </p>

              <div className="h-2 rounded-full bg-slate-100 dark:bg-zinc-800">

                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${task.progress}%`,
                  }}
                />

              </div>

            </div>

            
          {/* DUE DATE */}
<div>
  <p className="text-sm text-slate-600 dark:text-zinc-300">
    {task.dueDate}
  </p>

  <div className="mt-2">
    {(() => {
      const today = new Date();

      const dueDate = new Date(task.dueDate);

      const timeDiff =
        dueDate.getTime() - today.getTime();

      const daysLeft = Math.ceil(
        timeDiff / (1000 * 60 * 60 * 24)
      );

      if (daysLeft < 0) {
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
            Overdue
          </span>
        );
      }

      if (daysLeft === 0) {
        return (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            Due Today
          </span>
        );
      }

      return (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {daysLeft} days left
        </span>
      );
    })()}
  </div>
</div>
        {/* ACTIONS */}
<div className="flex items-center gap-2">

  <button
    onClick={() => setSelectedTask(task)}
    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
  >
    View
  </button>

  <button
    onClick={() => handleEditTask(task, index)}
    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400"
  >
    Edit
  </button>

  {/* DELETE ICON */}
  <button
    onClick={() => handleDelete(task.id)}
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
  >
    🗑️
  </button>

</div>
</div>
))}
</div>
{/* TASK DETAILS MODAL */}
{selectedTask && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    {/* MODAL CARD */}
    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            {selectedTask.title}
          </h2>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            {selectedTask.project}
          </p>

        </div>

        {/* CLOSE */}
        <button
          onClick={() => setSelectedTask(null)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ✕
        </button>

      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ASSIGNEE */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Assigned To
          </p>

          <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedTask.assignee}
          </h3>

        </div>

        {/* PRIORITY */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Priority
          </p>

          <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedTask.priority}
          </h3>

        </div>

        {/* STATUS */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Status
          </p>

          <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedTask.status}
          </h3>

        </div>

        {/* DUE DATE */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Due Date
          </p>

          <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedTask.dueDate}
          </h3>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mt-8">

        <div className="mb-3 flex items-center justify-between">

          <p className="font-medium text-slate-700 dark:text-zinc-300">
            Task Progress
          </p>

          <p className="font-semibold text-emerald-600">
            {selectedTask.progress}%
          </p>

        </div>

        <div className="h-3 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">

          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            style={{
              width: `${selectedTask.progress}%`,
            }}
          />

        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex flex-wrap gap-4">

        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 transition">
          Update Task
        </button>

        <button className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
          Approve Task
        </button>

      </div>

    </div>

  </div>
)}
{/* ADD TASK MODAL */}
{showTaskModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    {/* MODAL CARD */}
    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Create New Task
          </h2>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Add a new task for your team.
          </p>

        </div>

        {/* CLOSE */}
        <button
          onClick={() => setShowTaskModal(false)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ✕
        </button>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* TASK TITLE */}
        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Task Title
          </label>

          <input
            type="text"
            value={taskTitle}
            onChange={(e) =>
              setTaskTitle(e.target.value)
            }
            placeholder="Enter task title"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

        </div>

        {/* PROJECT */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Project
          </label>

          <input
            type="text"
            value={taskProject}
            onChange={(e) =>
              setTaskProject(e.target.value)
            }
            placeholder="Project name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

        </div>

        {/* ASSIGNEE */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Assignee
          </label>

          <input
            type="text"
            value={taskAssignee}
            onChange={(e) =>
              setTaskAssignee(e.target.value)
            }
            placeholder="Assigned member"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

        </div>

        {/* PRIORITY */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Priority
          </label>

          <select
            value={taskPriority}
            onChange={(e) =>
              setTaskPriority(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

        </div>

        {/* STATUS */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Status
          </label>

          <select
            value={taskStatus}
            onChange={(e) =>
              setTaskStatus(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

        </div>

        {/* DUE DATE */}
        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Due Date
          </label>

          <input
            type="date"
            value={taskDueDate}
            onChange={(e) =>
              setTaskDueDate(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

        </div>

      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex flex-wrap gap-4">

        <button
        onClick={handleSaveTask}
        className="rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 transition"
        >
        {editingTaskIndex !== null
        ? "Save Changes"
        : "Create Task"}
        </button>
        
        <button
          onClick={() => setShowTaskModal(false)}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
    }
    

export default Tasks;