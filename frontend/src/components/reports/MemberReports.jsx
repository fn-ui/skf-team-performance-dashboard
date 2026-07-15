import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Download, FileText, Search, Target } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getTasks } from "../../services/tasksService";

function MemberReports() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const records = await getTasks();
        setTasks(records.filter((task) => task.assignee_id === profile?.id || task.task_assignees?.some((assignment) => assignment.user_id === profile?.id)));
      } finally {
        setLoading(false);
      }
    };
    if (profile?.id) load();
  }, [profile?.id]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase()) || task.projects?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (status === "All" || task.status === status);
  }), [tasks, search, status]);

  const completed = tasks.filter((task) => String(task.status).toLowerCase() === "completed").length;
  const overdue = tasks.filter((task) => task.due_date && String(task.status).toLowerCase() !== "completed" && new Date(task.due_date) < new Date()).length;
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const exportCsv = () => {
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [["Task", "Project", "Status", "Priority", "Progress", "Due date"], ...visibleTasks.map((task) => [task.title, task.projects?.name, task.status, task.priority, task.progress, task.due_date])];
    const blob = new Blob([rows.map((row) => row.map(escape).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-work-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-5 text-slate-500 dark:text-zinc-400">Loading your reports…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Work Reports</h1><p className="text-sm text-slate-500 dark:text-zinc-400">Review and export only the work assigned to you.</p></div>
        <button onClick={exportCsv} disabled={!visibleTasks.length} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Download size={17} /> Export CSV</button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Assigned", tasks.length, FileText, "text-blue-600"], ["Completed", completed, CheckCircle2, "text-emerald-600"], ["Completion", `${completion}%`, Target, "text-violet-600"], ["Overdue", overdue, Clock3, overdue ? "text-red-600" : "text-emerald-600"]].map(([label, value, Icon, tone]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{label}</p><Icon size={17} className={tone} /></div><p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p></div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row dark:border-zinc-800 dark:bg-zinc-900">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-zinc-700"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search task or project" className="w-full bg-transparent py-2 text-sm outline-none dark:text-white" /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700 dark:text-white"><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-zinc-950"><tr><th className="p-3">Task</th><th className="p-3">Project</th><th className="p-3">Status</th><th className="p-3">Progress</th><th className="p-3">Due date</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id} className="border-t border-slate-100 dark:border-zinc-800"><td className="p-3 font-semibold text-slate-800 dark:text-white">{task.title}</td><td className="p-3 text-slate-500">{task.projects?.name || "No project"}</td><td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-zinc-800 dark:text-zinc-300">{task.status}</span></td><td className="p-3 text-slate-600 dark:text-zinc-300">{task.progress || 0}%</td><td className="p-3 text-slate-500">{task.due_date || "No date"}</td></tr>)}</tbody></table></div>
        {!visibleTasks.length && <div className="p-8 text-center text-sm text-slate-500">No assigned work matches these filters.</div>}
      </div>
    </div>
  );
}

export default MemberReports;
