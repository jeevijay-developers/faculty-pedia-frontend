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
      (answer) => !answer.selectedOption
    ).length;

    confirmAlert({
      customUI: ({ onClose }) => (
        <SubmitConfirmDialog
          unansweredCount={unansweredCount}
          onClose={onClose}
          onSubmit={submitTest}
        />
      ),
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

      console.log("Submitting test results:", submissionData);

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

      console.log("Test submission response:", response);

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
                setEnlargedImage={setEnlargedImage}
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

export default LiveTest;
