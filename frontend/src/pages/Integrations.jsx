import { useEffect, useState } from "react";
import { Check, Code2, ExternalLink, GitBranch, LoaderCircle, Plug, RefreshCw, Search, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { connectGitHub, disconnectRepository, fetchGitHubRepositories, getGitHubToken, getRepositoryIntegrations, saveRepositoryIntegration } from "../services/integrationsService";
import { getProjects } from "../services/projectsService";

export default function Integrations() {
  const { profile } = useAuth();
  const [connected, setConnected] = useState([]);
  const [available, setAvailable] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const role = String(profile?.role || "").trim().toLowerCase();
  const roleMode = role === "admin" || role === "administrator" ? "admin" : role === "manager" || role === "team manager" ? "manager" : "member";
  const roleCopy = {
    admin: ["Repository governance", "Connect repositories to organization projects while keeping ownership traceable."],
    manager: ["Team repository delivery", "Link your repositories to the projects you manage and coordinate delivery."],
    member: ["My development workspace", "Connect repositories you work with and link them to accessible projects."],
  }[roleMode];

  const scopeProjects = (projectList) => {
    if (roleMode === "admin") return projectList;
    return projectList.filter((project) => {
      const isManager = project.manager_id === profile?.id;
      const isProjectMember = project.project_members?.some((member) => member.user_id === profile?.id);
      const isTaskAssignee = project.tasks?.some((task) => task.assignee_id === profile?.id || task.task_assignees?.some((assignment) => assignment.user_id === profile?.id));
      return roleMode === "manager" ? isManager || isProjectMember || isTaskAssignee : isProjectMember || isTaskAssignee;
    });
  };

  const load = async () => {
    try {
      setLoading(true);
      const [repositories, projectList] = await Promise.all([getRepositoryIntegrations(profile.id), getProjects()]);
      const allowedProjects = scopeProjects(projectList || []);
      setConnected(repositories);
      setProjects(allowedProjects);
      setSelectedProject((current) => allowedProjects.some((project) => project.id === current) ? current : "");
    }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    if (!profile?.id) return undefined;
    const initialLoad = window.setTimeout(load, 0);
    return () => window.clearTimeout(initialLoad);
  }, [profile?.id]);

  const browse = async () => {
    try {
      setSyncing(true); setError("");
      const token = await getGitHubToken();
      if (!token) { await connectGitHub(); return; }
      setAvailable(await fetchGitHubRepositories(token));
    } catch (err) { setError(err.message || "GitHub could not be connected."); }
    finally { setSyncing(false); }
  };

  const importRepo = async (repo) => {
    try { const saved = await saveRepositoryIntegration(repo, profile.id, selectedProject || null); const project = projects.find((item) => item.id === selectedProject); setConnected((items) => [{ ...saved, projects: project || null }, ...items.filter((item) => item.id !== saved.id)]); }
    catch (err) { setError(err.message); }
  };

  const remove = async (id) => { await disconnectRepository(id, profile.id); setConnected((items) => items.filter((item) => item.id !== id)); };
  const connectedIds = new Set(connected.map((item) => item.external_id));
  const filtered = available.filter((repo) => repo.full_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 pb-8">
      <header className="surface-panel overflow-hidden"><div className="relative bg-[linear-gradient(135deg,#064e3b,#0e7490,#92400e)] p-5 text-white"><div className="fine-noise absolute inset-0 opacity-20" /><div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"><Plug size={14} /> Developer tools</span><h1 className="mt-4 text-3xl font-bold">Repository integrations</h1><p className="mt-2 max-w-2xl text-emerald-50/80">Connect source code to project work so your team can coordinate delivery from one workspace.</p></div><button onClick={browse} disabled={syncing} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-emerald-950 hover:bg-emerald-50">{syncing ? <LoaderCircle className="animate-spin" size={19} /> : <Code2 size={20} />} Connect GitHub</button></div></div></header>
      <section className="surface-panel p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-bold">{roleCopy[0]}</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{roleMode} view</span></div><p className="mt-1 text-sm text-slate-500">{roleCopy[1]}</p></div><label className="min-w-[240px] text-xs font-semibold text-slate-500">Link new imports to<select value={selectedProject} onChange={(event) => setSelectedProject(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label></div></section>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div>}
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="surface-panel p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold">Available repositories</h2><p className="mt-1 text-sm text-slate-500">Import metadata from repositories you can access.</p></div>{available.length > 0 && <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find repository" className="input-field py-2.5 pl-10" /></label>}</div>
          <div className="mt-6 space-y-3">{available.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-zinc-700"><Code2 className="mx-auto text-slate-300" size={42} /><h3 className="mt-4 font-bold">Connect your GitHub account</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Authorize access, then choose which repositories should appear in WorkPulse. Your GitHub password is never stored.</p><button onClick={browse} className="mt-5 font-bold text-emerald-600 hover:text-emerald-700">Browse repositories →</button></div> : filtered.map((repo) => <article key={repo.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800"><Code2 size={21} /></span><div className="min-w-0 flex-1"><h3 className="truncate font-bold">{repo.full_name}</h3><p className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500"><span>{repo.private ? "Private" : "Public"}</span><span>{repo.language || "No language"}</span><span className="inline-flex items-center gap-1"><GitBranch size={12} />{repo.default_branch}</span></p></div><button onClick={() => importRepo(repo)} disabled={connectedIds.has(String(repo.id))} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:bg-slate-300 dark:disabled:bg-zinc-700">{connectedIds.has(String(repo.id)) ? <><Check size={17} /> Imported</> : "Import"}</button></article>)}</div>
        </div>
        <aside className="surface-panel h-fit p-5"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Connected</h2><p className="mt-1 text-sm text-slate-500">{connected.length} repositories</p></div><RefreshCw size={20} className="text-emerald-600" /></div><div className="mt-5 space-y-3">{loading ? <LoaderCircle className="mx-auto animate-spin text-emerald-600" /> : connected.length === 0 ? <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-zinc-900">No repositories imported yet.</p> : connected.map((repo) => <article key={repo.id} className="rounded-2xl border border-slate-200 p-4 dark:border-zinc-800"><div className="flex items-start gap-3"><Code2 size={19} className="mt-0.5 shrink-0" /><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{repo.full_name}</h3><p className="mt-1 text-xs text-slate-500">{repo.language || "Repository"} · {repo.default_branch}</p>{repo.projects?.name && <p className="mt-1 truncate text-xs font-semibold text-emerald-600">Project: {repo.projects.name}</p>}</div><button onClick={() => remove(repo.id)} aria-label="Disconnect repository" className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button></div><a href={repo.html_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">Open on GitHub <ExternalLink size={12} /></a></article>)}</div></aside>
      </section>
    </div>
  );
}
