import { useAuth } from "../../contexts/AuthContext";

import AdminGoals from "./AdminGoals";
import ManagerGoals from "./ManagerGoals";
import MemberGoals from "./MemberGoals";

function GoalsRouter() {
  const { profile } = useAuth();

  // LOADING
  if (!profile) {
    return (
      <div className="p-10 dark:text-white">
        Loading goals...
      </div>
    );
  }

  // ADMIN
  if (profile.role === "admin") {
    return <AdminGoals />;
  }

  // MANAGER
  if (profile.role === "Team Manager") {
    return <ManagerGoals />;
  }

  // MEMBER
  if (profile.role === "member") {
    return <MemberGoals />;
  }

  // FALLBACK
  return (
    <div className="p-10 text-red-500">
      Unauthorized Access
    </div>
  );
}

export default GoalsRouter;