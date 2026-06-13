import { useAuth } from "../../contexts/AuthContext";

import AdminMembers from "./AdminMembers";
import ManagerMembers from "./ManagerMembers";

export default function MembersRouter() {
  const { profile } = useAuth();

  if (profile?.role === "admin") {
    return <AdminMembers />;
  }

  if (profile?.role === "Team Manager") {
    return <ManagerMembers />;
  }

  return (
    <div className="p-6 text-gray-500 text-center">
      Access denied
    </div>
  );
}
