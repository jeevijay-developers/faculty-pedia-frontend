"use client";
import { useState } from "react";
import { FiFlag, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MainQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onOptionSelect,
  onNext,
  onPrevious,
  onSubmitAnswer,
  isFirstQuestion = false,
  isLastQuestion = false,
}) => {
  const [tempSelected, setTempSelected] = useState(selectedOption || "");

  // Helper function to get image URL and validate it
  const getImageUrl = (image) => {
    if (!image) return null;

    // If image is a string
    if (typeof image === "string") {
      return image.trim() !== "" ? image : null;
    }

    // If image is an object with url property
    if (typeof image === "object" && image.url) {
      return image.url.trim() !== "" ? image.url : null;
    }

    return null;
  };

  const handleOptionClick = (option) => {
    setTempSelected(option);
    onOptionSelect(option);
  };

  const handleSubmitAnswer = () => {
    if (tempSelected) {
      onSubmitAnswer(tempSelected);
    }
  };

  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          No question data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Question {questionNumber} of {totalQuestions}
          </h2>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-6">
        {/* Question Text */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed">
            {question.text ||
              question.question ||
              "Sample question text goes here"}
          </h3>
          {getImageUrl(question.image) && (
            <div className="mt-4">
              <img
                src={getImageUrl(question.image)}
                alt="Question illustration"
                className="max-w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {["A", "B", "C", "D"].map((option) => {
            const optionText =
              question.options?.[option] ||
              (option === "A"
                ? "Euismod Tempor Incididunt Ut"
                : option === "B"
                ? "Fugiat Nulla Pariatur"
                : option === "C"
                ? "Voluptatem Accusantium Doloremque"
                : "Totam Rem Aperiam");

            const isSelected = tempSelected === option;

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`
                  w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-200
                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    isSelected
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 bg-white text-gray-700"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center
                    font-semibold text-xs sm:text-sm flex-shrink-0
                    ${
                      isSelected
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 text-gray-600"
                    }
                  `}
                  >
                    {isSelected ? "✓" : option}
                  </div>
                  <span className="text-sm sm:text-base leading-relaxed">
                    {optionText}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center pt-4 border-t border-gray-200 gap-3 sm:gap-0">
          {/* Mobile: Stack buttons vertically, Desktop: Horizontal layout */}
          <div className="flex flex-col justify-center sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Previous Button */}
              <button
                onClick={onPrevious}
                disabled={isFirstQuestion}
                className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200 w-full sm:w-auto min-w-[100px]
                ${
                  isFirstQuestion
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="sm:inline">Previous</span>
              </button>

              {/* Next Button */}
              <button
                onClick={onNext}
                disabled={isLastQuestion}
                className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200 w-full sm:w-auto min-w-[100px]
                ${
                  isLastQuestion
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
              >
                <span className="sm:inline">Next</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            {/* Submit Answer Button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={!tempSelected}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                w-full sm:w-auto min-w-[120px]
                ${
                  tempSelected
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainQuestion;
