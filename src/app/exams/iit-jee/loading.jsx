"use client";
import React from "react";

// Loading UI for IIT-JEE exams route
// Accessible, skeleton-based, no hydration pitfalls (pure CSS / static)
const Loading = () => {
  const skeletonItems = Array.from({ length: 6 });
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start gap-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-5 py-16 text-slate-100"
      role="status"
      aria-live="polite"
    >
      {/* Spinner + Heading */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-400 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full animate-ping bg-indigo-500/10" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Preparing IIT-JEE Resources
        </h1>
        <p className="text-sm text-slate-400">Loading content… Please wait.</p>
      </div>

      {/* Skeleton Grid */}
      <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-4 gap-4 shadow-md"
          >
            <div className="h-32 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-600/20" />
            <div className="h-4 w-3/4 rounded bg-slate-600/40" />
            <div className="h-3 w-1/2 rounded bg-slate-600/30" />
            <div className="mt-auto flex gap-3">
              <div className="h-9 flex-1 rounded-lg bg-slate-700/40" />
              <div className="h-9 w-12 rounded-lg bg-slate-700/30" />
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 tracking-wide">
        Fast optimized loading • IIT-JEE Module
      </p>

      {/* Local keyframes for shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
