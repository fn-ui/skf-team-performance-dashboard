import { AlertTriangle, CalendarCheck2, Clock3 } from "lucide-react";

function CalendarFocusPanel({ events = [], roleMode }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((event) => event.date && new Date(event.date) >= today && event.status !== "Completed").sort((a, b) => new Date(`${a.date}T${a.time || "00:00"}`) - new Date(`${b.date}T${b.time || "00:00"}`));
  const overdue = events.filter((event) => event.date && new Date(event.date) < today && event.status !== "Completed");
  const slots = new Map();
  events.forEach((event) => {
    if (!event.date || !event.time) return;
    const key = `${event.date}-${event.time}`;
    slots.set(key, (slots.get(key) || 0) + 1);
  });
  const conflicts = [...slots.values()].filter((count) => count > 1).length;
  const labels = {
    admin: ["Organization planning pulse", "Review cross-team deadlines and scheduling pressure."],
    manager: ["Team planning pulse", "Resolve delivery conflicts before they affect the sprint."],
    member: ["My planning pulse", "Stay focused on your next commitment and overdue items."],
  }[roleMode];
  const next = upcoming[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-bold text-slate-900 dark:text-white">{labels[0]}</h2><p className="text-xs text-slate-500 dark:text-zinc-400">{labels[1]}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} view</span></div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30"><CalendarCheck2 size={18} className="text-emerald-600" /><div className="min-w-0"><p className="text-xs text-slate-500">Next commitment</p><p className="truncate text-sm font-bold text-slate-800 dark:text-white">{next ? `${next.title} · ${next.date}` : "Schedule is clear"}</p></div></div>
        <div className={`flex items-center gap-3 rounded-xl p-3 ${overdue.length ? "bg-red-50 dark:bg-red-950/30" : "bg-slate-50 dark:bg-zinc-950"}`}><Clock3 size={18} className={overdue.length ? "text-red-600" : "text-emerald-600"} /><div><p className="text-xs text-slate-500">Overdue events</p><p className="text-sm font-bold text-slate-800 dark:text-white">{overdue.length}</p></div></div>
        <div className={`flex items-center gap-3 rounded-xl p-3 ${conflicts ? "bg-amber-50 dark:bg-amber-950/30" : "bg-slate-50 dark:bg-zinc-950"}`}><AlertTriangle size={18} className={conflicts ? "text-amber-600" : "text-emerald-600"} /><div><p className="text-xs text-slate-500">Time conflicts</p><p className="text-sm font-bold text-slate-800 dark:text-white">{conflicts}</p></div></div>
      </div>
    </section>
  );
}

export default CalendarFocusPanel;
