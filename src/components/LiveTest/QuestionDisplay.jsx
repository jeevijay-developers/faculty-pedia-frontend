"use client";

import { FiCheck, FiX, FiZoomIn } from "react-icons/fi";
import Image from "next/image";

const QuestionDisplay = ({
  currentQuestion,
  currentQuestionIndex,
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
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 lg:mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Q{currentQuestionIndex + 1}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheck className="w-3 h-3 mr-1" />+
                {currentQuestion.marks.positive}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <FiX className="w-3 h-3 mr-1" />
                {currentQuestion.marks.negative}
              </span>
            </div>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-relaxed">
            {currentQuestion.title}
          </h2>

          {/* Question Image */}
          {getImageUrl(currentQuestion.image) && (
            <div className="mb-4 lg:mb-6 relative">
              <div className="relative max-w-lg">
                <Image
                  src={getImageUrl(currentQuestion.image)}
                  alt="Question illustration"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover cursor-zoom-in border border-gray-200"
                  onClick={() =>
                    setEnlargedImage &&
                    setEnlargedImage(getImageUrl(currentQuestion.image))
                  }
                />
                {setEnlargedImage && (
                  <button
                    onClick={() =>
                      setEnlargedImage(getImageUrl(currentQuestion.image))
                    }
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
                  >
                    <FiZoomIn className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4 lg:mb-6">
            <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              {currentQuestion.subject}
            </span>
            <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              {currentQuestion.topic}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
