import { useAuth } from "../../contexts/AuthContext";

import AdminTasks from "./AdminTasks";
import ManagerTasks from "./ManagerTasks";
import MemberTasks from "./MemberTasks";

function TasksRouter() {
  const { profile } = useAuth();

  if (profile?.role === "admin") {
    return <AdminTasks />;
  }

  if (profile?.role === "Team Manager") {
    return <ManagerTasks />;
  }

  return <MemberTasks />;
}

export default TasksRouter;
