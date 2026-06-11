import { useAuth } from "../../contexts/AuthContext";

import SettingsPage from "./SettingsPage";

function SettingsRouter() {
  const { profile } = useAuth();

  // ONLY ADMIN ACCESS
  if (profile?.role !== "admin") {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">

        <h2 className="text-3xl font-bold dark:text-white">
          Access Denied
        </h2>

        <p className="text-slate-500 dark:text-zinc-400 mt-3">
          Only administrators can
          access system settings.
        </p>

      </div>
    );
  }

  return <SettingsPage />;
}

export default SettingsRouter;