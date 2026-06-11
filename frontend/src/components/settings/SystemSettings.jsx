import { useState } from "react";

import {
  Monitor,
  Globe,
  Moon,
  Sun,
  Clock3,
} from "lucide-react";

function SystemSettings() {
  const [settings, setSettings] =
    useState({
      theme: "Dark",
      language: "English",
      timezone:
        "Africa/Nairobi",
      autoLogout: true,
    });

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings({
      ...settings,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSave = () => {
    console.log(
      "System Settings:",
      settings
    );

    alert(
      "System settings updated!"
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

      {/* HEADER */}
      <div>

        <h2 className="text-2xl font-bold dark:text-white">
          System Settings
        </h2>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Configure appearance,
          language, timezone, and
          system preferences.
        </p>

      </div>

      {/* SETTINGS */}
      <div className="mt-10 space-y-8">

        {/* THEME */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-3">
            Theme
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* DARK */}
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  theme: "Dark",
                })
              }
              className={`p-5 rounded-3xl border transition text-left
                
              ${
                settings.theme ===
                "Dark"
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                  : "border-slate-200 dark:border-zinc-800"
              }`}
            >

              <div className="flex items-center gap-3">

                <Moon className="text-emerald-600" />

                <div>

                  <h3 className="font-bold dark:text-white">
                    Dark Mode
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    Dark interface for
                    low-light environments.
                  </p>

                </div>

              </div>

            </button>

            {/* LIGHT */}
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  theme: "Light",
                })
              }
              className={`p-5 rounded-3xl border transition text-left
                
              ${
                settings.theme ===
                "Light"
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                  : "border-slate-200 dark:border-zinc-800"
              }`}
            >

              <div className="flex items-center gap-3">

                <Sun className="text-amber-500" />

                <div>

                  <h3 className="font-bold dark:text-white">
                    Light Mode
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    Bright interface for
                    daytime productivity.
                  </p>

                </div>

              </div>

            </button>

          </div>

        </div>

        {/* LANGUAGE */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Language
          </label>

          <div className="relative">

            <Globe
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              name="language"
              value={
                settings.language
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            >

              <option>
                English
              </option>

              <option>
                French
              </option>

              <option>
                Spanish
              </option>

            </select>

          </div>

        </div>

        {/* TIMEZONE */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Timezone
          </label>

          <div className="relative">

            <Clock3
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              name="timezone"
              value={
                settings.timezone
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            >

              <option value="Africa/Nairobi">
                Africa/Nairobi
              </option>

              <option value="UTC">
                UTC
              </option>

              <option value="America/New_York">
                America/New_York
              </option>

            </select>

          </div>

        </div>

        {/* AUTO LOGOUT */}
        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">

                <Monitor className="text-blue-600" />

              </div>

              <div>

                <h3 className="text-lg font-bold dark:text-white">
                  Auto Logout
                </h3>

                <p className="text-slate-500 dark:text-zinc-400 mt-1">
                  Automatically log out
                  inactive users after a
                  period of inactivity.
                </p>

              </div>

            </div>

            {/* TOGGLE */}
            <label className="relative inline-flex items-center cursor-pointer">

              <input
                type="checkbox"
                name="autoLogout"
                checked={
                  settings.autoLogout
                }
                onChange={
                  handleChange
                }
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-all"></div>

              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>

            </label>

          </div>

        </div>

      </div>

      {/* SAVE */}
      <div className="flex justify-end mt-10">

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition font-medium"
        >
          Save System Settings
        </button>

      </div>

    </div>
  );
}

export default SystemSettings;