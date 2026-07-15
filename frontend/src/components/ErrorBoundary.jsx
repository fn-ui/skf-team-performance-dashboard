import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Application error", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-zinc-950">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <AlertTriangle size={28} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">Your data is safe. Reload the workspace to continue.</p>
          <button onClick={() => window.location.reload()} className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
            <RefreshCw size={18} /> Reload workspace
          </button>
        </section>
      </main>
    );
  }
}
