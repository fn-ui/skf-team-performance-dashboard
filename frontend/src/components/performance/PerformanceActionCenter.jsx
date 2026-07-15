import { AlertTriangle, CheckCircle2, Clock3, Users } from "lucide-react";

function PerformanceActionCenter({ roleMode, tasks = [], projects = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completed = tasks.filter((task) => String(task.status).toLowerCase() === "completed");
  const overdue = tasks.filter((task) => task.due_date && String(task.status).toLowerCase() !== "completed" && new Date(task.due_date) < today);
  const unassigned = tasks.filter((task) => !task.assigned_to && !task.owner_id && !task.assignee_id && !task.task_assignees?.length);
  const atRisk = projects.filter((project) => {
    const status = String(project.status || "").toLowerCase();
    return status.includes("risk") || status.includes("blocked") || (status === "active" && Number(project.progress || 0) < 35);
  });
  const completion = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;
  const content = {
    admin: ["Organization action center", "Portfolio signals that need leadership attention.", "Unassigned work", unassigned.length, "Clarify ownership across teams"],
    manager: ["Team coaching center", "Delivery signals to review with your team.", "Unassigned work", unassigned.length, "Assign before the next stand-up"],
    member: ["My improvement center", "A focused view of the work you can act on now.", "Open work", Math.max(0, tasks.length - completed.length), "Prioritize the closest deadline"],
  }[roleMode];
  const items = [
    ["Completion rate", `${completion}%`, `${completed.length} tasks completed`, CheckCircle2, "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"],
    ["Overdue", overdue.length, overdue.length ? "Review dates and blockers" : "No overdue work", Clock3, overdue.length ? "text-red-600 bg-red-50 dark:bg-red-950/40" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"],
    ["At-risk projects", atRisk.length, atRisk.length ? "Open a recovery plan" : "Portfolio health is stable", AlertTriangle, atRisk.length ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40" : "text-slate-500 bg-slate-100 dark:bg-zinc-800"],
    [content[2], content[3], content[4], Users, "text-blue-600 bg-blue-50 dark:bg-blue-950/40"],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="font-bold text-slate-900 dark:text-white">{content[0]}</h2><p className="text-xs text-slate-500 dark:text-zinc-400">{content[1]}</p></div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} view</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
        {items.map(([label, value, hint, Icon, tone]) => (
          <div key={label} className="rounded-xl border border-slate-100 p-3 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{label}</p><span className={`rounded-lg p-1.5 ${tone}`}><Icon size={15} /></span></div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</p><p className="mt-1 truncate text-[11px] text-slate-500 dark:text-zinc-500">{hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PerformanceActionCenter;
