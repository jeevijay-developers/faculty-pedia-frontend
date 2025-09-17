"use client";

import { FiX } from "react-icons/fi";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-20 animate-pulse"></div>
        </div>
        <p className="text-gray-700 font-medium text-lg">
          Loading your test...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Please wait while we prepare everything
        </p>
      </div>
    </div>
  );
};

const ErrorState = ({ error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <FiX className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Unable to Load Test
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export { LoadingState, ErrorState };
