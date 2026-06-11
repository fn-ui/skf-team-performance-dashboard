import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { tasks as tasksData } from "../../data/tasksData";

import {
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";

import TaskDetailsModal from "./TaskDetailsModal";

function MemberTasks() {
  const { profile } = useAuth();

  const [tasks, setTasks] =
    useState(tasksData);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // DETAILS MODAL
  const [selectedTask, setSelectedTask] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  // FILTER MEMBER TASKS
  const memberTasks = tasks
    .filter(
      (task) =>
        task.assignee ===
        profile?.full_name
    )
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
  const completedTasks =
    memberTasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const inProgressTasks =
    memberTasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

  const pendingTasks =
    memberTasks.filter(
      (task) =>
        task.status === "Pending"
    ).length;

  // DETAILS
  const handleOpenDetails = (task) => {
    setSelectedTask(task);

    setIsDetailsOpen(true);
  };

  // UPDATE TASK STATUS
  const handleStatusChange = (
    id,
    newStatus
  ) => {
    const updatedTasks = tasks.map(
      (task) => {
        if (task.id === id) {
          return {
            ...task,
            status: newStatus,

            progress:
              newStatus === "Completed"
                ? 100
                : newStatus ===
                  "In Progress"
                ? 60
                : 0,
          };
        }

        return task;
      }
    );

    setTasks(updatedTasks);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold dark:text-white">
          My Tasks
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Track and manage your assigned tasks.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">

          <p className="text-slate-500 dark:text-zinc-400">
            Total Tasks
          </p>

          <h2 className="text-3xl font-bold mt-3 dark:text-white">
            {memberTasks.length}
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

      {/* TASKS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {memberTasks.map((task) => (

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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">

              <p className="text-sm text-slate-500">
                Due: {task.dueDate}
              </p>

              <div className="flex items-center gap-3">

                {/* VIEW */}
                <button
                  onClick={() =>
                    handleOpenDetails(task)
                  }
                  className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >

                  <Eye size={16} />

                </button>

                {/* STATUS */}
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(
                      task.id,
                      e.target.value
                    )
                  }
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none text-sm"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY STATE */}
      {memberTasks.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-16 text-center">

          <div className="bg-slate-100 dark:bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto">

            <CheckCircle
              size={40}
              className="text-slate-400"
            />

          </div>

          <h2 className="text-3xl font-bold mt-6 dark:text-white">
            No Assigned Tasks
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            You currently have no assigned tasks.
          </p>

        </div>

      )}

      {/* DETAILS MODAL */}
      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
        task={selectedTask}
      />

    </div>
  );
}

export default MemberTasks;