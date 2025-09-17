'use client';
import { useState, useEffect } from 'react';
import { FiClock, FiUser, FiBookOpen, FiLogOut } from 'react-icons/fi';
import MainQuestion from './MainQuestion';
import QuestionListing from './QuestionListing';

const LiveTestPage = ({ testData }) => {
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentSelection, setCurrentSelection] = useState('');

  // Sample questions data
  const sampleQuestions = [
    {
      id: 1,
      text: "Reprehenderit In Voluptate Velit Esse Cillum Dolore",
      options: {
        A: "Euismod Tempor Incididunt Ut",
        B: "Fugiat Nulla Pariatur",
        C: "Voluptatem Accusantium Doloremque",
        D: "Totam Rem Aperiam"
      }
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: {
        A: "Sed do eiusmod tempor",
        B: "Incididunt ut labore",
        C: "Et dolore magna aliqua",
        D: "Ut enim ad minim"
      }
    },
    {
      id: 3,
      text: "Which of the following is correct about React hooks?",
      options: {
        A: "They can only be used in class components",
        B: "They allow you to use state in functional components",
        C: "They are deprecated in React 18",
        D: "They cannot be used with TypeScript"
      }
    }
  ];

  const questions = testData?.questions || sampleQuestions;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load saved answer when question changes
  useEffect(() => {
    setCurrentSelection(selectedAnswers[currentQuestionIndex] || '');
  }, [currentQuestionIndex, selectedAnswers]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleOptionSelect = (option) => {
    setCurrentSelection(option);
  };

  const handleSubmitAnswer = (answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    setAttemptedQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: true
    }));
    
    // Auto move to next question if not the last one
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleTestSubmit = () => {
    // Handle test submission logic here
    console.log('Test submitted:', {
      answers: selectedAnswers,
      attempted: attemptedQuestions,
      marked: markedForReview
    });
    alert('Test submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            {/* Test Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <FiBookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {testData?.title || "Live Test Examination"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiUser className="w-4 h-4" />
                <span className="text-sm">Student Name</span>
              </div>
            </div>

            {/* Timer and Actions */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className={`
                flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm
                ${timeRemaining <= 300 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
                }
              `}>
                <FiClock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-lg">{formatTime(timeRemaining)}</span>
                <span className="hidden sm:inline text-xs sm:text-sm">Time Remaining</span>
              </div>
              
              <button
                onClick={handleTestSubmit}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Test</span>
                <span className="sm:hidden">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile/Tablet Question Navigator - Only visible on small screens */}
        <div className="lg:hidden mb-4">
          <QuestionListing
            questions={questions}
            currentQuestion={currentQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
            attemptedQuestions={attemptedQuestions}
            markedForReview={markedForReview}
            isMobile={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <MainQuestion
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedOption={currentSelection}
              onOptionSelect={handleOptionSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onMarkForReview={handleMarkForReview}
              onSubmitAnswer={handleSubmitAnswer}
              isMarkedForReview={markedForReview[currentQuestionIndex]}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          </div>

          {/* Questions Sidebar - Hidden on mobile, visible on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2 hidden lg:block">
            <QuestionListing
              questions={questions}
              currentQuestion={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              attemptedQuestions={attemptedQuestions}
              markedForReview={markedForReview}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTestPage;