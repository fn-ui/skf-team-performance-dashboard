import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, Target } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  createGoalKeyResult,
  getGoalKeyResults,
  updateGoalKeyResult,
} from "../../services/workManagementService";

function GoalKeyResultsPanel({ goal, roleMode = "member" }) {
  const { profile } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ title: "", target_value: 100, unit: "%" });
  const canCreate = roleMode === "admin" || roleMode === "manager";

  const loadResults = async () => {
    if (!goal?.id) return;
    try {
      setLoading(true);
      setResults(await getGoalKeyResults(goal.id));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Key results could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [goal?.id]);

  const average = useMemo(() => {
    if (!results.length) return 0;
    const total = results.reduce((sum, item) => {
      const target = Number(item.target_value) || 1;
      return sum + Math.min(100, Math.round((Number(item.current_value || 0) / target) * 100));
    }, 0);
    return Math.round(total / results.length);
  }, [results]);

  const addResult = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    try {
      setSaving(true);
      await createGoalKeyResult(goal.id, {
        title: draft.title.trim(),
        current_value: 0,
        target_value: Number(draft.target_value) || 100,
        unit: draft.unit.trim() || "%",
        owner_id: goal.owner_id || null,
      });
      setDraft({ title: "", target_value: 100, unit: "%" });
      await loadResults();
    } catch (requestError) {
      setError(requestError.message || "Key result could not be created.");
    } finally {
      setSaving(false);
    }
  };

  const saveProgress = async (item, value) => {
    try {
      await updateGoalKeyResult(item.id, { current_value: Number(value) || 0 });
      setResults((current) => current.map((result) => result.id === item.id ? { ...result, current_value: Number(value) || 0 } : result));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Progress could not be updated.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Target size={18} className="text-emerald-600" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Measurable outcomes</h3>
            <p className="text-xs text-slate-500">{results.length} key results · {average}% achieved</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">{roleMode} view</span>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <p className="text-sm text-slate-500">Loading outcomes…</p>}
        {!loading && !results.length && <p className="rounded-xl bg-white p-3 text-sm text-slate-500 dark:bg-zinc-900">No measurable outcomes have been added yet.</p>}
        {results.map((item) => {
          const target = Number(item.target_value) || 1;
          const progress = Math.min(100, Math.round((Number(item.current_value || 0) / target) * 100));
          const canUpdate = canCreate || !item.owner_id || item.owner_id === profile?.id;
          return (
            <div key={item.id} className="rounded-xl bg-white p-3 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.current_value || 0} / {item.target_value} {item.unit}</p>
                </div>
                {canUpdate ? (
                  <input aria-label={`Progress for ${item.title}`} type="number" min="0" max={target} defaultValue={item.current_value || 0} onBlur={(event) => saveProgress(item, event.target.value)} className="w-20 rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-zinc-700 dark:text-white" />
                ) : <CheckCircle2 size={18} className="text-slate-400" />}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
            </div>
          );
        })}
      </div>

      {canCreate && (
        <form onSubmit={addResult} className="mt-3 grid gap-2 sm:grid-cols-[1fr_90px_70px_auto]">
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Add a measurable result" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          <input type="number" min="1" value={draft.target_value} onChange={(event) => setDraft({ ...draft, target_value: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          <input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value })} aria-label="Unit" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
          <button disabled={saving} className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Plus size={16} /> Add</button>
        </form>
      )}
      {roleMode === "member" && <p className="mt-3 text-xs text-slate-500">Update outcomes assigned to you. Goal structure stays controlled by your manager.</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}

export default GoalKeyResultsPanel;
