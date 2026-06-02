import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 dark:from-black dark:via-zinc-950 dark:to-black transition-all duration-300">

      {/* SIDEBAR */}
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default Layout;