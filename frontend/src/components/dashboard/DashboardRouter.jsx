import { useAuth } from "../../contexts/AuthContext";

import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import MemberDashboard from "./MemberDashboard";

function DashboardRouter() {
  const { profile, loading } = useAuth();

  // ⏳ WAIT FOR PROFILE TO LOAD
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  // 🚨 SAFETY CHECK (prevents crashes)
  if (!profile) {
    return (
      <div className="p-6 text-center text-red-500">
        No profile found
      </div>
    );
  }

  const role = profile.role;
 

  // 🔐 ROLE ROUTING
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "Team Manager") {
    return <ManagerDashboard />;
  }

  return <MemberDashboard />;
}

export default DashboardRouter;