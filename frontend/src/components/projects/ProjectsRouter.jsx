import AdminProjects from "./AdminProjects";
import ManagerProjects from "./ManagerProjects";
import MemberProjects from "./MemberProjects";

import { useAuth } from "../../contexts/AuthContext";

function ProjectsRouter() {
  const { profile } = useAuth();

  // ADMIN
  if (profile?.role === "admin") {
    return <AdminProjects />;
  }

  // MANAGER
  if (
    profile?.role === "manager"
  ) {
    return <ManagerProjects />;
  }

  // MEMBER
  return <MemberProjects />;
}

export default ProjectsRouter;
