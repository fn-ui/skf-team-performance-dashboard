import { useAuth } from "../../contexts/AuthContext";

import AdminPerformance from "./AdminPerformance";
import ManagerPerformance from "./ManagerPerformance";
import MemberPerformance from "./MemberPerformance";

function PerformanceRouter() {
  const { profile } = useAuth();

  const role =
    profile?.role?.toLowerCase();

  if (role === "admin") {
    return <AdminPerformance />;
  }

  if (role === "team manager" || role === "manager") {
    return <ManagerPerformance />;
  }

  return <MemberPerformance />;
}

export default PerformanceRouter;
