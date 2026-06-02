import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 dark:from-black dark:via-zinc-950 dark:to-black transition-all duration-300">

      {/* SIDEBAR */}
      <Sidebar />

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default Layout;