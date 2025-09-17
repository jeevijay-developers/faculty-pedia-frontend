"use client";

import { FiClock } from "react-icons/fi";

const TestHeader = ({
  testData,
  currentQuestionIndex,
  timeRemaining,
  formatTime,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Test Info - Mobile Optimized */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                Live Test
              </span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 lg:mb-2 leading-tight">
              {testData.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2">
              {testData.description.short}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full font-medium">
                {testData.subject}
              </span>
              <span className="text-gray-500">
                Q {currentQuestionIndex + 1}/{testData.questions.length}
              </span>
            </div>
          </div>

          {/* Modern Responsive Timer */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="flex items-center bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-lg">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full mr-2 sm:mr-3">
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-500 font-medium uppercase tracking-wide hidden sm:block">
                    Time Left
                  </p>
                  <span className="text-red-600 font-mono text-lg sm:text-xl font-bold block leading-tight">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              {timeRemaining <= 300 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeader;
