import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Layout from "./components/layout/Layout";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      const isDark = saved === "dark";
      if (isDark) document.documentElement.classList.add("dark");
      return isDark;
    } catch {
      return false;
    }
  });

  // TOGGLE THEME
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
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Dashboard
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </Layout>
          }
        />

        <Route
          path="/members"
          element={
            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Members
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </Layout>
          }
        />

         <Route
          path="/projects"
          element={
            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Projects
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </Layout>
          }
        />

         <Route
          path="/tasks"
          element={
            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Tasks
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </Layout>
          }
        />

        
</Routes>

    </BrowserRouter>
  );
}

export default App;