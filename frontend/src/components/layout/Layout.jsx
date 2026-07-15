import { useState } from "react";
import Sidebar from "./Sidebar";
import WorkspaceHeader from "./WorkspaceHeader";

function Layout({ children, darkMode, toggleDarkMode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[linear-gradient(135deg,#f6faf7_0%,#eef8f4_42%,#f8f1e8_100%)]
        text-slate-900
        dark:bg-[linear-gradient(135deg,#050807_0%,#071310_48%,#14100a_100%)]
        dark:text-white
      "
    >
      <div className="dashboard-grid pointer-events-none fixed inset-0 opacity-70 dark:opacity-35" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,rgba(16,185,129,0.14),transparent_32%,rgba(245,158,11,0.12)_72%,transparent)] dark:bg-[linear-gradient(120deg,rgba(16,185,129,0.11),transparent_36%,rgba(245,158,11,0.08)_78%,transparent)]" />

      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`
          relative z-10
          min-h-screen
          transition-all duration-300
          overflow-x-hidden

          px-3
          py-4
          sm:px-6
          lg:py-5

          
          ${
            collapsed
      ? "lg:ml-24"
      : "lg:ml-[19rem]"
          }
        `}
      >
        <WorkspaceHeader />
        {children}
      </main>
    </div>
  );
}

export default Layout;
