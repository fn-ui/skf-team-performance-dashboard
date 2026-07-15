import AdminProjects from "./AdminProjects";
import ManagerProjects from "./ManagerProjects";
import MemberProjects from "./MemberProjects";

import { useAuth } from "../../contexts/AuthContext";

function ProjectsRouter() {
  const { profile } = useAuth();

  if (profile?.role === "admin") {
    return <AdminProjects />;
  }

  if (
    profile?.role === "Team Manager"
  ) {
    return <ManagerProjects />;
  }

  return <MemberProjects />;
}

export default ProjectsRouter;
