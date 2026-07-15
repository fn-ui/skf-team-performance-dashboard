import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, BarChart3, Bell, CalendarDays, CheckSquare, ChevronRight, Command, FileText, FolderKanban, Gauge, GitFork, LayoutDashboard, MessageCircle, Plus, Rocket, Search, Settings, Target, UserRound, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getNotifications, subscribeToNotifications } from "../../services/notificationsService";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, keywords: "overview summary home" },
  { name: "Members", path: "/members", icon: Users, keywords: "team people directory", roles: ["admin", "team manager"] },
  { name: "Projects", path: "/projects", icon: FolderKanban, keywords: "portfolio delivery initiatives" },
  { name: "Tasks", path: "/tasks", icon: CheckSquare, keywords: "work assignments backlog" },
  { name: "Sprints", path: "/sprints", icon: Gauge, keywords: "agile planning capacity velocity backlog standup" },
  { name: "Releases", path: "/releases", icon: Rocket, keywords: "deployment versions production staging approvals rollback" },
  { name: "Team Chat", path: "/chat", icon: MessageCircle, keywords: "messages communication channels" },
  { name: "Performance", path: "/performance", icon: BarChart3, keywords: "analytics productivity metrics" },
  { name: "Reports", path: "/reports", icon: FileText, keywords: "exports summaries documents personal team organization" },
  { name: "Goals", path: "/goals", icon: Target, keywords: "objectives targets okr" },
  { name: "Calendar", path: "/calendar", icon: CalendarDays, keywords: "events schedule deadlines" },
  { name: "Integrations", path: "/integrations", icon: GitFork, keywords: "github repositories source code" },
  { name: "Activity", path: "/activity", icon: Activity, keywords: "audit history changes timeline accountability" },
  { name: "Profile", path: "/profile", icon: UserRound, keywords: "account personal details" },
  { name: "Settings", path: "/settings", icon: Settings, keywords: "configuration security notifications preferences" },
];

const pageMeta = {
  "/": ["Dashboard", "Your team’s delivery overview"],
  "/members": ["Members", "People, roles, and team capacity"],
  "/projects": ["Projects", "Plan and track active initiatives"],
  "/tasks": ["Tasks", "Priorities, assignments, and delivery"],
  "/sprints": ["Sprints", "Capacity, commitments, and delivery planning"],
  "/releases": ["Releases", "Readiness, approvals, and deployment tracking"],
  "/chat": ["Team Chat", "Discuss work and unblock delivery"],
  "/performance": ["Performance", "Productivity and delivery insights"],
  "/reports": ["Reports", "Exportable team performance records"],
  "/goals": ["Goals", "Objectives and measurable outcomes"],
  "/calendar": ["Calendar", "Events, milestones, and deadlines"],
  "/notifications": ["Notifications", "Updates requiring your attention"],
  "/integrations": ["Integrations", "Connected development tools"],
  "/activity": ["Activity", "Audit trail and workspace changes"],
  "/settings": ["Settings", "Workspace configuration"],
  "/profile": ["Profile", "Your account and preferences"],
};

export default function WorkspaceHeader() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const rawRole = String(profile?.role || "member").trim().toLowerCase();
  const role = rawRole === "manager" ? "team manager" : rawRole;
  const [title, description] = pageMeta[location.pathname] || ["Workspace", "Team performance and delivery"];

  const allowedNavigation = useMemo(() => navigation.filter((item) => !item.roles || item.roles.includes(role)), [role]);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return allowedNavigation;
    return allowedNavigation.filter((item) => `${item.name} ${item.keywords}`.toLowerCase().includes(term));
  }, [allowedNavigation, query]);

  useEffect(() => {
    if (!profile?.id) return undefined;
    const load = async () => {
      const items = await getNotifications(profile.id);
      setUnread(items.filter((item) => !item.is_read).length);
    };
    const timer = window.setTimeout(load, 0);
    const channel = subscribeToNotifications(profile.id, load);
    return () => { window.clearTimeout(timer); channel.unsubscribe(); };
  }, [profile?.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setOpen(true); window.setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event) => { if (!containerRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("mousedown", onPointerDown); };
  }, []);

  const go = (path) => { navigate(path); setOpen(false); };
  const canCreate = role === "admin" || role.includes("manager");

  return (
    <header className="sticky top-0 z-40 mb-4 rounded-xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
      <div className="flex items-center gap-3">
        <div className="hidden min-w-0 flex-1 lg:block">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400"><span>WorkPulse</span><ChevronRight size={13} /><span className="text-emerald-600">{title}</span></div>
          <div className="mt-0.5 flex items-baseline gap-3"><h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">{title}</h1><p className="hidden truncate text-xs text-slate-500 xl:block">{description}</p></div>
        </div>

        <div ref={containerRef} className="relative min-w-0 flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input ref={inputRef} value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} placeholder="Search workspace…" aria-label="Search workspace" className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-14 text-sm outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900" />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:border-zinc-700 dark:bg-zinc-800 sm:flex"><Command size={10} />K</kbd>
          {open && <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">{results.length ? results.map((item) => { const Icon = item.icon; return <button key={item.path} onClick={() => go(item.path)} className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-zinc-800"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><Icon size={16} /></span><span className="font-semibold">{item.name}</span><ChevronRight className="ml-auto text-slate-300" size={15} /></button>; }) : <div className="p-6 text-center text-sm text-slate-500">No workspace pages match “{query}”.</div>}</div>}
        </div>

        {canCreate && <div className="group relative hidden sm:block"><button aria-label="Quick create" className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"><Plus size={19} /></button><div className="invisible absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900"><Link to="/projects" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800">New project</Link><Link to="/tasks" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800">New task</Link><Link to="/goals" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800">New goal</Link></div></div>}
        <Link to="/chat" aria-label="Open team chat" className="focus-ring hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 sm:flex"><MessageCircle size={18} /></Link>
        <Link to="/notifications" aria-label={`${unread} unread notifications`} className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"><Bell size={18} />{unread > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}</Link>
      </div>
    </header>
  );
}
