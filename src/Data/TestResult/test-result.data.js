// Sample test result data based on Result.js schema
export const sampleTestResult = {
  _id: "66d123456789abcdef123456",
  studentId: {
    _id: "66d123456789abcdef123457",
    name: "John Doe",
    email: "john.doe@example.com",
    class: "12th",
    board: "CBSE"
  },
  seriesId: {
    _id: "66d123456789abcdef123458",
    title: "CBSE Class 12 Physics Mock Test Series",
    subject: "Physics",
    totalTests: 10
  },
  testId: {
    _id: "66d123456789abcdef123459",
    title: "Electromagnetism & Optics - Test 3",
    subject: "Physics",
    duration: 180, // 3 hours in minutes
    totalQuestions: 50,
    maxMarks: 200
  },
  totalCorrect: 35,
  totalIncorrect: 12,
  totalUnattempted: 3,
  totalScore: 200, // Maximum possible score
  obtainedScore: 128, // Actual score obtained
  attemptedQuestions: [
    {
      questionId: "66d123456789abcdef12345a",
      selectedOption: "A",
      correctOption: "A",
      isCorrect: true,
      marks: 4,
      timeTaken: 45 // seconds
    },
    {
      questionId: "66d123456789abcdef12345b", 
      selectedOption: "B",
      correctOption: "C",
      isCorrect: false,
      marks: -1, // Negative marking
      timeTaken: 60
    },
    {
      questionId: "66d123456789abcdef12345c",
      selectedOption: "D",
      correctOption: "D", 
      isCorrect: true,
      marks: 4,
      timeTaken: 30
    }
  ],
  percentage: 64, // (obtainedScore / totalScore) * 100
  rank: 1247,
  totalStudents: 5420,
  createdAt: "2024-12-15T10:30:00.000Z",
  updatedAt: "2024-12-15T10:30:00.000Z"
};

// Additional sample data for testing different scenarios
export const sampleTestResults = [
  {
    ...sampleTestResult,
    _id: "66d123456789abcdef123461",
    testId: {
      ...sampleTestResult.testId,
      _id: "66d123456789abcdef123462",
      title: "Thermodynamics & Kinetic Theory - Test 1"
    },
    totalCorrect: 42,
    totalIncorrect: 6,
    totalUnattempted: 2,
    obtainedScore: 162,
    percentage: 81,
    rank: 892,
    totalStudents: 5420,
    createdAt: "2024-12-10T14:30:00.000Z"
  },
  {
    ...sampleTestResult,
    _id: "66d123456789abcdef123463",
    testId: {
      ...sampleTestResult.testId,
      _id: "66d123456789abcdef123464",
      title: "Modern Physics & Nuclear Physics - Test 5"
    },
    totalCorrect: 28,
    totalIncorrect: 18,
    totalUnattempted: 4,
    obtainedScore: 94,
    percentage: 47,
    rank: 3241,
    totalStudents: 5420,
    createdAt: "2024-12-05T16:45:00.000Z"
  },
  {
    ...sampleTestResult,
    _id: "66d123456789abcdef123465",
    testId: {
      ...sampleTestResult.testId,
      _id: "66d123456789abcdef123466",
      title: "Mechanics & Waves - Test 2",
      subject: "Physics"
    },
    totalCorrect: 38,
    totalIncorrect: 8,
    totalUnattempted: 4,
    obtainedScore: 144,
    percentage: 72,
    rank: 1856,
    totalStudents: 5420,
    createdAt: "2024-12-12T09:15:00.000Z"
  },
  {
    ...sampleTestResult,
    _id: "66d123456789abcdef123467",
    testId: {
      ...sampleTestResult.testId,
      _id: "66d123456789abcdef123468",
      title: "Organic Chemistry - Test 4",
      subject: "Chemistry"
    },
    seriesId: {
      ...sampleTestResult.seriesId,
      title: "CBSE Class 12 Chemistry Mock Test Series",
      subject: "Chemistry"
    },
    totalCorrect: 31,
    totalIncorrect: 15,
    totalUnattempted: 4,
    obtainedScore: 109,
    percentage: 54.5,
    rank: 2987,
    totalStudents: 5420,
    createdAt: "2024-12-08T11:20:00.000Z"
  },
  {
    ...sampleTestResult,
    _id: "66d123456789abcdef123469",
    testId: {
      ...sampleTestResult.testId,
      _id: "66d123456789abcdef123470",
      title: "Calculus & Differential Equations - Test 6",
      subject: "Mathematics"
    },
    seriesId: {
      ...sampleTestResult.seriesId,
      title: "CBSE Class 12 Mathematics Mock Test Series",
      subject: "Mathematics"
    },
    totalCorrect: 45,
    totalIncorrect: 3,
    totalUnattempted: 2,
    obtainedScore: 177,
    percentage: 88.5,
    rank: 284,
    totalStudents: 5420,
    createdAt: "2024-12-14T13:10:00.000Z"
  }
];

// Performance analytics data
export const performanceData = {
  subjectWisePerformance: [
    { subject: "Physics", attempted: 15, correct: 12, percentage: 80 },
    { subject: "Chemistry", attempted: 20, correct: 15, percentage: 75 },
    { subject: "Mathematics", attempted: 15, correct: 8, percentage: 53 }
  ],
  topicWisePerformance: [
    { topic: "Electromagnetism", attempted: 8, correct: 7, percentage: 87.5 },
    { topic: "Optics", attempted: 7, correct: 5, percentage: 71.4 },
    { topic: "Modern Physics", attempted: 10, correct: 6, percentage: 60 },
    { topic: "Thermodynamics", attempted: 12, correct: 9, percentage: 75 },
    { topic: "Mechanics", attempted: 13, correct: 8, percentage: 61.5 }
  ],
  timeAnalysis: {
    averageTimePerQuestion: 216, // seconds
    fastestQuestion: 15, // seconds
    slowestQuestion: 420, // seconds
    timeEfficiency: 72 // percentage
  }
};
