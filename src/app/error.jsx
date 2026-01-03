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
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      {/* Main Error Content */}
      <div className="flex flex-col items-center space-y-8 max-w-2xl text-center">
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center space-y-4">
          {/* Professional Logo */}
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

        {/* Error Icon and Message */}
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100">
              <FiAlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Don't worry, it's been
                logged and we'll fix it.
              </p>
            </div>
          </div>

          {/* Error Details Card */}
          {error?.message && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left max-w-md w-full">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Error Details:
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <code className="text-sm text-red-600 font-mono wrap-break-word">
                  {error.message}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Helpful Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <FiRefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Try Again</h3>
            <p className="text-sm text-gray-600">
              Sometimes a simple refresh can resolve the issue.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-green-100">
              <FiHome className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Go Home</h3>
            <p className="text-sm text-gray-600">
              Return to the homepage and start fresh.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-purple-100">
              <FiArrowLeft className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Go Back</h3>
            <p className="text-sm text-gray-600">
              Return to the previous page you were viewing.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <FiHome className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 w-full max-w-md">
          <h3 className="font-semibold text-blue-900 mb-2">Need More Help?</h3>
          <p className="text-sm text-blue-700 mb-4">
            If this problem continues, please contact our support team with
            details about what you were doing when this error occurred.
          </p>
          <Link
            href="/help"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Contact Support →
          </Link>
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
}
