//// filepath: d:\Faculty pedia\frontend\faculty-pedia-frontend\src\app\error.jsx
"use client";
import { useEffect } from "react";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiRefreshCw,
  FiHome,
  FiArrowLeft,
} from "react-icons/fi";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    // <html>
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center px-4 py-12 text-slate-100">
      <div
        data-aos="fade-up"
        className="w-full max-w-2xl relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 ring-1 ring-white/10 shadow-2xl"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-500/20 blur-3xl rounded-full" />

        {/* Header */}
        <div className="p-8 pb-4 flex items-center space-x-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-800/30">
            <FiAlertTriangle size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Oops, something broke
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              An unexpected error occurred. It has been logged.
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="px-8 pt-2">
          <div className="rounded-xl bg-slate-800/60 ring-1 ring-white/10 p-5 text-sm font-mono text-slate-300 max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-slate-600/50">
            {error?.message || "Unknown error"}
          </div>
        </div>

        {/* Suggestions */}
        <div className="px-8 mt-6 grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-xl bg-indigo-600/10 ring-1 ring-indigo-500/30">
            <p className="text-xs uppercase tracking-wide text-indigo-300 mb-1">
              Tip
            </p>
            <p className="text-sm text-slate-200">Try refreshing the page.</p>
          </div>
          <div className="p-4 rounded-xl bg-fuchsia-600/10 ring-1 ring-fuchsia-500/30">
            <p className="text-xs uppercase tracking-wide text-fuchsia-300 mb-1">
              Context
            </p>
            <p className="text-sm text-slate-200">
              This might be a temporary issue.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-600/10 ring-1 ring-emerald-500/30">
            <p className="text-xs uppercase tracking-wide text-emerald-300 mb-1">
              Support
            </p>
            <p className="text-sm text-slate-200">
              Contact admin if it persists.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={() => reset()}
            className="group flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-900/40 hover:from-indigo-400 hover:to-violet-500 transition"
          >
            <FiRefreshCw className="group-active:rotate-180 transition-transform duration-300" />
            Retry
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-700/70 transition font-medium"
          >
            <FiHome />
            Home
          </Link>
          <button
            onClick={() => history.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-700/70 transition font-medium"
          >
            <FiArrowLeft />
            Back
          </button>
        </div>

        <div className="px-8 pb-6 pt-2 text-center">
          <p className="text-xs text-slate-400">
            If the issue continues, please report it with steps to reproduce.
          </p>
        </div>
      </div>
    </section>
  );
}
