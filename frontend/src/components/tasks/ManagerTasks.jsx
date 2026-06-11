import { useState } from "react";

import { tasks as tasksData } from "../../data/tasksData";

import TaskDetailsModal from "./TaskDetailsModal";
import EditTaskModal from "./EditTaskModal";
import CreateTaskModal from "./CreateTaskModal";

import {
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

function ManagerTasks() {
  const [tasks, setTasks] = useState(tasksData);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // DETAILS MODAL
  const [selectedTask, setSelectedTask] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  // EDIT MODAL
  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [editedTask, setEditedTask] =
    useState(null);

  // CREATE MODAL
  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    status: "Pending",
    priority: "Medium",
    progress: 0,
    dueDate: "",
  });

  // FILTERED TASKS
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(
        search.toLowerCase()
      )
    )
    .filter((task) =>
      statusFilter === "All"
        ? true
        : task.status === statusFilter
    );

  // STATS
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  // DETAILS
  const handleOpenDetails = (task) => {
    setSelectedTask(task);

    setIsDetailsOpen(true);
  };

  // EDIT
  const handleEditTask = (task) => {
    setEditedTask(task);

    setIsEditOpen(true);
  };

  // UPDATE
  const handleUpdateTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editedTask.id
        ? editedTask
        : task
    );

    setTasks(updatedTasks);

    setIsEditOpen(false);
  };

  // DELETE
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    setTasks(updatedTasks);
  };

  // CREATE
  const handleCreateTask = () => {
    if (
      !newTask.title ||
      !newTask.assignee
    )
      return;

    const task = {
      id: Date.now(),
      ...newTask,
    };

    setTasks([task, ...tasks]);

    setNewTask({
      title: "",
      description: "",
      project: "",
      assignee: "",
      status: "Pending",
      priority: "Medium",
      progress: 0,
      dueDate: "",
    });

    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Team Tasks
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Assign and manage team tasks.
          </p>
        </div>

        <button
          onClick={() =>
            setIsCreateOpen(true)
          }
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition"
        >

          <Plus size={18} />

          Create Task

        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <p className="text-slate-500 dark:text-zinc-400">
            Total Tasks
          </p>

          <h2 className="text-3xl font-bold mt-3 dark:text-white">
            {tasks.length}
          </h2>

        </div>

        {/* COMPLETED */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 dark:text-zinc-400">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {completedTasks}
              </h2>
            </div>

            <div className="bg-emerald-100 p-3 rounded-xl">
              <CheckCircle
                size={24}
                className="text-emerald-600"
              />
            </div>

          </div>

        </div>

        {/* IN PROGRESS */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 dark:text-zinc-400">
                In Progress
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {inProgressTasks}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-xl">
              <Clock
                size={24}
                className="text-blue-600"
              />
            </div>

          </div>

        </div>

        {/* PENDING */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 dark:text-zinc-400">
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white">
                {pendingTasks}
              </h2>
            </div>

            <div className="bg-amber-100 p-3 rounded-xl">
              <AlertTriangle
                size={24}
                className="text-amber-600"
              />
            </div>

          </div>

        </div>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* SEARCH */}
        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
          />

        </div>

        {/* FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

      </div>

      {/* TASK CARDS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredTasks.map((task) => (

          <div
            key={task.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  {task.title}
                </h2>

                <p className="text-slate-500 mt-2">
                  {task.project}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    task.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }
                `}
              >
                {task.status}
              </span>

            </div>

            {/* DESCRIPTION */}
            <p className="text-slate-500 dark:text-zinc-400 mt-5 leading-relaxed">
              {task.description}
            </p>

            {/* ASSIGNEE */}
            <div className="flex items-center gap-3 mt-6">

              <div className="bg-purple-100 p-2 rounded-lg">

                <Users
                  size={18}
                  className="text-purple-700"
                />

              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Assigned To
                </p>

                <h3 className="font-semibold dark:text-white">
                  {task.assignee}
                </h3>
              </div>

            </div>

            {/* PROGRESS */}
            <div className="mt-6">

              <div className="flex items-center justify-between mb-2">

                <p className="text-sm text-slate-500">
                  Progress
                </p>

                <p className="font-semibold dark:text-white">
                  {task.progress}%
                </p>

              </div>

              <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-3">

                <div
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{
                    width: `${task.progress}%`,
                  }}
                />

              </div>

            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between mt-6">

              <p className="text-sm text-slate-500">
                Due: {task.dueDate}
              </p>

              <div className="flex items-center gap-2">

                {/* VIEW */}
                <button
                  onClick={() =>
                    handleOpenDetails(task)
                  }
                  className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >

                  <Eye size={16} />

                </button>

                {/* EDIT */}
                <button
                  onClick={() =>
                    handleEditTask(task)
                  }
                  className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                >

                  <Pencil size={16} />

                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    handleDeleteTask(task.id)
                  }
                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                >

                  <Trash2 size={16} />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* DETAILS MODAL */}
      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
        task={selectedTask}
      />

      {/* EDIT MODAL */}
      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() =>
          setIsEditOpen(false)
        }
        selectedTask={editedTask}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        handleUpdateTask={handleUpdateTask}
      />

      {/* CREATE MODAL */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() =>
          setIsCreateOpen(false)
        }
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
      />

    </div>
  );
}

export default ManagerTasks;