import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/RequireAuth";

const DashboardRouter = lazy(() => import("./components/dashboard/DashboardRouter"));
const MembersRouter = lazy(() => import("./components/members/MembersRouter"));
const ProjectsRouter = lazy(() => import("./components/projects/ProjectsRouter"));
const TasksRouter = lazy(() => import("./components/tasks/TasksRouter"));
const PerformanceRouter = lazy(() => import("./components/performance/PerformanceRouter"));
const ReportsRouter = lazy(() => import("./components/reports/ReportsRouter"));
const GoalsRouter = lazy(() => import("./components/goals/GoalsRouter"));
const SettingsRouter = lazy(() => import("./components/settings/SettingsRouter"));
const CalendarRouter = lazy(() => import("./components/calendar/CalendarRouter"));
const Login = lazy(() => import("./pages/Auth/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Chat = lazy(() => import("./pages/Chat"));
const Integrations = lazy(() => import("./pages/Integrations"));
const ActivityTimeline = lazy(() => import("./pages/ActivityTimeline"));
const Sprints = lazy(() => import("./pages/Sprints"));
const Releases = lazy(() => import("./pages/Releases"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading workspaceâ€¦</div>}>
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
              path="/reset-password"
              element={<ResetPassword />}
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
            <RequireAuth>
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
          path="/notifications"
          element={
            <RequireAuth>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Notifications />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Chat />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/integrations"
          element={
            <RequireAuth>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Integrations />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <SettingsRouter />
              </Layout>
            </RequireAuth>
          }
        />

        <Route path="/activity" element={<RequireAuth><Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><ActivityTimeline /></Layout></RequireAuth>} />
        <Route path="/sprints" element={<RequireAuth><Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><Sprints /></Layout></RequireAuth>} />
        <Route path="/releases" element={<RequireAuth><Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><Releases /></Layout></RequireAuth>} />

        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <NotFound />
              </Layout>
            </RequireAuth>
          }
        />

        
</Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
