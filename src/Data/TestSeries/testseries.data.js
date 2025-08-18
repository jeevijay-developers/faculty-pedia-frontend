// Test Series Data for NEET - Based on LiveTestSeries Schema
export const testSeriesData = [
  // Physics Test Series
  {
    _id: "neet_physics_001",
    title: "mock test series on physics",
    description: {
      short: "Comprehensive physics test series covering all NEET syllabus topics",
      long: "Comprehensive physics test series covering all NEET syllabus topics with detailed solutions and analysis. Perfect for NEET aspirants looking to excel in Physics."
    },
    price: 499,
    noOfTests: 12,
    startDate: "2024-07-15T00:00:00.000Z",
    endDate: "2024-12-15T00:00:00.000Z",
    image: {
      public_id: "neet_physics_001_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_001",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    // Additional fields for UI (not in schema but needed for display)
    subject: "Physics",
    specialization: "NEET",
    teacher: {
      _id: "educator_001",
      name: "Ankit Sharma",
      profileImage: "/images/placeholders/square.svg",
      qualification: "M.Sc. PhD",
      experience: "8 years experience"
    }
  },
  {
    _id: "neet_physics_002",
    title: "advanced physics test series",
    description: {
      short: "Advanced level physics test series for high-scoring NEET aspirants",
      long: "Advanced level physics test series for high-scoring NEET aspirants with challenging questions and comprehensive analysis to boost your performance."
    },
    price: 699,
    noOfTests: 15,
    startDate: "2024-08-01T00:00:00.000Z",
    endDate: "2025-01-01T00:00:00.000Z",
    image: {
      public_id: "neet_physics_002_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_002",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Physics",
    specialization: "NEET",
    teacher: {
      _id: "educator_002",
      name: "Dr. Rajesh Kumar",
  profileImage: "/images/placeholders/square.svg",
      qualification: "Ph.D. in Physics",
      experience: "12 years experience"
    }
  },
  
  // Chemistry Test Series
  {
    _id: "neet_chemistry_001",
    title: "complete chemistry test series",
    description: {
      short: "Comprehensive chemistry test series covering Organic, Inorganic, and Physical Chemistry",
      long: "Comprehensive chemistry test series covering Organic, Inorganic, and Physical Chemistry with detailed explanations and problem-solving techniques for NEET success."
    },
    price: 599,
    noOfTests: 18,
    startDate: "2024-07-20T00:00:00.000Z",
    endDate: "2025-02-20T00:00:00.000Z",
    image: {
      public_id: "neet_chemistry_001_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_003",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Chemistry",
    specialization: "NEET",
    teacher: {
      _id: "educator_003",
      name: "Dr. Priya Patel",
  profileImage: "/images/placeholders/square.svg",
      qualification: "Ph.D. in Organic Chemistry",
      experience: "10 years experience"
    }
  },
  {
    _id: "neet_chemistry_002",
    title: "organic chemistry mastery tests",
    description: {
      short: "Specialized test series focusing on Organic Chemistry concepts and reactions",
      long: "Specialized test series focusing on Organic Chemistry concepts and reactions with mechanism-based questions and detailed explanations for NEET preparation."
    },
    price: 399,
    noOfTests: 10,
    startDate: "2024-08-05T00:00:00.000Z",
    endDate: "2024-12-05T00:00:00.000Z",
    image: {
      public_id: "neet_chemistry_002_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_004",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Chemistry",
    specialization: "NEET",
    teacher: {
      _id: "educator_004",
      name: "Prof. Vikram Singh",
  profileImage: "/images/placeholders/square.svg",
      qualification: "M.Sc. Chemistry",
      experience: "9 years experience"
    }
  },
  
  // Biology Test Series
  {
    _id: "neet_biology_001",
    title: "mock test series on biology",
    description: {
      short: "Complete biology test series covering Botany and Zoology for NEET preparation",
      long: "Complete biology test series covering Botany and Zoology for NEET preparation with diagram-based questions and NCERT focused content for comprehensive understanding."
    },
    price: 499,
    noOfTests: 12,
    startDate: "2024-07-15T00:00:00.000Z",
    endDate: "2024-12-15T00:00:00.000Z",
    image: {
      public_id: "neet_biology_001_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_005",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Biology",
    specialization: "NEET",
    teacher: {
      _id: "educator_005",
      name: "Ankit Sharma",
  profileImage: "/images/placeholders/square.svg",
      qualification: "M.Sc. PhD",
      experience: "8 years experience"
    }
  },
  {
    _id: "neet_biology_002",
    title: "advanced biology test series",
    description: {
      short: "Advanced biology test series with extensive coverage of all NEET topics",
      long: "Advanced biology test series with extensive coverage of all NEET topics including high-quality diagrams, conceptual clarity focus, and application-based questions."
    },
    price: 799,
    noOfTests: 20,
    startDate: "2024-08-10T00:00:00.000Z",
    endDate: "2025-04-10T00:00:00.000Z",
    image: {
      public_id: "neet_biology_002_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_006",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Biology",
    specialization: "NEET",
    teacher: {
      _id: "educator_006",
      name: "Dr. Sneha Gupta",
  profileImage: "/images/placeholders/square.svg",
      qualification: "Ph.D. in Botany",
      experience: "11 years experience"
    }
  },
  {
    _id: "neet_biology_003",
    title: "human physiology test series",
    description: {
      short: "Specialized test series focusing on Human Physiology and related topics",
      long: "Specialized test series focusing on Human Physiology and related topics with system-wise tests, clinical correlations, and memory aids for comprehensive learning."
    },
    price: 299,
    noOfTests: 8,
    startDate: "2024-08-15T00:00:00.000Z",
    endDate: "2024-11-15T00:00:00.000Z",
    image: {
      public_id: "neet_biology_003_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_007",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Biology",
    specialization: "NEET",
    teacher: {
      _id: "educator_007",
      name: "Dr. Amit Verma",
  profileImage: "/images/placeholders/square.svg",
      qualification: "M.D. Physiology",
      experience: "7 years experience"
    }
  }
  ,
  // IIT-JEE Test Series
  {
    _id: "jee_physics_001",
    title: "mock test series on physics for jee",
    description: {
      short: "JEE Physics mock tests with chapter-wise coverage",
      long: "Comprehensive JEE Physics test series focusing on Mechanics, Electrodynamics, Optics and more, aligned to JEE Main & Advanced patterns."
    },
    price: 599,
    noOfTests: 14,
    startDate: "2024-09-01T00:00:00.000Z",
    endDate: "2025-03-01T00:00:00.000Z",
    image: { public_id: "jee_physics_001_img", url: "/images/placeholders/1.svg" },
    teacherId: "educator_011",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Physics",
    specialization: "IIT-JEE",
    teacher: {
      _id: "educator_011",
      name: "Prof. Karan Mehta",
      profileImage: "/images/placeholders/square.svg",
      qualification: "M.Tech (IIT)",
      experience: "9 years experience"
    }
  },
  {
    _id: "jee_chemistry_001",
    title: "complete chemistry test series for jee",
    description: {
      short: "JEE Chemistry test series covering Physical, Organic, Inorganic",
      long: "Extensive JEE Chemistry test series with balanced weightage across Physical, Organic and Inorganic, including previous year patterns."
    },
    price: 549,
    noOfTests: 16,
    startDate: "2024-09-10T00:00:00.000Z",
    endDate: "2025-03-10T00:00:00.000Z",
    image: { public_id: "jee_chemistry_001_img", url: "/images/placeholders/1.svg" },
    teacherId: "educator_012",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Chemistry",
    specialization: "IIT-JEE",
    teacher: {
      _id: "educator_012",
      name: "Dr. Ruchi Arora",
      profileImage: "/images/placeholders/square.svg",
      qualification: "Ph.D. Chemistry",
      experience: "10 years experience"
    }
  },
  {
    _id: "jee_mathematics_001",
    title: "advanced mathematics test series for jee",
    description: {
      short: "JEE Maths test series focusing on Calculus, Algebra, Coordinate",
      long: "Rigorous JEE Mathematics test series with chapter-wise and mixed-format tests covering Calculus, Algebra, Trigonometry and Coordinate Geometry."
    },
    price: 649,
    noOfTests: 18,
    startDate: "2024-09-05T00:00:00.000Z",
    endDate: "2025-04-05T00:00:00.000Z",
    image: { public_id: "jee_mathematics_001_img", url: "/images/placeholders/1.svg" },
    teacherId: "educator_013",
    enrolledStudents: [],
    liveTests: [],
    isCourseSpecific: false,
    courseId: null,
    subject: "Mathematics",
    specialization: "IIT-JEE",
    teacher: {
      _id: "educator_013",
      name: "Prof. Neha Gupta",
      profileImage: "/images/placeholders/square.svg",
      qualification: "M.Sc. Mathematics",
      experience: "8 years experience"
    }
  }
];

// Helper functions
export const getTestSeriesBySubject = (subject) => {
  return testSeriesData.filter(test => test.subject === subject);
};

export const getTestSeriesById = (id) => {
  return testSeriesData.find(test => test._id === id);
};

export const getAllSubjects = () => {
  return [...new Set(testSeriesData.map(test => test.subject))];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateValidity = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return `${diffMonths} months`;
};

// New helpers for exam-specific filtering
export const getAllSubjectsByExam = (exam) => {
  return [
    ...new Set(
      testSeriesData
        .filter((t) => t.specialization === exam)
        .map((t) => t.subject)
    ),
  ];
};

export const getTestSeriesByExamAndSubject = (exam, subject) => {
  return testSeriesData.filter(
    (t) => t.specialization === exam && t.subject === subject
  );
};
