import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembersRouter from "./components/members/MembersRouter";
import ProjectsRouter from "./components/projects/ProjectsRouter";
import TasksRouter from "./components/tasks/TasksRouter";
import PerformanceRouter from "./components/performance/PerformanceRouter";
import ReportsRouter from "./components/reports/ReportsRouter";
import GoalsRouter from "./components/goals/GoalsRouter";
import DashboardRouter from "./components/dashboard/DashboardRouter";
import SettingsRouter from "./components/settings/SettingsRouter";
import CalendarRouter from "./components/calendar/CalendarRouter";
import Layout from "./components/layout/Layout";



import AdminUsers from "./pages/Admin/Users";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Auth/Login";
import AuthCallback from "./pages/AuthCallback";
import UpdatePassword from "./pages/UpdatePassword";
import Profile from "./pages/Profile";

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

        <Route path="/login" element={<Login />} />

        <Route
            path="/auth/callback"
            element={<AuthCallback />}
          />

          <Route
          path="/update-password"
          element={<UpdatePassword />}
        />
        <Route
  path="/profile"
  element={
    <RequireAuth>
      <Layout
        darkMode={darkMode}
        toggleDarkMode={
          toggleDarkMode
        }
      >
        <Profile />
      </Layout>
    </RequireAuth>
  }
/>

        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <DashboardRouter />
              </Layout>
            </RequireAuth>
          }
        />

         <Route
            path="/members"
            element={
              <RequireAuth allowed={["admin", "Team Manager"]}>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <MembersRouter />
                </Layout>
              </RequireAuth>
            }
          />

         <Route
          path="/projects"
          element={
            <RequireAuth>
              <Layout
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              >
                <ProjectsRouter />
              </Layout>
            </RequireAuth>
          }
        />

         <Route
        path="/tasks"
        element={
          <RequireAuth>
            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <TasksRouter />
            </Layout>
          </RequireAuth>
        }
      />

        <Route
          path="/performance"
          element={
            <RequireAuth>
              <Layout
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              >
                <PerformanceRouter />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/reports"
          element={
            <RequireAuth allowed={["admin", "Team Manager"]}>
              <Layout
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              >
                <ReportsRouter />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
        path="/goals"
        element={
          <RequireAuth>
            <Layout
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            >
              <GoalsRouter />
            </Layout>
          </RequireAuth>
        }
      />

             <Route
  path="/calendar"
  element={
    <RequireAuth>
      <Layout
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      >
        <CalendarRouter />
      </Layout>
    </RequireAuth>
  }
/>

        <Route
          path="/settings"
          element={
            <RequireAuth allowed={["admin"]}>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <SettingsRouter />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RequireAuth allowed={["admin"]}>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <AdminUsers />
              </Layout>
            </RequireAuth>
          }
        />

        
</Routes>

    </BrowserRouter>
  );
}

export default App;
