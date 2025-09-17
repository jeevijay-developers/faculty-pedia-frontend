"use client";

import { FiAlertTriangle } from "react-icons/fi";

const SubmitConfirmDialog = ({ unansweredCount, onClose, onSubmit }) => {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl p-6 lg:p-8 max-w-sm lg:max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-4 lg:mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 lg:h-16 lg:w-16 rounded-full bg-yellow-100 mb-3 lg:mb-4">
          <FiAlertTriangle className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
          Submit Test?
        </h3>
        <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">
          Are you sure you want to submit your test? This action cannot be
          undone.
        </p>
        {unansweredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 lg:mb-4">
            <p className="text-xs lg:text-sm text-yellow-800">
              <strong>{unansweredCount}</strong> question
              {unansweredCount > 1 ? "s" : ""} unanswered
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 lg:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg lg:rounded-xl font-medium transition-colors duration-200 text-sm lg:text-base"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onClose();
            onSubmit();
          }}
          className="flex-1 px-4 py-2 lg:py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg lg:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default SubmitConfirmDialog;
