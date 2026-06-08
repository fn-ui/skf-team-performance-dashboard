import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children, darkMode, toggleDarkMode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-slate-100 via-slate-50 to-emerald-50
        dark:from-black dark:via-zinc-950 dark:to-black
      "
    >
      {/* SIDEBAR */}
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* PAGE CONTENT */}
      <main
        className={`
          min-h-screen
          transition-all duration-300
          overflow-x-hidden

          pt-6
          pb-6
          pr-6
          pl-4 sm:pl-6

          
          ${
            collapsed
      ? "lg:ml-24"
      : "lg:ml-[19rem]"
          }
        `}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;