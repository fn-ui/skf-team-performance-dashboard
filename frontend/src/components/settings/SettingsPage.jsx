import { useState } from "react";

import {
  User,
  ShieldCheck,
  Bell,
} from "lucide-react";

import ProfileSettings from "./ProfileSettings";

import SecuritySettings from "./SecuritySettings";

import NotificationSettings from "./NotificationSettings";

function SettingsPage() {

  const [activeTab, setActiveTab] =
    useState("Profile");

  const tabs = [
    {
      name: "Profile",
      icon: User,
    },

    {
      name: "Security",
      icon: ShieldCheck,
    },

    {
      name: "Notifications",
      icon: Bell,
    },
  ];

  const renderContent = () => {

    switch (activeTab) {

      case "Profile":
        return <ProfileSettings />;

      case "Security":
        return <SecuritySettings />;

      case "Notifications":
        return (
          <NotificationSettings />
        );

      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold dark:text-white">
          Admin Settings
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Manage your admin account,
          security preferences, and
          notifications.
        </p>

      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-4 h-fit">

          <div className="space-y-2">

            {tabs.map((tab) => {

              const Icon = tab.icon;

              return (
                <button
                  key={tab.name}
                  onClick={() =>
                    setActiveTab(
                      tab.name
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-left

                  ${
                    activeTab ===
                    tab.name
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-slate-100 dark:hover:bg-zinc-800 dark:text-white"
                  }`}
                >

                  <Icon size={18} />

                  {tab.name}

                </button>
              );
            })}

          </div>

        </div>

        {/* CONTENT */}
        <div className="lg:col-span-3">

          {renderContent()}

        </div>

      </div>

    </div>
  );
}

export default SettingsPage;