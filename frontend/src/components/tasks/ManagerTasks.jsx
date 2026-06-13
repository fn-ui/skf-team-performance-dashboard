import {
  useEffect,
  useState,
} from "react";

import {
  getTasks,
  updateTask,
  deleteTask,
  createTask,
  assignTaskUsers,
} from "../../services/tasksService";

import { getUsers } from "../../services/userService";

import { useAuth } from "../../contexts/AuthContext";

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
  const { user, profile } =
    useAuth();

  // TASKS
  const [tasks, setTasks] =
    useState([]);

  // USERS
  const [users, setUsers] =
    useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // FILTERS
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  // USER SEARCH
  const [userSearch, setUserSearch] =
    useState("");

  // ASSIGNED USERS
  const [selectedUsers, setSelectedUsers] =
    useState([]);

  // MODALS
  const [selectedTask, setSelectedTask] =
    useState(null);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [editedTask, setEditedTask] =
    useState(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  // NEW TASK
  const [newTask, setNewTask] =
    useState({
      title: "",
      description: "",
      project_id: "",
      status: "Pending",
      priority: "Medium",
      progress: 0,
      due_date: "",
    });

  // 🔥 INITIAL LOAD
  useEffect(() => {
    if (!profile?.id) return;

    loadTasks();
    loadUsers();
  }, [profile?.id]);

  // 📦 LOAD TASKS
  const loadTasks =
    async () => {
      try {
        setLoading(true);

        const data =
          await getTasks();

        // 🔥 ONLY MANAGER TASKS
        const managerTasks =
          (data || []).filter(
            (task) =>
              task.created_by ===
                profile?.id ||
              task.creator?.id ===
                profile?.id
          );

        setTasks(managerTasks);
      } catch (error) {
        console.error(
          "FETCH TASKS ERROR:",
          error.message
        );

        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

  // 👥 LOAD USERS
  const loadUsers =
    async () => {
      try {
        const data =
          await getUsers();

        // 🔥 MEMBERS ONLY
        const membersOnly =
          (data || []).filter(
            (user) =>
              user.role ===
              "member"
          );

        setUsers(membersOnly);
      } catch (error) {
        console.error(
          "FETCH USERS ERROR:",
          error.message
        );

        setUsers([]);
      }
    };

  // 🔎 FILTER USERS
  const filteredUsers =
    users.filter((user) =>
      user.full_name
        ?.toLowerCase()
        .includes(
          userSearch.toLowerCase()
        )
    );

  // 🔎 FILTER TASKS
  const filteredTasks = tasks
    .filter((task) =>
      task.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )
    .filter((task) =>
      statusFilter === "All"
        ? true
        : task.status ===
          statusFilter
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority ===
          priorityFilter
    );

  // 📊 STATS
  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Pending"
    ).length;

  // 👁 OPEN DETAILS
  const handleOpenDetails = (
    task
  ) => {
    setSelectedTask(task);

    setIsDetailsOpen(true);
  };

  // ✏️ OPEN EDIT
  const handleEditTask = (
    task
  ) => {
    setEditedTask({
      ...task,
    });

    setIsEditOpen(true);
  };

  // 👥 TOGGLE USER
  const toggleUserSelection =
    (userId) => {
      setSelectedUsers(
        (prev) =>
          prev.includes(userId)
            ? prev.filter(
                (id) =>
                  id !== userId
              )
            : [
                ...prev,
                userId,
              ]
      );
    };

  // 💾 UPDATE TASK
  const handleUpdateTask =
    async () => {
      if (!editedTask?.id)
        return;

      try {
        const updated =
          await updateTask(
            editedTask.id,
            {
              title:
                editedTask.title,
              description:
                editedTask.description,
              project_id:
                editedTask.project_id,
              status:
                editedTask.status,
              priority:
                editedTask.priority,
              progress:
                editedTask.progress,
              due_date:
                editedTask.due_date,
            }
          );

        setTasks((prev) =>
          prev.map((task) =>
            task.id ===
            updated.id
              ? {
                  ...task,
                  ...updated,
                }
              : task
          )
        );

        setIsEditOpen(false);

        setEditedTask(null);
      } catch (error) {
        console.error(
          "UPDATE ERROR:",
          error.message
        );
      }
    };

  // 🗑 DELETE TASK
  const handleDeleteTask =
    async (id) => {
      try {
        await deleteTask(id);

        setTasks((prev) =>
          prev.filter(
            (task) =>
              task.id !== id
          )
        );
      } catch (error) {
        console.error(
          "DELETE ERROR:",
          error.message
        );
      }
    };

  // ➕ CREATE TASK
  const handleCreateTask =
    async () => {
      if (!newTask.title)
        return;

      try {
        // 🔥 CREATE TASK
        const createdTask =
          await createTask({
            title:
              newTask.title,
            description:
              newTask.description,
            project_id:
              newTask.project_id ||
              null,
            status:
              newTask.status,
            priority:
              newTask.priority,
            progress:
              newTask.progress,
            due_date:
              newTask.due_date ||
              null,
            created_by:
              profile?.id ||
              user?.id ||
              null,
          });

        // 👥 ASSIGN USERS
        if (
          selectedUsers.length > 0
        ) {
          await assignTaskUsers(
            createdTask.id,
            selectedUsers
          );
        }

        // 🔄 RELOAD TASKS
        await loadTasks();

        // 🔥 RESET FORM
        setNewTask({
          title: "",
          description: "",
          project_id: "",
          status: "Pending",
          priority: "Medium",
          progress: 0,
          due_date: "",
        });

        setSelectedUsers([]);

        setUserSearch("");

        setIsCreateOpen(false);
      } catch (error) {
        console.error(
          "CREATE ERROR:",
          error.message
        );
      }
    };

  // 🎨 PRIORITY COLORS
  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-amber-100 text-amber-700";

      case "Low":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="p-10 dark:text-white">
        Loading tasks...
      </div>
    );
  }

 
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