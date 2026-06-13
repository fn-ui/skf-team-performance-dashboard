import { useAuth } from "../../contexts/AuthContext";

import AdminReports from "./AdminReports";
import ManagerReports from "./ManagerReports";

function ReportsRouter() {
  const { profile } = useAuth();

  const role =
    profile?.role?.toLowerCase();

  // ADMIN
  if (role === "admin") {
    return <AdminReports />;
  }

  // MANAGER
  if (
    role === "Team Manager" ||
    role === "team manager"
  ) {
    return <ManagerReports />;
  }

  // BLOCK MEMBERS
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">

      <h1 className="text-3xl font-bold dark:text-white">
        Access Restricted
      </h1>

      <p className="text-slate-500 dark:text-zinc-400 mt-4 text-lg">
        You do not have permission to access reports.
      </p>

    </div>
  );
}

export default ReportsRouter;