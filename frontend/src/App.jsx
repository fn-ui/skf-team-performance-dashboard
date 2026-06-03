import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Layout from "./components/layout/Layout";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // LOAD SAVED THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

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
            <Layout>
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
            <Layout>
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
            <Layout>
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
            <Layout>
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