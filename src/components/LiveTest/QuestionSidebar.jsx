"use client";

const QuestionSidebar = ({
  testData,
  answers,
  currentQuestionIndex,
  handleQuestionSelect,
}) => {
  return (
    <div className="xl:col-span-1 order-1 xl:order-2">
      {/* Mobile Question Navigator */}
      <div className="xl:hidden bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">Progress</h3>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {Object.values(answers).filter((a) => a.submitted).length}/
            {testData.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.values(answers).filter((a) => a.submitted).length /
                  testData.questions.length) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Desktop Question Grid */}
      <div className="hidden xl:block bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 sticky top-32">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Questions</h3>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">
              {Object.values(answers).filter((a) => a.submitted).length}/
              {testData.questions.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {testData.questions.map((_, index) => {
            const answer = answers[index];
            return (
              <button
                key={index}
                onClick={() => handleQuestionSelect(index)}
                className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  currentQuestionIndex === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-200"
                    : answer.submitted
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : answer.selectedOption
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"></div>
              <span className="text-sm text-gray-600">Submitted</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg"></div>
              <span className="text-sm text-gray-600">Answered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-sm text-gray-600">Current</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-100 rounded-lg border"></div>
              <span className="text-sm text-gray-600">Not Visited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSidebar;
