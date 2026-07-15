import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, LoaderCircle, Trash2, AtSign, FolderKanban, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clearNotifications, deleteNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead, subscribeToNotifications } from "../services/notificationsService";

export default function Notifications() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    if (!user?.id) return;
    setItems(await getNotifications(user.id));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
    if (!user?.id) return undefined;
    const channel = subscribeToNotifications(user.id, load);
    return () => channel.unsubscribe();
  }, [load, user?.id]);

  const unread = useMemo(() => items.filter((item) => !item.is_read).length, [items]);
  const role = String(profile?.role || "").trim().toLowerCase();
  const roleMode = role === "admin" || role === "administrator" ? "admin" : role === "manager" || role === "team manager" ? "manager" : "member";
  const roleCopy = {
    admin: "Organization decisions, escalations, and portfolio updates.",
    manager: "Team delivery, assignments, blockers, and mentions.",
    member: "Your assignments, deadlines, project updates, and mentions.",
  }[roleMode];
  const category = (item) => {
    const type = String(item.related_type || item.type || "").toLowerCase();
    const text = `${item.title || ""} ${item.message || ""}`.toLowerCase();
    if (type.includes("mention") || text.includes("mentioned you")) return "mentions";
    if (type.includes("task") || text.includes("task")) return "tasks";
    if (type.includes("project") || text.includes("project")) return "projects";
    return "updates";
  };
  const filteredItems = useMemo(() => items.filter((item) => filter === "all" || (filter === "unread" ? !item.is_read : category(item) === filter)), [items, filter]);
  const openNotification = async (item) => {
    if (!item.is_read) {
      await markNotificationAsRead(item.id);
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_read: true } : entry));
    }
    const target = { tasks: "/tasks", projects: "/projects", mentions: "/chat" }[category(item)];
    if (target) navigate(target);
  };

  const markAll = async () => {
    await markAllNotificationsAsRead(user.id);
    setItems((current) => current.map((item) => ({ ...item, is_read: true })));
  };

  const remove = async (id) => {
    if (await deleteNotification(id)) setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearAll = async () => {
    if (items.length && window.confirm("Clear all notifications?")) {
      await clearNotifications(user.id);
      setItems([]);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="surface-panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Inbox</p>
          <h1 className="mt-1 text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">{unread ? `${unread} unread update${unread === 1 ? "" : "s"}` : "You're all caught up"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={markAll} disabled={!unread} className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900"><CheckCheck size={18} /> Mark all read</button>
          <button onClick={clearAll} disabled={!items.length} className="focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-500/10"><Trash2 size={18} /> Clear</button>
        </div>
      </header>

      <section className="surface-panel p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-bold">{roleMode === "admin" ? "Leadership alert queue" : roleMode === "manager" ? "Team action queue" : "My action queue"}</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} view</span></div><p className="mt-1 text-sm text-slate-500">{roleCopy}</p></div><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30"><strong className="block text-lg text-emerald-700 dark:text-emerald-400">{unread}</strong>Unread</div><div className="rounded-xl bg-blue-50 px-3 py-2 dark:bg-blue-950/30"><strong className="block text-lg text-blue-700 dark:text-blue-400">{items.filter((item) => category(item) === "tasks").length}</strong>Tasks</div><div className="rounded-xl bg-violet-50 px-3 py-2 dark:bg-violet-950/30"><strong className="block text-lg text-violet-700 dark:text-violet-400">{items.filter((item) => category(item) === "mentions").length}</strong>Mentions</div></div></div></section>

      <nav className="flex gap-2 overflow-x-auto pb-1">{[["all", Bell, "All"], ["unread", CheckCheck, "Unread"], ["tasks", ListTodo, "Tasks"], ["projects", FolderKanban, "Projects"], ["mentions", AtSign, "Mentions"]].map(([value, Icon, label]) => <button key={value} onClick={() => setFilter(value)} className={`focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${filter === value ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}`}><Icon size={15} />{label}</button>)}</nav>

      <section className="surface-panel overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-5 text-slate-500"><LoaderCircle className="animate-spin" /> Loading updates…</div>
        ) : !filteredItems.length ? (
          <div className="p-5 text-center"><Bell className="mx-auto text-slate-300" size={42} /><h2 className="mt-4 text-xl font-bold">No notifications</h2><p className="mt-2 text-slate-500">Task assignments, deadline reminders, and team updates will appear here.</p></div>
        ) : filteredItems.map((item) => (
          <article key={item.id} onClick={() => openNotification(item)} className={`flex cursor-pointer gap-4 border-b border-slate-100 p-5 last:border-0 dark:border-zinc-800 ${item.is_read ? "bg-transparent" : "bg-emerald-50/70 dark:bg-emerald-500/5"}`}>
            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.is_read ? "bg-slate-300 dark:bg-zinc-700" : "bg-emerald-500"}`} />
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{item.title}</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 dark:bg-zinc-800">{category(item)}</span></div><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-300">{item.message}</p><time className="mt-2 block text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</time></div>
            <button aria-label="Delete notification" onClick={(event) => { event.stopPropagation(); remove(item.id); }} className="focus-ring h-fit rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 size={17} /></button>
          </article>
        ))}
      </section>
    </div>
  );
}
