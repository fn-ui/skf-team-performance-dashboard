import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center p-6">
      <div className="surface-panel max-w-xl p-10 text-center">
        <SearchX className="mx-auto text-emerald-600" size={48} />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">404 error</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-slate-500 dark:text-zinc-400">The page may have moved or you may not have access to it.</p>
        <Link to="/" className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
          <ArrowLeft size={18} /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
