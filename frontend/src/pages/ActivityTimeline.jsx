import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, CheckSquare, Filter, FolderKanban, GitFork, Search, Target, UserRound } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

const icons = { tasks: CheckSquare, projects: FolderKanban, goals: Target, repository_integrations: GitFork };
const routes = { tasks: "/tasks", projects: "/projects", goals: "/goals", repository_integrations: "/integrations" };

export default function ActivityTimeline() {
  const { profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [period, setPeriod] = useState("30");
  const role = String(profile?.role || "").trim().toLowerCase();
  const roleMode = role === "admin" || role === "administrator" ? "admin" : role === "manager" || role === "team manager" ? "manager" : "member";
  const copy = { admin: ["Organization audit timeline", "Trace portfolio, goal, task, and integration changes across accessible work."], manager: ["Team delivery timeline", "Review changes from projects and delivery work available to your team."], member: ["My activity timeline", "Review your personal changes and activity from projects you can access."] }[roleMode];

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("activity_events").select("*, actor:profiles!activity_events_actor_id_fkey(id, full_name, role), project:projects(id, name)").order("created_at", { ascending: false }).limit(500);
      if (!error) setEvents(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const visible = useMemo(() => events.filter((event) => {
    const age = (Date.now() - new Date(event.created_at).getTime()) / 86400000;
    const text = `${event.action} ${event.record_type} ${event.actor?.full_name || ""} ${event.project?.name || ""} ${event.metadata?.title || event.metadata?.name || ""}`.toLowerCase();
    return (period === "all" || age <= Number(period)) && (type === "all" || event.record_type === type) && text.includes(query.toLowerCase());
  }), [events, period, query, type]);

  const todayCount = events.filter((event) => new Date(event.created_at).toDateString() === new Date().toDateString()).length;
  const actorCount = new Set(events.map((event) => event.actor_id).filter(Boolean)).size;
  const projectCount = new Set(events.map((event) => event.project_id).filter(Boolean)).size;

  return (
    <div className="space-y-4 pb-8">
      <header className="surface-panel p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Audit and accountability</p><h1 className="mt-1 text-3xl font-bold">{copy[0]}</h1><p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{copy[1]}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} scope</span></div></header>
      <div className="grid grid-cols-3 gap-3">{[["Today", todayCount, Activity], ["Contributors", actorCount, UserRound], ["Projects", projectCount, FolderKanban]].map(([label, value, Icon]) => <div key={label} className="surface-panel p-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{label}</p><Icon size={17} className="text-emerald-600" /></div><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</div>
      <section className="surface-panel flex flex-col gap-2 p-3 md:flex-row"><label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-zinc-700"><Search size={16} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, project, or change" className="w-full bg-transparent py-2.5 text-sm outline-none" /></label><label className="flex items-center gap-2"><Filter size={15} className="text-slate-400" /><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm dark:border-zinc-700"><option value="all">All activity</option><option value="projects">Projects</option><option value="tasks">Tasks</option><option value="goals">Goals</option><option value="repository_integrations">Repositories</option></select></label><label className="flex items-center gap-2"><CalendarDays size={15} className="text-slate-400" /><select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm dark:border-zinc-700"><option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option><option value="all">All time</option></select></label></section>
      <section className="surface-panel overflow-hidden">{loading ? <p className="p-8 text-center text-slate-500">Loading activity…</p> : !visible.length ? <div className="p-10 text-center"><Activity className="mx-auto text-slate-300" size={42} /><h2 className="mt-3 font-bold">No activity found</h2><p className="mt-1 text-sm text-slate-500">New project, task, goal, and repository changes will appear here.</p></div> : visible.map((event) => { const Icon = icons[event.record_type] || Activity; const label = event.metadata?.title || event.metadata?.name || event.record_type.replaceAll("_", " "); return <article key={event.id} className="flex gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-zinc-800"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"><Icon size={18} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{event.actor?.full_name || "System"} <span className="font-normal text-slate-500">{event.action}</span> {label}</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 dark:bg-zinc-800">{event.record_type.replaceAll("_", " ")}</span></div><p className="mt-1 text-xs text-slate-500">{event.project?.name || "Workspace activity"} · {new Date(event.created_at).toLocaleString()}</p></div>{routes[event.record_type] && <a href={routes[event.record_type]} className="self-center text-xs font-bold text-emerald-600">Open</a>}</article>; })}</section>
    </div>
  );
}
