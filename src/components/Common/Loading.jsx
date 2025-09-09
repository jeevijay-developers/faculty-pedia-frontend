"use client";
import React from "react";
import PropTypes from "prop-types";

/*
  Reusable Loading Component
  ---------------------------------
  Props:
    variant: 'spinner' | 'card-grid' | 'text'
    count: number (for skeleton items)
    message: optional status message
    className: extra wrapper classes
    tight: boolean (reduced vertical padding)

  Accessibility:
    role="status" + aria-live for screen reader updates.
*/

const baseWrapper =
  "w-full flex flex-col items-center justify-center gap-6 text-slate-200";

const Spinner = ({ size = 56 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <div
      className="w-full h-full rounded-full border-4 border-indigo-500/30 border-t-indigo-400 animate-spin"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping"
      aria-hidden="true"
    />
  </div>
);

const CardSkeleton = () => (
  <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-4 gap-4 shadow-md">
    <div className="h-28 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-600/20" />
    <div className="h-4 w-3/4 rounded bg-slate-600/40" />
    <div className="h-3 w-1/2 rounded bg-slate-600/30" />
    <div className="mt-auto flex gap-3">
      <div className="h-8 flex-1 rounded-lg bg-slate-700/40" />
      <div className="h-8 w-14 rounded-lg bg-slate-700/30" />
    </div>
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  </div>
);

const Loading = ({
  variant = "spinner",
  count = 6,
  message = "Loading...",
  className = "",
  tight = false,
  spinnerSize = 64,
}) => {
  const wrapperPadding = tight ? "py-6" : "py-16";
  return (
    <div
      className={`${baseWrapper} ${wrapperPadding} px-6 bg-white ${className}`}
      role="status"
      aria-live="polite"
    >
      {variant === "spinner" && (
        <>
          <Spinner size={spinnerSize} />
          <p className="text-sm text-slate-400 tracking-wide">{message}</p>
        </>
      )}

      {variant === "text" && (
        <p className="text-sm text-slate-300 font-medium animate-pulse">
          {message}
        </p>
      )}

      {variant === "card-grid" && (
        <>
          <div className="flex flex-col items-center gap-4">
            <Spinner size={spinnerSize * 0.75} />
            <h2 className="text-lg font-semibold tracking-tight">{message}</h2>
            <p className="text-xs text-slate-400">
              Fetching data, almost there…
            </p>
          </div>
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </>
      )}

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

Loading.propTypes = {
  variant: PropTypes.oneOf(["spinner", "card-grid", "text"]),
  count: PropTypes.number,
  message: PropTypes.string,
  className: PropTypes.string,
  tight: PropTypes.bool,
  spinnerSize: PropTypes.number,
};

export default Loading;
export { Spinner, CardSkeleton };
