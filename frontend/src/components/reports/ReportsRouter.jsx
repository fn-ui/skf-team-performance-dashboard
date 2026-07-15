import { useAuth } from "../../contexts/AuthContext";

import AdminReports from "./AdminReports";
import ManagerReports from "./ManagerReports";
import MemberReports from "./MemberReports";

function ReportsRouter() {
  const { profile } = useAuth();

  const role = profile?.role?.trim().toLowerCase();

  if (role === "admin") {
    return <AdminReports />;
  }

  if (
    role === "team manager" ||
    role === "manager"
  ) {
    return <ManagerReports />;
  }

  return <MemberReports />;
}

export default ReportsRouter;
