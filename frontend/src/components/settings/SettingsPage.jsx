import { useState } from "react";

import {
  User,
  ShieldCheck,
  Bell,
  SlidersHorizontal,
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
    <div className="space-y-7 pb-8">

      {/* HEADER */}
      <div className="surface-panel overflow-hidden p-0">
        <div className="relative bg-[linear-gradient(135deg,rgba(6,95,70,0.95),rgba(8,145,178,0.9),rgba(146,64,14,0.88))] p-6 text-white sm:p-8">
          <div className="fine-noise absolute inset-0 opacity-20" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-emerald-50">
                <SlidersHorizontal size={14} />
                Control center
              </div>

              <h1 className="text-3xl font-bold text-white">
                Admin Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/80">
                Manage account identity, security posture, and notification preferences from one focused workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur lg:hidden">
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
                    className={`focus-ring flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-xs font-semibold transition ${
                      activeTab ===
                      tab.name
                        ? "bg-white text-emerald-950 shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        {/* SIDEBAR */}
        <div className="surface-panel hidden h-fit p-4 lg:block">

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
                  className={`focus-ring flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition

                  ${
                    activeTab ===
                    tab.name
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
