"use client";
import React from "react";

// Professional loading UI for Facultypedia educational platform
const Loading = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4"
      role="status"
      aria-live="polite"
    >
      {/* Main Loading Content */}
      <div className="flex flex-col items-center space-y-8 max-w-md text-center">
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center space-y-4">
          {/* Professional Logo Placeholder */}
          <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          {/* Brand Name */}
          <h1 className="text-2xl font-bold text-gray-900">Facultypedia</h1>
          <p className="text-sm text-gray-600 font-medium">
            Educational Excellence Platform
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="relative">
          {/* Main spinner */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>

          {/* Subtle pulse ring */}
          <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">Loading...</p>
          <p className="text-sm text-gray-600">
            Preparing your learning experience
          </p>
        </div>

        {/* Loading Progress Dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-gray-500">
          Empowering Education • Building Futures
        </p>
      </div>
    </div>
  );
};

export default Loading;
