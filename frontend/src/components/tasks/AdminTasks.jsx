import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
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
  Trash2,
  Pencil,
  Eye,
  Users,
} from "lucide-react";

function AdminTasks() {
  const { user } = useAuth();

  const [tasks, setTasks] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // 🔎 FILTERS
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

      // 📄 PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const tasksPerPage = 10;

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  // 👥 USER SEARCH
  const [userSearch, setUserSearch] =
    useState("");

  // 👥 ASSIGNED USERS
  const [
    selectedUsers,
    setSelectedUsers,
  ] = useState([]);

  // MODALS
  const [
    isCreateOpen,
    setIsCreateOpen,
  ] = useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  // SELECTED TASKS
  const [
    selectedTask,
    setSelectedTask,
  ] = useState(null);

  const [editedTask, setEditedTask] =
    useState(null);

  // 🆕 NEW TASK
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
    fetchTasks();
    fetchUsers();
  }, []);

  // 📦 FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data || []);
    } catch (error) {
      console.error(
        "FETCH TASKS ERROR:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // 👥 FETCH USERS
  const fetchUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data || []);
    } catch (error) {
      console.error(
        "FETCH USERS ERROR:",
        error.message
      );
    }
  };

  // 🔎 FILTERED USERS
  const filteredUsers = users.filter(
    (user) =>
      user.full_name
        ?.toLowerCase()
        .includes(
          userSearch.toLowerCase()
        )
  );

  // 🔎 FILTERED TASKS
  const filteredTasks = tasks
    .filter((task) =>
      task.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((task) =>
      statusFilter === "All"
        ? true
        : task.status === statusFilter
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority ===
          priorityFilter
    );


      // 📄 PAGINATED TASKS
  const totalPages = Math.ceil(
    filteredTasks.length / tasksPerPage
  );

  const startIndex =
    (currentPage - 1) *
    tasksPerPage;

  const endIndex =
    startIndex + tasksPerPage;

  const paginatedTasks =
    filteredTasks.slice(
      startIndex,
      endIndex
    );

      // 🔄 RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    priorityFilter,
  ]);
  // 👥 SELECT USERS
  const toggleUserSelection = (
    userId
  ) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter(
            (id) => id !== userId
          )
        : [...prev, userId]
    );
  };

  // 🗑 DELETE TASK
  const handleDeleteTask = async (
    id
  ) => {
    try {
      await deleteTask(id);

      setTasks((prev) =>
        prev.filter(
          (task) => task.id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error.message
      );
    }
  };

  // 👁 OPEN DETAILS
  const handleOpenDetails = (
    task
  ) => {
    setSelectedTask(task);

    setIsDetailsOpen(true);
  };

  
  // ✏️ OPEN EDIT
const handleEditTask = (task) => {

  setEditedTask({
    ...task,
  });

  // ✅ GET ASSIGNED USER IDS
  const assignedUserIds =
  (task.task_assignees ?? [])
    .map(a => a.user_id)
    .filter(Boolean);

  // ✅ PRESELECT ASSIGNED USERS
  setSelectedUsers(assignedUserIds);

  // ✅ SORT USERS → ASSIGNED USERS FIRST
  const sortedUsers = [...users].sort(
    (a, b) => {
      const aAssigned =
        assignedUserIds.includes(a.id);

      const bAssigned =
        assignedUserIds.includes(b.id);

      if (aAssigned && !bAssigned)
        return -1;

      if (!aAssigned && bAssigned)
        return 1;

      return 0;
    }
  );

  setUsers(sortedUsers);

  setIsEditOpen(true);
};
  // 💾 UPDATE TASK
  const handleUpdateTask =
  async () => {
    try {

      const payload = {
        title:
          editedTask.title,

        description:
          editedTask.description,

        project_id:
          editedTask.project_id,

        priority:
          editedTask.priority,

        due_date:
          editedTask.due_date,
      };

      const updated =
        await updateTask(
          editedTask.id,
          payload
        );

      // 🔥 UPDATE ASSIGNED USERS
      await assignTaskUsers(
        editedTask.id,
        selectedUsers
      );
       await fetchTasks();
      

      setIsEditOpen(false);

      setEditedTask(null);

    } catch (error) {

      console.error(
        "UPDATE ERROR:",
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

      /* ================= PRIMARY ASSIGNEE ================= */

      const primaryAssignee =
        selectedUsers[0] ||
        null;

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
            user?.id || null,

          // ✅ SAVE ASSIGNEE
          assignee_id:
            primaryAssignee,
        });

      /* ================= MULTIPLE ASSIGNEES ================= */

      if (
        selectedUsers.length > 0
      ) {

        const assigneesPayload =
          selectedUsers.map(
            (userId) => ({
              task_id:
                createdTask.id,

              user_id:
                userId,
            })
          );

        const { error } =
          await supabase
            .from(
              "task_assignees"
            )
            .insert(
              assigneesPayload
            );

        if (error)
          throw error;
      }

      // 🔄 REFRESH TASKS
      await fetchTasks();

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
        task.status === "Pending"
    ).length;

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

              {paginatedTasks.map((task) => (

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
                    {task.projects?.name || "No Project"}
                  </td>

                  {/* ASSIGNEE */}
                  <td className="px-6 py-5 dark:text-white">
                    {task.task_assignees?.map(
                    (a) => a.profiles?.full_name
                  ).join(", ") || "Unassigned"}
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
                    {task.due_date}
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


      {/* PAGINATION */}
      {filteredTasks.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">

          {/* PAGE INFO */}
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Showing{" "}
            {startIndex + 1}
            {" "}to{" "}
            {Math.min(
              endIndex,
              filteredTasks.length
            )}{" "}
            of{" "}
            {filteredTasks.length} tasks
          </p>

          {/* CONTROLS */}
          <div className="flex items-center gap-2">

            {/* PREVIOUS */}
            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(prev - 1, 1)
                )
              }
              disabled={
                currentPage === 1
              }
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:text-white disabled:opacity-50"
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}
            {Array.from(
              { length: totalPages },
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(
                      index + 1
                    )
                  }
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition
                    ${
                      currentPage ===
                      index + 1
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-200 dark:border-zinc-700 dark:text-white"
                    }
                  `}
                >
                  {index + 1}
                </button>
              )
            )}

            {/* NEXT */}
            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:text-white disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}
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

  // 👥 USERS
  users={users}
  selectedUsers={selectedUsers}
  setSelectedUsers={setSelectedUsers}
  userSearch={userSearch}
  setUserSearch={setUserSearch}
  role="admin"
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

  // 👥 USERS
  users={users}
  selectedUsers={selectedUsers}
  setSelectedUsers={setSelectedUsers}
  userSearch={userSearch}
  setUserSearch={setUserSearch}
/>

    </div>
  );
}

export default AdminTasks;