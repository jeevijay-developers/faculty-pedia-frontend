"use client";

import {
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";

const NavigationButtons = ({
  currentQuestionIndex,
  testData,
  currentAnswer,
  isSubmitting,
  handlePreviousQuestion,
  handleSubmitAnswer,
  handleSubmitTest,
  handleNextQuestion,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 lg:pt-8 border-t border-gray-200 gap-4 sm:gap-0">
      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
        className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
      >
        <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Previous
      </button>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <button
          onClick={handleSubmitAnswer}
          disabled={!currentAnswer.selectedOption || currentAnswer.submitted}
          className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base ${
            currentAnswer.submitted
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 cursor-not-allowed border border-green-200"
              : currentAnswer.selectedOption
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {currentAnswer.submitted ? (
            <>
              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Submitted</span>
              <span className="sm:hidden">✓</span>
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Submit Answer</span>
              <span className="sm:hidden">Submit</span>
            </>
          )}
        </button>

        <button
          onClick={handleSubmitTest}
          disabled={isSubmitting}
          className="flex items-center justify-center px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg lg:rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-1 sm:mr-2"></div>
              <span className="hidden sm:inline">Submitting...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Submit Test</span>
              <span className="sm:hidden">Finish</span>
            </>
          )}
        </button>
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={currentQuestionIndex === testData.questions.length - 1}
        className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
      >
        Next
        <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
      </button>
    </div>
  );
};

export default NavigationButtons;
