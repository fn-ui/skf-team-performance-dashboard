import { useAuth } from "../../contexts/AuthContext";

import AdminCalendarPage from "./AdminCalendarPage";
import ManagerCalendarPage from "./ManagerCalendarPage";
import MemberCalendarPage from "./MemberCalendarPage";

function CalendarRouter() {
  const { profile } = useAuth();

  // ⏳ WAIT FOR PROFILE
  if (!profile) {
    return (
      <div className="p-10 dark:text-white">
        Loading calendar...
      </div>
    );
  }

  // 👑 ADMIN
  if (profile.role === "admin") {
    return <AdminCalendarPage />;
  }

  // 🧑‍💼 MANAGER
  if (profile.role === "Team Manager") {
    return <ManagerCalendarPage />;
  }

  // 👤 MEMBER
  return <MemberCalendarPage />;
}

export default CalendarRouter;