import { BellRing, CheckCircle2, ShieldCheck, Users } from "lucide-react";

function RoleSettingsOverview({ roleMode }) {
  const content = {
    admin: {
      title: "Workspace governance",
      description: "Your settings view includes organization-level oversight and personal account controls.",
      items: ["Review security posture and access policies", "Keep organization notifications actionable", "Audit integrations and workspace defaults"],
      icon: ShieldCheck,
    },
    manager: {
      title: "Team workflow preferences",
      description: "Your settings are focused on team delivery signals and your personal account.",
      items: ["Prioritize assignment and deadline alerts", "Keep mentions enabled for fast decisions", "Use weekly summaries for coaching preparation"],
      icon: Users,
    },
    member: {
      title: "Personal productivity preferences",
      description: "These controls affect your account and notifications without changing workspace governance.",
      items: ["Enable task assignment notifications", "Keep mentions visible for collaboration", "Choose the reminders that support your focus"],
      icon: BellRing,
    },
  }[roleMode];
  const Icon = content.icon;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Icon size={20} /></span><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">{content.title}</h2><p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{content.description}</p></div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} view</span></div>
      <div className="mt-4 grid gap-2 md:grid-cols-3">{content.items.map((item) => <div key={item} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-zinc-950 dark:text-zinc-300"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /><span>{item}</span></div>)}</div>
    </section>
  );
}

export default RoleSettingsOverview;
