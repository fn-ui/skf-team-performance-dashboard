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
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

function AdminTasks() {
  const [isEditOpen, setIsEditOpen] =
  useState(false);

   const [editedTask, setEditedTask] =
  useState(null);
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
  const [tasks, setTasks] = useState(tasksData);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  // DETAILS MODAL
  const [selectedTask, setSelectedTask] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

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
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter
    );

  // DELETE TASK
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    setTasks(updatedTasks);
  };

  // OPEN DETAILS
  const handleOpenDetails = (task) => {
    setSelectedTask(task);

    setIsDetailsOpen(true);
  };

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

  const handleEditTask = (task) => {
  setEditedTask(task);

  setIsEditOpen(true);
};

const handleUpdateTask = () => {
  const updatedTasks = tasks.map((task) =>
    task.id === editedTask.id
      ? editedTask
      : task
  );

  setTasks(updatedTasks);

  setIsEditOpen(false);
};

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
            Tasks Management
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Monitor and manage all company tasks.
          </p>
        </div>

        <button
        onClick={() =>
          setIsCreateOpen(true)
        }
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition"
      >
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
                className="text-emerald-600"
                size={24}
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
                className="text-blue-600"
                size={24}
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
                className="text-amber-600"
                size={24}
              />
            </div>

          </div>

        </div>

      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* SEARCH */}
        <div className="lg:col-span-2 relative">

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

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >
          <option>All</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Pending</option>
        </select>

        {/* PRIORITY FILTER */}
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white outline-none"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

      </div>

      {/* TASKS TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 dark:bg-zinc-800">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Task
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Project
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Assignee
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Priority
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Progress
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Due Date
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredTasks.map((task) => (

                <tr
                  key={task.id}
                  className="border-t border-slate-200 dark:border-zinc-800"
                >

                  {/* TASK */}
                  <td className="px-6 py-5">

                    <div>
                      <h3 className="font-semibold dark:text-white">
                        {task.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {task.description}
                      </p>
                    </div>

                  </td>

                  {/* PROJECT */}
                  <td className="px-6 py-5 dark:text-white">
                    {task.project}
                  </td>

                  {/* ASSIGNEE */}
                  <td className="px-6 py-5 dark:text-white">
                    {task.assignee}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">

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

                  </td>

                  {/* PRIORITY */}
                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }
                      `}
                    >
                      {task.priority}
                    </span>

                  </td>

                  {/* PROGRESS */}
                  <td className="px-6 py-5 min-w-[180px]">

                    <div className="flex items-center gap-3">

                      <div className="flex-1 bg-slate-200 dark:bg-zinc-800 rounded-full h-2">

                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${task.progress}%`,
                          }}
                        />

                      </div>

                      <span className="text-sm font-medium dark:text-white">
                        {task.progress}%
                      </span>

                    </div>

                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5 dark:text-white">
                    {task.dueDate}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">

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

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredTasks.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-16 text-center">

          <h2 className="text-3xl font-bold dark:text-white">
            No Tasks Found
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-3">
            No tasks match your filters.
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

      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        selectedTask={editedTask}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        handleUpdateTask={handleUpdateTask}
      />
      <CreateTaskModal
      isOpen={isCreateOpen}
      onClose={() => setIsCreateOpen(false)}
      newTask={newTask}
      setNewTask={setNewTask}
      handleCreateTask={handleCreateTask}
    />

    </div>
  );
}

export default AdminTasks;