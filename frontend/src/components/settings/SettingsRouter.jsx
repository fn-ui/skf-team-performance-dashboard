import { useAuth } from "../../contexts/AuthContext";

import SettingsPage from "./SettingsPage";

function SettingsRouter() {
  const { profile } = useAuth();

  const role = String(profile?.role || "").trim().toLowerCase();
  const roleMode = role === "admin" || role === "administrator" ? "admin" : role === "manager" || role === "team manager" ? "manager" : "member";

  return <SettingsPage roleMode={roleMode} />;
}

export default SettingsRouter;
