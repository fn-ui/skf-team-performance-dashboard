import { useAuth } from "../../contexts/AuthContext";

import AdminPerformance from "./AdminPerformance";
import ManagerPerformance from "./ManagerPerformance";
import MemberPerformance from "./MemberPerformance";

function PerformanceRouter() {
  const { profile } = useAuth();

  // ROLE
  const role =
    profile?.role?.toLowerCase();

  // ADMIN
  if (role === "admin") {
    return <AdminPerformance />;
  }

  // MANAGER
  if (
    role === "Team Manager" ||
    role === "team manager"
  ) {
    return <ManagerPerformance />;
  }

  // MEMBER
  return <MemberPerformance />;
}

export default PerformanceRouter;