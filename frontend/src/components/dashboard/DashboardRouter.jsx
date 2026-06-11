import { useAuth } from "../../contexts/AuthContext";

import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import MemberDashboard from "./MemberDashboard";

function DashboardRouter() {
  const { profile } = useAuth();

  if (profile?.role === "admin") {
    return <AdminDashboard />;
  }

  if (profile?.role === "manager") {
    return <ManagerDashboard />;
  }

  return <MemberDashboard />;
}

export default DashboardRouter;
