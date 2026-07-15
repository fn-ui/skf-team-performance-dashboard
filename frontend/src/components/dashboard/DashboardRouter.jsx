import { useAuth } from "../../contexts/AuthContext";

import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import MemberDashboard from "./MemberDashboard";

function DashboardRouter() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-5 text-center text-red-500">
        No profile found
      </div>
    );
  }

  const role = profile.role;
 

  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "Team Manager") {
    return <ManagerDashboard />;
  }

  return <MemberDashboard />;
}

export default DashboardRouter;
