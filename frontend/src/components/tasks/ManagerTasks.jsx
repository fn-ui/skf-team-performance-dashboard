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
import { getProjects } from "../../services/projectsService";

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

  const [tasks, setTasks] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
    const [projects, setProjects] =
  useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const tasksPerPage = 6;

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  const [userSearch, setUserSearch] =
    useState("");

  const [selectedUsers, setSelectedUsers] =
    useState([]);

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

  useEffect(() => {
    if (!profile?.id) return;

    loadTasks();
    loadUsers();
    loadProjects();
  }, [profile?.id]);

  const loadTasks =
    async () => {
      try {
        setLoading(true);

        const data =
          await getTasks();

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

 const loadUsers = async () => {
  try {
    const data = await getUsers();

    console.table(data);

    const membersOnly =
  (data || []).filter(
    (user) =>
      user.manager_id ===
      profile?.id
  );

    console.log(
      "FILTERED MEMBERS:",
      membersOnly
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

    const loadProjects =
  async () => {
    try {
      const data =
        await getProjects();

      const managerProjects =
        (data || []).filter(
          (project) =>
            project.manager_id ===
              profile?.id ||
            project.created_by ===
              profile?.id
        );

      setProjects(
        managerProjects
      );
    } catch (error) {
      console.error(
        "FETCH PROJECTS ERROR:",
        error.message
      );

      setProjects([]);
    }
  };

  const filteredUsers =
    users.filter((user) =>
      user.full_name
        ?.toLowerCase()
        .includes(
          userSearch.toLowerCase()
        )
    );

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

  const totalPages = Math.ceil(
    filteredTasks.length /
      tasksPerPage
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
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    priorityFilter,
  ]);

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

  const handleOpenDetails = (
    task
  ) => {
    setSelectedTask(task);

    setIsDetailsOpen(true);
  };

  const handleEditTask = (
  task
) => {

  setEditedTask({
    ...task,
  });

 const assignedUsers =
  task.task_assignees?.map(
    (assignment) =>
      assignment.user_id
  ) || [];

setSelectedUsers(
  assignedUsers
);

const sortedUsers =
  [...users].sort((a, b) => {

    const aAssigned =
      assignedUsers.includes(a.id);

    const bAssigned =
      assignedUsers.includes(b.id);

    if (aAssigned && !bAssigned)
      return -1;

    if (!aAssigned && bAssigned)
      return 1;

    return 0;
  });

setUsers(sortedUsers);

setIsEditOpen(true);
};

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
              
              priority:
                editedTask.priority,
              
              due_date:
                editedTask.due_date,
            }
          );
          await assignTaskUsers(
          editedTask.id,
          selectedUsers
        );
          await loadTasks();
        

        setIsEditOpen(false);

        setEditedTask(null);
      } catch (error) {
        console.error(
          "UPDATE ERROR:",
          error.message
        );
      }
    };

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

  
const handleCreateTask =
  async () => {
    if (!newTask.title)
      return;

    try {


      const primaryAssignee =
        selectedUsers[0];

      const createdTask =
        await createTask({
          title:
            newTask.title,

          description:
            newTask.description,

          project_id:
            newTask.project_id ||
            null,

          assignee_id:
            primaryAssignee ||
            null,

          priority:
            newTask.priority,

          due_date:
            newTask.due_date ||
            null,

          created_by:
            profile?.id ||
            user?.id ||
            null,
        });


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

      await loadTasks();

      setNewTask({
        title: "",
        description: "",
        project_id: "",
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

  if (loading) {
    return (
      <div className="p-5 dark:text-white">
        Loading tasks...
      </div>
    );
  }

 
  return (
    <div className="space-y-6">

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

          <p className="text-slate-500 dark:text-zinc-400">
            Total Tasks
          </p>

          <h2 className="text-3xl font-bold mt-3 dark:text-white">
            {tasks.length}
          </h2>

        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

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

      <div className="flex flex-col lg:flex-row gap-4">

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {paginatedTasks.map((task) => (

          <div
            key={task.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5"
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  {task.title}
                </h2>

                <p className="text-slate-500 mt-2">
                  {task.projects?.name || "No Project"}
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

            <p className="text-slate-500 dark:text-zinc-400 mt-5 leading-relaxed">
              {task.description}
            </p>

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
                  {task.task_assignees?.map(
                  (a) => a.profiles?.full_name
                ).join(", ") || "Unassigned"}
                </h3>
              </div>

            </div>

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
            

            <div className="flex items-center justify-between mt-6">

              <p className="text-sm text-slate-500">
                Due: {task.due_date}
              </p>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    handleOpenDetails(task)
                  }
                  className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >

                  <Eye size={16} />

                </button>

                <button
                  onClick={() =>
                    handleEditTask(task)
                  }
                  className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                >

                  <Pencil size={16} />

                </button>

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

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
        task={selectedTask}
        roleMode="manager"
      />

     <EditTaskModal
  isOpen={isEditOpen}
  onClose={() =>
    setIsEditOpen(false)
  }
  editedTask={editedTask}
  setEditedTask={setEditedTask}
  handleUpdateTask={handleUpdateTask}
  users={users}
  projects={projects}
  selectedUsers={selectedUsers}
  toggleUserSelection={toggleUserSelection}
  role="Team Manager"

/>

     <CreateTaskModal
  isOpen={isCreateOpen}
  onClose={() =>
    setIsCreateOpen(false)
  }
  newTask={newTask}
  setNewTask={setNewTask}
  handleCreateTask={handleCreateTask}
  projects={projects}
  members={users}
  selectedUsers={selectedUsers}
  setSelectedUsers={setSelectedUsers}
/>
      {filteredTasks.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">

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

          <div className="flex items-center gap-2 flex-wrap">

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 dark:text-white disabled:opacity-50"
            >
              Previous
            </button>

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
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition
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
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 dark:text-white disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ManagerTasks;
