import { useState } from "react";

import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";

function NotificationSettings() {
  const [notifications, setNotifications] =
    useState({
      emailNotifications: true,
      pushNotifications: true,
      taskUpdates: true,
      projectDeadlines: true,
      weeklyReports: false,
      teamMessages: true,
    });

  const handleToggle = (field) => {
    setNotifications({
      ...notifications,
      [field]:
        !notifications[field],
    });
  };

  const handleSave = () => {
    console.log(
      "Notification Settings:",
      notifications
    );

    alert(
      "Notification settings updated!"
    );
  };

  const settings = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description:
        "Receive updates through email notifications.",
      icon: Mail,
    },

    {
      key: "pushNotifications",
      title: "Push Notifications",
      description:
        "Enable push notifications for important alerts.",
      icon: Smartphone,
    },

    {
      key: "taskUpdates",
      title: "Task Updates",
      description:
        "Get notified when tasks are assigned or updated.",
      icon: Bell,
    },

    {
      key: "projectDeadlines",
      title: "Project Deadlines",
      description:
        "Receive reminders for upcoming project deadlines.",
      icon: Bell,
    },

    {
      key: "weeklyReports",
      title: "Weekly Reports",
      description:
        "Receive weekly performance and activity reports.",
      icon: Mail,
    },

    {
      key: "teamMessages",
      title: "Team Messages",
      description:
        "Get notified about new team messages and mentions.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

      {/* HEADER */}
      <div>

        <h2 className="text-2xl font-bold dark:text-white">
          Notification Settings
        </h2>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Manage how you receive
          notifications and updates.
        </p>

      </div>

      {/* SETTINGS LIST */}
      <div className="mt-10 space-y-5">

        {settings.map((setting) => {
          const Icon =
            setting.icon;

          return (
            <div
              key={setting.key}
              className="flex items-center justify-between gap-5 p-5 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950"
            >

              {/* LEFT */}
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

                  <Icon className="text-emerald-600" />

                </div>

                <div>

                  <h3 className="font-bold dark:text-white">
                    {
                      setting.title
                    }
                  </h3>

                  <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">
                    {
                      setting.description
                    }
                  </p>

                </div>

              </div>

              {/* TOGGLE */}
              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  checked={
                    notifications[
                      setting.key
                    ]
                  }
                  onChange={() =>
                    handleToggle(
                      setting.key
                    )
                  }
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-all"></div>

                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>

              </label>

            </div>
          );
        })}

      </div>

      {/* SAVE */}
      <div className="flex justify-end mt-10">

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition font-medium"
        >
          Save Notification Settings
        </button>

      </div>

    </div>
  );
}

export default NotificationSettings;