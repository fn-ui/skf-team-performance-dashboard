import Sidebar from "../components/layout/Sidebar";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-slate-800">
          Team Performance Dashboard
        </h1>

      </main>
    </div>
  );
}

export default Dashboard;