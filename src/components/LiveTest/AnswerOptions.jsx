"use client";

import { FiCheck, FiZoomIn } from "react-icons/fi";
import Image from "next/image";

const AnswerOptions = ({
  currentQuestion,
  currentAnswer,
  handleAnswerSelect,
  setEnlargedImage,
}) => {
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
  return (
    <div className="space-y-3 lg:space-y-4">
      {Object.entries(currentQuestion.options).map(([optionKey, option]) => (
        <div
          key={optionKey}
          className={`group border-2 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            currentAnswer.selectedOption === optionKey
              ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg scale-[1.01] lg:scale-[1.02]"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => handleAnswerSelect(optionKey)}
        >
          <div className="flex items-start space-x-3 lg:space-x-4">
            <div
              className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                currentAnswer.selectedOption === optionKey
                  ? "border-blue-500 bg-blue-500 shadow-lg"
                  : "border-gray-300 group-hover:border-gray-400"
              }`}
            >
              {currentAnswer.selectedOption === optionKey && (
                <FiCheck className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm sm:text-base font-medium text-gray-900 uppercase">
                  {optionKey}
                </span>
                {getImageUrl(option.image) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedImage(getImageUrl(option.image));
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FiZoomIn className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                {option.text}
              </p>
              {getImageUrl(option.image) && (
                <div className="relative w-full max-w-xs">
                  <Image
                    src={getImageUrl(option.image)}
                    alt={`Option ${optionKey}`}
                    width={200}
                    height={150}
                    className="rounded-lg object-cover cursor-zoom-in"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedImage(getImageUrl(option.image));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnswerOptions;
