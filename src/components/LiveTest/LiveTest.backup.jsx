"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import {
  getLiveTestById,
  submitTestResult,
} from "@/components/server/test/test.routes";
import { getUserId } from "@/utils/userData";

// Import components
import TestHeader from "./TestHeader";
import QuestionDisplay from "./QuestionDisplay";
import AnswerOptions from "./AnswerOptions";
import NavigationButtons from "./NavigationButtons";
import QuestionSidebar from "./QuestionSidebar";
import ImageModal from "./ImageModal";
import { LoadingState, ErrorState } from "./TestStates";
import SubmitConfirmDialog from "./SubmitConfirmDialog";

const LiveTest = ({ testId }) => {
  // State management
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [testStarted, setTestStarted] = useState(false);

  // Load test data
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const data = await getLiveTestById(testId);
        setTestData(data);
        setTimeRemaining(data.duration * 60);
        setTestStarted(true);

        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach((_, index) => {
          initialAnswers[index] = {
            selectedOption: null,
            submitted: false,
          };
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError("Failed to load test data");
        toast.error("Failed to load test data. Please try again.", {
          duration: 4000,
          style: {
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        selectedOption: option,
      },
    }));
  };

  // Submit current answer
  const handleSubmitAnswer = () => {
    const currentAnswer = answers[currentQuestionIndex];
    if (!currentAnswer.selectedOption) {
      toast.error("Please select an option before submitting", {
        duration: 3000,
        style: {
          background: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        },
      });
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        submitted: true,
      },
    }));

    toast.success("Answer submitted successfully!", {
      duration: 2000,
      style: {
        background: '#F0FDF4',
        color: '#16A34A',
        border: '1px solid #BBF7D0',
      },
    });

    // Automatically move to next question after submitting
    if (currentQuestionIndex < testData.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    }
  };

  // Navigate questions
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Calculate test results
  const calculateResults = () => {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;
    let obtainedScore = 0;
    const attemptedQuestions = [];

    testData.questions.forEach((question, index) => {
      const answer = answers[index];

      if (!answer.selectedOption) {
        totalUnattempted++;
        attemptedQuestions.push({
          questionId: question._id,
          marks: 0,
          status: "UNATTEMPTED",
          selectedOption: null,
        });
      } else {
        const isCorrect = question.correctOptions.includes(
          answer.selectedOption
        );

        if (isCorrect) {
          totalCorrect++;
          obtainedScore += question.marks.positive;
          attemptedQuestions.push({
            questionId: question._id,
            marks: question.marks.positive,
            status: "CORRECT",
            selectedOption: answer.selectedOption,
          });
        } else {
          totalIncorrect++;
          obtainedScore += question.marks.negative;
          attemptedQuestions.push({
            questionId: question._id,
            marks: question.marks.negative,
            status: "INCORRECT",
            selectedOption: answer.selectedOption,
          });
        }
      }
    });

    const totalScore = testData.questions.reduce(
      (sum, q) => sum + q.marks.positive,
      0
    );

    return {
      totalCorrect,
      totalIncorrect,
      totalUnattempted,
      totalScore,
      obtainedScore,
      attemptedQuestions,
    };
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (isSubmitting) return;

    const unansweredCount = Object.values(answers).filter(
      answer => !answer.selectedOption
    ).length;

    confirmAlert({
      customUI: ({ onClose }) => (
        <SubmitConfirmDialog
          unansweredCount={unansweredCount}
          onClose={onClose}
          onSubmit={submitTest}
        />
      )
    });
  };

  const submitTest = async () => {
    try {
      setIsSubmitting(true);

      toast.loading("Submitting your test...", {
        id: "submit-test",
        style: {
          background: '#EBF8FF',
          color: '#1E40AF',
          border: '1px solid #BFDBFE',
        },
      });

      const userId = getUserId();

      if (!userId) {
        throw new Error("User not logged in");
      }

      const results = calculateResults();
      const submissionData = {
        studentId: userId,
        seriesId: testData.testSeriesId._id,
        testId: testData._id,
        ...results,
      };

      const response = await submitTestResult(submissionData);

      toast.success("Test submitted successfully! 🎉", {
        id: "submit-test",
        duration: 4000,
        style: {
          background: '#F0FDF4',
          color: '#16A34A',
          border: '1px solid #BBF7D0',
        },
      });

      setTimeout(() => {
        window.location.href = "/test-results";
      }, 2000);
    } catch (err) {
      console.error("Error submitting test:", err);
      const MESSAGE = err?.response?.data?.message || "Failed to submit test";
      toast.error(MESSAGE, {
        id: "submit-test",
        duration: 5000,
        style: {
          background: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading and error states
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TestHeader
        testData={testData}
        currentQuestionIndex={currentQuestionIndex}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 lg:p-8">
              <QuestionDisplay
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
              />

              <AnswerOptions
                currentQuestion={currentQuestion}
                currentAnswer={currentAnswer}
                handleAnswerSelect={handleAnswerSelect}
                setEnlargedImage={setEnlargedImage}
              />

              <NavigationButtons
                currentQuestionIndex={currentQuestionIndex}
                testData={testData}
                currentAnswer={currentAnswer}
                isSubmitting={isSubmitting}
                handlePreviousQuestion={handlePreviousQuestion}
                handleSubmitAnswer={handleSubmitAnswer}
                handleSubmitTest={handleSubmitTest}
                handleNextQuestion={handleNextQuestion}
              />
            </div>
          </div>

          <QuestionSidebar
            testData={testData}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            handleQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>

      <ImageModal
        enlargedImage={enlargedImage}
        setEnlargedImage={setEnlargedImage}
      />
    </div>
  );
};
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState({});
const [timeRemaining, setTimeRemaining] = useState(0);
const [isSubmitting, setIsSubmitting] = useState(false);
const [enlargedImage, setEnlargedImage] = useState(null);
const [testStarted, setTestStarted] = useState(false);

// Load test data
useEffect(() => {
  const fetchTestData = async () => {
    try {
      setLoading(true);
      const data = await getLiveTestById(testId);
      setTestData(data);
      setTimeRemaining(data.duration * 60); // Convert minutes to seconds
      setTestStarted(true);

      // Initialize answers object
      const initialAnswers = {};
      data.questions.forEach((_, index) => {
        initialAnswers[index] = {
          selectedOption: null,
          submitted: false,
        };
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError("Failed to load test data");
      toast.error("Failed to load test data. Please try again.", {
        duration: 4000,
        style: {
          background: "#FEF2F2",
          color: "#DC2626",
          border: "1px solid #FECACA",
        },
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (testId) {
    fetchTestData();
  }
}, [testId]);

// Timer countdown
useEffect(() => {
  if (!testStarted || timeRemaining <= 0) return;

  const timer = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        handleSubmitTest(); // Auto-submit when time runs out
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [testStarted, timeRemaining]);

// Format time display
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Handle answer selection
const handleAnswerSelect = (option) => {
  setAnswers((prev) => ({
    ...prev,
    [currentQuestionIndex]: {
      ...prev[currentQuestionIndex],
      selectedOption: option,
    },
  }));
};

// Submit current answer
const handleSubmitAnswer = () => {
  const currentAnswer = answers[currentQuestionIndex];
  if (!currentAnswer.selectedOption) {
    toast.error("Please select an option before submitting", {
      duration: 3000,
      style: {
        background: "#FEF2F2",
        color: "#DC2626",
        border: "1px solid #FECACA",
      },
    });
    return;
  }

  setAnswers((prev) => ({
    ...prev,
    [currentQuestionIndex]: {
      ...prev[currentQuestionIndex],
      submitted: true,
    },
  }));

  toast.success("Answer submitted successfully!", {
    duration: 2000,
    style: {
      background: "#F0FDF4",
      color: "#16A34A",
      border: "1px solid #BBF7D0",
    },
  });

  // Automatically move to next question after submitting
  if (currentQuestionIndex < testData.questions.length - 1) {
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 500); // Small delay for better UX
  }
};

// Navigate questions
const handlePreviousQuestion = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }
};

const handleNextQuestion = () => {
  if (currentQuestionIndex < testData.questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }
};

const handleQuestionSelect = (index) => {
  setCurrentQuestionIndex(index);
};

// Calculate test results
const calculateResults = () => {
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;
  let obtainedScore = 0;
  const attemptedQuestions = [];

  testData.questions.forEach((question, index) => {
    const answer = answers[index];

    if (!answer.selectedOption) {
      totalUnattempted++;
      attemptedQuestions.push({
        questionId: question._id,
        marks: 0,
        status: "UNATTEMPTED",
        selectedOption: null,
      });
    } else {
      const isCorrect = question.correctOptions.includes(
        answer.selectedOption
      );

      if (isCorrect) {
        totalCorrect++;
        obtainedScore += question.marks.positive;
        attemptedQuestions.push({
          questionId: question._id,
          marks: question.marks.positive,
          status: "CORRECT",
          selectedOption: answer.selectedOption,
        });
      } else {
        totalIncorrect++;
        obtainedScore += question.marks.negative;
        attemptedQuestions.push({
          questionId: question._id,
          marks: question.marks.negative,
          status: "INCORRECT",
          selectedOption: answer.selectedOption,
        });
      }
    }
  });

  const totalScore = testData.questions.reduce(
    (sum, q) => sum + q.marks.positive,
    0
  );

  return {
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalScore,
    obtainedScore,
    attemptedQuestions,
  };
};

// Submit test
const handleSubmitTest = async () => {
  if (isSubmitting) return;

  // Count unanswered questions
  const unansweredCount = Object.values(answers).filter(
    (answer) => !answer.selectedOption
  ).length;

  confirmAlert({
    customUI: ({ onClose }) => {
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
                submitTest();
              }}
              className="flex-1 px-4 py-2 lg:py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg lg:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
            >
              Submit Test
            </button>
          </div>
        </div>
      );
    },
  });
};

const submitTest = async () => {
  try {
    setIsSubmitting(true);

    toast.loading("Submitting your test...", {
      id: "submit-test",
      style: {
        background: "#EBF8FF",
        color: "#1E40AF",
        border: "1px solid #BFDBFE",
      },
    });

    const userId = getUserId();

    if (!userId) {
      throw new Error("User not logged in");
    }

    const results = calculateResults();
    const submissionData = {
      studentId: userId,
      seriesId: testData.testSeriesId._id,
      testId: testData._id,
      ...results,
    };

    const response = await submitTestResult(submissionData);

    toast.success("Test submitted successfully! 🎉", {
      id: "submit-test",
      duration: 4000,
      style: {
        background: "#F0FDF4",
        color: "#16A34A",
        border: "1px solid #BBF7D0",
      },
    });
    
    // Redirect to results page or dashboard
    setTimeout(() => {
      window.location.href = "/test-results";
    }, 2000);
  } catch (err) {
    console.error("Error submitting test:", err);
    const MESSAGE = err?.response?.data?.message || "Failed to submit test";
    toast.error(MESSAGE, {
      id: "submit-test",
      duration: 5000,
      style: {
        background: "#FEF2F2",
        color: "#DC2626",
        border: "1px solid #FECACA",
      },
    });
  } finally {
    setIsSubmitting(false);
  }
};

// Loading state
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-20 animate-pulse"></div>
        </div>
        <p className="text-gray-700 font-medium text-lg">
          Loading your test...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Please wait while we prepare everything
        </p>
      </div>
    </div>
  );
}

// Error state
if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <FiX className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Unable to Load Test
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

const currentQuestion = testData.questions[currentQuestionIndex];
const currentAnswer = answers[currentQuestionIndex];

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    {/* Modern Responsive Header */}
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
            <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2">{testData.description.short}</p>
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
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="flex items-center bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl px-6 py-3 shadow-lg">
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

    {/* Responsive Main Container */}
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8" >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-8">
        {/* Main Content - Mobile First */}
        <div className="xl:col-span-3 order-2 xl:order-1">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 lg:p-8">
            {/* Question Header - Mobile Optimized */}
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

              {/* Responsive Modern Options */}
              <div className="space-y-3 lg:space-y-4">
                {Object.entries(currentQuestion.options).map(
                  ([optionKey, option]) => (
                    <div
                      key={optionKey}
                      className={`group border-2 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${currentAnswer.selectedOption === optionKey
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg scale-[1.01] lg:scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      onClick={() => handleAnswerSelect(optionKey)}
                    >
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <div
                          className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${currentAnswer.selectedOption === optionKey
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
                            <span className="font-semibold text-gray-700">
                              {optionKey}.
                            </span>
                            <span className="text-gray-900">
                              {option.text}
                            </span>
                          </div>
                          {option.image && option.image.url && (
                            <div className="relative">
                              <Image
                                src={option.image.url}
                                alt={`Option ${optionKey}`}
                                width={200}
                                height={150}
                                className="rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEnlargedImage(option.image.url);
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEnlargedImage(option.image.url);
                                }}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded"
                              >
                                <FiZoomIn className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Responsive Navigation Buttons */}
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
                  disabled={
                    !currentAnswer.selectedOption || currentAnswer.submitted
                  }
                  className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base ${currentAnswer.submitted
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
                disabled={
                  currentQuestionIndex === testData.questions.length - 1
                }
                className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
              >
                Next
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Question Sidebar - Hidden on Mobile */}
        <div className="xl:col-span-1 order-1 xl:order-2">
          {/* Mobile Question Navigator */}
          <div className="xl:hidden bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Progress</h3>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {Object.values(answers).filter((a) => a.submitted).length}/{testData.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.values(answers).filter((a) => a.submitted).length / testData.questions.length) * 100}%`
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
                  {Object.values(answers).filter((a) => a.submitted).length}/{testData.questions.length}
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
                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${currentQuestionIndex === index
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

            {/* Modern Legend */}
            <div className="mt-8 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Legend
              </h4>
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
      </div>
    </div>

    {/* Image Enlargement Modal */}
    {
      enlargedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
            >
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
            <div className="p-6">
              <Image
                src={enlargedImage}
                alt="Enlarged question image"
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )
    }
  </div>
);

export default LiveTest;
