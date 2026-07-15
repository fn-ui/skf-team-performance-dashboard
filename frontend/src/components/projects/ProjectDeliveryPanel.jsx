import { useEffect, useState } from "react";
import { Flag, LoaderCircle, Plus, Radio } from "lucide-react";
import { createProjectMilestone, createProjectStatusUpdate, getProjectMilestones, getProjectStatusUpdates } from "../../services/workManagementService";

export default function ProjectDeliveryPanel({ projectId, roleMode = "member" }) {
  const [milestones, setMilestones] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [health, setHealth] = useState("On track");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => Promise.all([getProjectMilestones(projectId), getProjectStatusUpdates(projectId)]).then(([milestoneData, updateData]) => { setMilestones(milestoneData); setUpdates(updateData); setLoading(false); }).catch(() => setLoading(false)), 0);
    return () => window.clearTimeout(timer);
  }, [projectId]);
  const addMilestone = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    const milestone = await createProjectMilestone(projectId, { title: title.trim() });
    setMilestones((current) => [milestone, ...current]); setTitle("");
  };
  const postUpdate = async (event) => {
    event.preventDefault();
    if (!summary.trim()) return;
    const update = await createProjectStatusUpdate(projectId, { health, summary: summary.trim() });
    setUpdates((current) => [update, ...current]); setSummary("");
  };
  const canManage = roleMode === "admin" || roleMode === "manager";
  const accessLabel = roleMode === "admin" ? "Admin oversight" : roleMode === "manager" ? "Manager controls" : "Member view";
  if (loading) return <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-zinc-800"><LoaderCircle className="animate-spin" size={17} /> Loading delivery details…</div>;
  return (
    <section className="mt-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Delivery management</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${roleMode === "admin" ? "bg-purple-100 text-purple-700" : roleMode === "manager" ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-600"}`}>{accessLabel}</span></div><div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 font-bold"><Flag className="text-amber-600" size={18} /> Milestones</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-zinc-800">{milestones.length}</span></div>{milestones.length ? <div className="mt-3 space-y-2">{milestones.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-zinc-800"><span className="truncate font-medium">{item.title}</span><span className="ml-2 text-xs text-slate-400">{item.status}</span></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No milestones added.</p>}{canManage && <form onSubmit={addMilestone} className="mt-3 flex gap-2"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add milestone" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" /><button className="rounded-lg bg-emerald-600 p-2 text-white"><Plus size={16} /></button></form>}</div>
      <div className="rounded-xl border border-slate-200 p-4 dark:border-zinc-800"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 font-bold"><Radio className="text-emerald-600" size={18} /> Status updates</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-zinc-800">{updates.length}</span></div>{updates.length ? <div className="mt-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${updates[0].health === "On track" ? "bg-emerald-100 text-emerald-700" : updates[0].health === "Off track" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{updates[0].health}</span><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">{updates[0].summary}</p><time className="mt-2 block text-xs text-slate-400">{new Date(updates[0].created_at).toLocaleDateString()}</time></div> : <p className="mt-3 text-sm text-slate-500">No status update has been posted.</p>}{canManage && <form onSubmit={postUpdate} className="mt-3 space-y-2"><select value={health} onChange={(event) => setHealth(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"><option>On track</option><option>At risk</option><option>Off track</option></select><div className="flex gap-2"><input value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Post a status update" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" /><button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Post</button></div></form>}</div>
    </div>{roleMode === "member" && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-zinc-800">Members can review milestones and status updates. Project changes are managed by the assigned manager and administrators.</p>}</section>
  );
}
