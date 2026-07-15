import { useEffect, useState } from "react";
import { CheckSquare, Clock3, Link2, LoaderCircle, Plus } from "lucide-react";
import { addTimeEntry, createSubtask, getSubtasks, getTaskDependencies, getTimeEntries } from "../../services/workManagementService";
import { updateTask } from "../../services/tasksService";

export default function TaskWorkPanel({ task, roleMode = "member" }) {
  const taskId = task.id;
  const [subtasks, setSubtasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [entries, setEntries] = useState([]);
  const [minutes, setMinutes] = useState("");
  const [timeNote, setTimeNote] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    const [subtaskData, dependencyData, timeData] = await Promise.all([getSubtasks(taskId), getTaskDependencies(taskId), getTimeEntries(taskId)]);
    setSubtasks(subtaskData); setDependencies(dependencyData); setEntries(timeData); setLoading(false);
  };
  useEffect(() => { const timer = window.setTimeout(() => load().catch(() => setLoading(false)), 0); return () => window.clearTimeout(timer); }, [taskId]);
  const logTime = async (event) => {
    event.preventDefault();
    const value = Number(minutes);
    if (!value || value < 1) return;
    setSaving(true);
    const entry = await addTimeEntry(taskId, { minutes: value, note: timeNote.trim() || null });
    setEntries((current) => [entry, ...current]); setMinutes(""); setTimeNote(""); setSaving(false);
  };
  const addSubtask = async (event) => {
    event.preventDefault();
    if (!subtaskTitle.trim()) return;
    const item = await createSubtask(taskId, { title: subtaskTitle.trim(), project_id: task.project_id || task.projects?.id || null, status: "Pending", priority: task.priority || "Medium", progress: 0 });
    setSubtasks((current) => [...current, item]); setSubtaskTitle("");
  };
  const toggleSubtask = async (item) => {
    const completed = item.status === "Completed";
    const updated = await updateTask(item.id, { status: completed ? "Pending" : "Completed", progress: completed ? 0 : 100, completed_at: completed ? null : new Date().toISOString() });
    setSubtasks((current) => current.map((entry) => entry.id === item.id ? updated : entry));
  };
  const totalMinutes = entries.reduce((total, entry) => total + Number(entry.minutes || 0), 0);
  const canStructureWork = roleMode === "admin" || roleMode === "manager";
  if (loading) return <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-zinc-800"><LoaderCircle className="animate-spin" size={18} /> Loading work detailsâ€¦</div>;
  return (
    <section className="mt-6"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Task execution</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${roleMode === "admin" ? "bg-purple-100 text-purple-700" : roleMode === "manager" ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-600"}`}>{roleMode === "admin" ? "Admin oversight" : roleMode === "manager" ? "Manager controls" : "Member work view"}</span></div><div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800 md:col-span-2"><div className="flex items-center justify-between gap-2 text-sm font-bold"><span className="flex items-center gap-2"><CheckSquare className="text-emerald-600" size={17} /> Subtasks</span><span>{subtasks.filter((item) => item.status === "Completed").length} / {subtasks.length}</span></div><div className="mt-3 space-y-1.5">{subtasks.map((item) => <button key={item.id} onClick={() => toggleSubtask(item)} className="flex w-full items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-left text-sm dark:bg-zinc-800"><span className={`h-4 w-4 rounded border ${item.status === "Completed" ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-zinc-600"}`} /> <span className={item.status === "Completed" ? "text-slate-400 line-through" : ""}>{item.title}</span></button>)}</div>{canStructureWork && <form onSubmit={addSubtask} className="mt-3 flex gap-2"><input value={subtaskTitle} onChange={(event) => setSubtaskTitle(event.target.value)} placeholder="Add a subtask" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" /><button aria-label="Add subtask" className="rounded-lg bg-emerald-600 p-2 text-white"><Plus size={16} /></button></form>}</div>
      <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800"><div className="flex items-center gap-2 text-sm font-bold"><Link2 className="text-cyan-600" size={17} /> Dependencies</div><p className="mt-3 text-2xl font-bold">{dependencies.length}</p><p className="mt-1 text-xs text-slate-500">linked prerequisite tasks</p></div>
      <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800 md:col-span-2"><div className="flex items-center gap-2 text-sm font-bold"><Clock3 className="text-amber-600" size={17} /> Time logged</div><p className="mt-2 text-xl font-bold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p><form onSubmit={logTime} className="mt-3 grid gap-2 sm:grid-cols-[100px_1fr_auto]"><input type="number" min="1" max="1440" value={minutes} onChange={(event) => setMinutes(event.target.value)} placeholder="Minutes" className="rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-xs dark:border-zinc-700" /><input value={timeNote} onChange={(event) => setTimeNote(event.target.value)} placeholder="What did you work on?" className="min-w-0 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-xs dark:border-zinc-700" /><button disabled={saving} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Log time</button></form></div>
    </div>{roleMode === "member" && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-zinc-800">Members can complete subtasks and log their own work. Managers and administrators control task structure.</p>}</section>
  );
}
