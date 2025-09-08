'use client';
import { useState } from 'react';
import { 
  FiAward, 
  FiTrendingUp, 
  FiClock, 
  FiTarget, 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiMinusCircle,
  FiBarChart2,
  FiCalendar,
  FiBookOpen,
  FiShare2,
  FiDownload
} from 'react-icons/fi';

const LiveTestResult = ({ resultData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!resultData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-500">No result data available</div>
        </div>
      </div>
    );
  }

  const {
    studentId,
    testId,
    seriesId,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalScore,
    obtainedScore,
    percentage,
    rank,
    totalStudents,
    createdAt
  } = resultData;

  // Calculate accuracy
  const totalAttempted = totalCorrect + totalIncorrect;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 60) return 'text-indigo-600 bg-indigo-50';
    if (percentage >= 40) return 'text-slate-600 bg-slate-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getPerformanceText = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 sm:px-8 py-8 sm:py-10 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Test Result</h1>
              <h2 className="text-lg sm:text-xl font-medium opacity-90 mb-1">
                {testId?.title || 'Test Title'}
              </h2>
              <div className="flex items-center gap-4 text-sm opacity-80">
                <div className="flex items-center gap-1">
                  <FiBookOpen className="w-4 h-4" />
                  <span>{testId?.subject || 'Subject'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>{formatDate(createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <FiShare2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getPerformanceColor(percentage)}`}>
              <FiAward className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {obtainedScore}
            </div>
            <div className="text-sm text-gray-600 mb-2">out of {totalScore}</div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(percentage)}`}>
              {percentage}% • {getPerformanceText(percentage)}
            </div>
          </div>
        </div>

        {/* Rank Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-3">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              #{rank}
            </div>
            <div className="text-sm text-gray-600 mb-2">Your Rank</div>
            <div className="text-xs text-gray-500">
              out of {totalStudents?.toLocaleString()} students
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
              <FiTarget className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {accuracy}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Accuracy</div>
            <div className="text-xs text-gray-500">
              {totalCorrect}/{totalAttempted} attempted
            </div>
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-600 mb-3">
              <FiClock className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {testId?.duration || 180}
            </div>
            <div className="text-sm text-gray-600 mb-2">minutes</div>
            <div className="text-xs text-gray-500">
              Total Duration
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question Analysis */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiBarChart2 className="w-5 h-5 text-blue-600" />
            Question Analysis
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Correct */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mx-auto mb-2">
                <FiCheckCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{totalCorrect}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            {/* Incorrect */}
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 rounded-full mx-auto mb-2">
                <FiXCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-600 mb-1">{totalIncorrect}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>

            {/* Unattempted */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full mx-auto mb-2">
                <FiMinusCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-600 mb-1">{totalUnattempted}</div>
              <div className="text-sm text-gray-600">Skipped</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress Breakdown</span>
              <span>{testId?.totalQuestions || 50} Questions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${(totalCorrect / (testId?.totalQuestions || 50)) * 100}%` }}
                ></div>
                <div 
                  className="bg-slate-400 transition-all duration-500"
                  style={{ width: `${(totalIncorrect / (testId?.totalQuestions || 50)) * 100}%` }}
                ></div>
                <div 
                  className="bg-gray-300 transition-all duration-500"
                  style={{ width: `${(totalUnattempted / (testId?.totalQuestions || 50)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Correct ({Math.round((totalCorrect / (testId?.totalQuestions || 50)) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded"></div>
                <span>Incorrect ({Math.round((totalIncorrect / (testId?.totalQuestions || 50)) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Skipped ({Math.round((totalUnattempted / (testId?.totalQuestions || 50)) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-indigo-600" />
            Performance Insights
          </h3>
          
          <div className="space-y-4">
            {/* Percentile */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Percentile</div>
              <div className="text-xl font-bold text-blue-600">
                {Math.round(((totalStudents - rank) / totalStudents) * 100)}th
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Better than {Math.round(((totalStudents - rank) / totalStudents) * 100)}% students
              </div>
            </div>

            {/* Subject Performance */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-3">Subject: {testId?.subject}</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Score</span>
                  <span className="font-medium">{obtainedScore}/{totalScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Percentage</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grade</span>
                  <span className={`font-medium ${getPerformanceColor(percentage).split(' ')[0]}`}>
                    {getPerformanceText(percentage)}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Next Steps</div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Review incorrect answers</li>
                <li>• Practice weak topics</li>
                <li>• Take next test in series</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Test Series Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiBookOpen className="w-5 h-5 text-blue-600" />
          Test Series Progress
        </h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">{seriesId?.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              Subject: {seriesId?.subject} • Total Tests: {seriesId?.totalTests}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Current Test</div>
            <div className="font-semibold text-blue-600">Test 3 of {seriesId?.totalTests}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTestResult;
