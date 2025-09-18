"use client";

import { useState } from "react";
import { getDebugInfo } from "@/utils/environment";

const DebugInfo = () => {
  const [showDebug, setShowDebug] = useState(false);
  const debugInfo = getDebugInfo();

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded text-xs hover:bg-gray-700"
        style={{ zIndex: 9999 }}
      >
        Debug Info
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg max-w-md"
      style={{ zIndex: 9999 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Debug Information</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ×
        </button>
      </div>

      <div className="text-xs space-y-1">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium text-gray-600">{key}:</span>
            <span className="text-gray-800 ml-2 break-all">
              {typeof value === "boolean"
                ? value
                  ? "true"
                  : "false"
                : value || "undefined"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Current URL:{" "}
          {typeof window !== "undefined" ? window.location.href : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;
