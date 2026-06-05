import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // LOAD SAVED THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // TOGGLE DARK MODE
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

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
          pl-6

          lg:pt-6
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