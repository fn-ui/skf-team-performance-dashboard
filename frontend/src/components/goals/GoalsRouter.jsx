import { useAuth } from "../../contexts/AuthContext";

import AdminGoals from "./AdminGoals";
import ManagerGoals from "./ManagerGoals";
import MemberGoals from "./MemberGoals";

function GoalsRouter() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="p-5 dark:text-white">
        Loading goals...
      </div>
    );
  }

  const role = String(profile.role || "")
    .trim()
    .toLowerCase();

  if (role === "admin" || role === "administrator") {
    return <AdminGoals />;
  }

  if (role === "team manager" || role === "manager") {
    return <ManagerGoals />;
  }

  if (role === "member" || role === "team member" || role === "user") {
    return <MemberGoals />;
  }

  return <MemberGoals />;
}

export default GoalsRouter;
