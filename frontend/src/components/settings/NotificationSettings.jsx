import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock3, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getNotificationPreferences, saveNotificationPreferences } from "../../services/workManagementService";

const defaults = {
  admin: { email_enabled: true, push_enabled: true, task_updates: true, project_updates: true, mentions: true, weekly_digest: true, quiet_hours: null },
  manager: { email_enabled: true, push_enabled: true, task_updates: true, project_updates: true, mentions: true, weekly_digest: true, quiet_hours: null },
  member: { email_enabled: true, push_enabled: true, task_updates: true, project_updates: true, mentions: true, weekly_digest: false, quiet_hours: null },
};

function NotificationSettings({ roleMode = "member" }) {
  const { profile } = useAuth();
  const [preferences, setPreferences] = useState(defaults[roleMode]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [quietEnabled, setQuietEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await getNotificationPreferences(profile.id);
        if (saved) {
          setPreferences(saved);
          if (saved.quiet_hours) {
            setQuietEnabled(true);
            setQuietStart(saved.quiet_hours.start || "22:00");
            setQuietEnd(saved.quiet_hours.end || "07:00");
          }
        }
      } catch (error) {
        setStatus(error.message || "Preferences could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    if (profile?.id) load();
  }, [profile?.id]);

  const settings = [
    ["email_enabled", "Email notifications", "Receive important updates by email.", Mail],
    ["push_enabled", "Push notifications", "Receive urgent alerts on supported devices.", Smartphone],
    ["task_updates", "Task updates", roleMode === "member" ? "Assignments, status changes, and due dates for your tasks." : "Assignments, status changes, and delivery exceptions.", Bell],
    ["project_updates", "Project updates", roleMode === "admin" ? "Portfolio health and organization project changes." : roleMode === "manager" ? "Health, milestones, and changes for managed projects." : "Updates from projects where you participate.", Bell],
    ["mentions", "Messages and mentions", "Notify you when teammates mention you in chat.", MessageSquare],
    ["weekly_digest", "Weekly digest", roleMode === "member" ? "A personal summary of completed and upcoming work." : "A weekly performance and delivery summary.", Mail],
  ];

  const save = async () => {
    try {
      setSaving(true);
      setStatus("");
      const payload = { ...preferences, quiet_hours: quietEnabled ? { start: quietStart, end: quietEnd } : null };
      delete payload.user_id;
      delete payload.updated_at;
      const saved = await saveNotificationPreferences(profile.id, payload);
      setPreferences(saved);
      setStatus("Notification preferences saved.");
    } catch (error) {
      setStatus(error.message || "Preferences could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-500 dark:border-zinc-800 dark:bg-zinc-900">Loading notification preferences…</div>;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl font-bold dark:text-white">Notification Settings</h2><p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Choose how and when work updates reach you.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} defaults</span></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {settings.map(([key, title, description, Icon]) => <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"><div className="flex min-w-0 items-start gap-3"><span className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Icon size={17} /></span><div><h3 className="text-sm font-bold dark:text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">{description}</p></div></div><label className="relative inline-flex shrink-0 cursor-pointer items-center"><input type="checkbox" checked={Boolean(preferences[key])} onChange={() => setPreferences((current) => ({ ...current, [key]: !current[key] }))} className="peer sr-only" /><span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 dark:bg-zinc-700" /><span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" /></label></div>)}
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 p-4 dark:border-zinc-800"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><Clock3 size={18} className="text-emerald-600" /><div><h3 className="text-sm font-bold dark:text-white">Quiet hours</h3><p className="text-xs text-slate-500">Pause non-critical notifications during your focus or rest period.</p></div></div><label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" checked={quietEnabled} onChange={() => setQuietEnabled((value) => !value)} className="peer sr-only" /><span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 dark:bg-zinc-700" /><span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" /></label></div>{quietEnabled && <div className="mt-3 flex flex-wrap gap-3"><label className="text-xs font-semibold text-slate-500">From<input type="time" value={quietStart} onChange={(event) => setQuietStart(event.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 dark:border-zinc-700" /></label><label className="text-xs font-semibold text-slate-500">Until<input type="time" value={quietEnd} onChange={(event) => setQuietEnd(event.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 dark:border-zinc-700" /></label></div>}</div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{status ? <p className={`flex items-center gap-2 text-sm ${status.includes("saved") ? "text-emerald-600" : "text-red-600"}`}>{status.includes("saved") && <CheckCircle2 size={16} />}{status}</p> : <span />}<button onClick={save} disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save preferences"}</button></div>
    </div>
  );
}

export default NotificationSettings;
