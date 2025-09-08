'use client';
import { useState } from 'react';
import { FiCheck, FiMinus, FiClock } from 'react-icons/fi';

const QuestionListing = ({ 
  questions = [], 
  currentQuestion = 0, 
  onQuestionSelect,
  attemptedQuestions = {},
  markedForReview = {},
  isMobile = false
}) => {
  const getQuestionStatus = (index) => {
    if (attemptedQuestions[index]) {
      return markedForReview[index] ? 'answered-marked' : 'answered';
    } else if (markedForReview[index]) {
      return 'marked';
    } else if (index === currentQuestion) {
      return 'current';
    } else {
      return 'not-attempted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
      case 'answered-marked':
        return <FiCheck className="w-3 h-3" />;
      case 'marked':
        return <FiMinus className="w-3 h-3" />;
      case 'current':
        return <FiClock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white border-green-500';
      case 'answered-marked':
        return 'bg-purple-500 text-white border-purple-500';
      case 'marked':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'current':
        return 'bg-blue-500 text-white border-blue-500';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:border-gray-400';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 ${isMobile ? 'mb-4' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
          {isMobile ? 'Questions' : 'Questions List'}
        </h3>
        <div className="text-sm text-gray-600">
          {Object.keys(attemptedQuestions).length}/{questions.length}
        </div>
      </div>

      {/* Legend - Collapsible on mobile */}
      <div className={`grid grid-cols-2 ${isMobile ? 'sm:grid-cols-4' : 'lg:grid-cols-2'} gap-2 mb-3 sm:mb-4 text-xs`}>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
            <FiCheck className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
          </div>
          <span className="text-gray-600 text-xs">Answered</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <FiMinus className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
          </div>
          <span className="text-gray-600 text-xs">Marked</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <FiClock className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
          </div>
          <span className="text-gray-600 text-xs">Current</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded-full"></div>
          <span className="text-gray-600 text-xs">Not Attempted</span>
        </div>
      </div>

      {/* Questions Grid - Responsive layout */}
      <div className={`grid gap-2 ${
        isMobile 
          ? 'grid-cols-8 xs:grid-cols-10 sm:grid-cols-12' 
          : 'grid-cols-5'
      }`}>
        {questions.map((_, index) => {
          const status = getQuestionStatus(index);
          return (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={`
                ${isMobile ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10'} 
                rounded-lg border-2 transition-all duration-200 
                flex items-center justify-center text-xs sm:text-sm font-medium
                hover:scale-105 active:scale-95
                ${getStatusColor(status)}
              `}
            >
              <div className="flex items-center justify-center">
                {getStatusIcon(status) || (index + 1)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
        <div className={`grid grid-cols-2 gap-4 text-sm ${isMobile ? 'text-center' : ''}`}>
          <div>
            <div className="text-gray-600 text-xs sm:text-sm">Attempted</div>
            <div className="font-semibold text-green-600 text-sm sm:text-base">
              {Object.keys(attemptedQuestions).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600 text-xs sm:text-sm">Remaining</div>
            <div className="font-semibold text-red-600 text-sm sm:text-base">
              {questions.length - Object.keys(attemptedQuestions).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionListing;