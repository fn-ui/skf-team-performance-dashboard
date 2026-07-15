import { useAuth } from "../../contexts/AuthContext";

import AdminCalendarPage from "./AdminCalendarPage";
import ManagerCalendarPage from "./ManagerCalendarPage";
import MemberCalendarPage from "./MemberCalendarPage";

function CalendarRouter() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="p-5 dark:text-white">
        Loading calendar...
      </div>
    );
  }

  const role = String(profile.role || "").trim().toLowerCase();

  if (role === "admin" || role === "administrator") {
    return <AdminCalendarPage />;
  }

  if (role === "team manager" || role === "manager") {
    return <ManagerCalendarPage />;
  }

  return <MemberCalendarPage />;
}

export default CalendarRouter;
