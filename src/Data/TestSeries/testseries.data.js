// Test Series Data for NEET
export const testSeriesData = [
  // Physics Test Series
  {
    id: "neet_physics_001",
    title: "Mock Test Series on Physics",
    subject: "Physics",
    specialization: "NEET",
    educator: {
      id: "educator_001",
      name: "Ankit Sharma",
      photo: "/images/educators/ankit-sharma.jpg",
      qualification: "M.Sc. PhD",
      experience: "8 years experience"
    },
    syllabus: "Full syllabus",
    totalTests: 12,
    startingDate: "2024-07-15",
    validity: "6 months",
    fee: 499,
    description: "Comprehensive physics test series covering all NEET syllabus topics with detailed solutions and analysis.",
    features: [
      "Chapter-wise tests",
      "Full syllabus mock tests",
      "Detailed performance analysis",
      "Video solutions for difficult questions"
    ]
  },
  {
    id: "neet_physics_002",
    title: "Advanced Physics Test Series",
    subject: "Physics",
    specialization: "NEET",
    educator: {
      id: "educator_002",
      name: "Dr. Rajesh Kumar",
      photo: "/images/educators/rajesh-kumar.jpg",
      qualification: "Ph.D. in Physics",
      experience: "12 years experience"
    },
    syllabus: "Advanced topics",
    totalTests: 15,
    startingDate: "2024-08-01",
    validity: "8 months",
    fee: 699,
    description: "Advanced level physics test series for high-scoring NEET aspirants.",
    features: [
      "Advanced difficulty questions",
      "Time management strategies",
      "Rank predictor",
      "Expert mentoring sessions"
    ]
  },
  
  // Chemistry Test Series
  {
    id: "neet_chemistry_001",
    title: "Complete Chemistry Test Series",
    subject: "Chemistry",
    specialization: "NEET",
    educator: {
      id: "educator_003",
      name: "Dr. Priya Patel",
      photo: "/images/educators/priya-patel.jpg",
      qualification: "Ph.D. in Organic Chemistry",
      experience: "10 years experience"
    },
    syllabus: "Full syllabus",
    totalTests: 18,
    startingDate: "2024-07-20",
    validity: "7 months",
    fee: 599,
    description: "Comprehensive chemistry test series covering Organic, Inorganic, and Physical Chemistry.",
    features: [
      "Subject-wise breakdown",
      "Reaction mechanism focus",
      "Memory techniques",
      "Quick revision notes"
    ]
  },
  {
    id: "neet_chemistry_002",
    title: "Organic Chemistry Mastery Tests",
    subject: "Chemistry",
    specialization: "NEET",
    educator: {
      id: "educator_004",
      name: "Prof. Vikram Singh",
      photo: "/images/educators/vikram-singh.jpg",
      qualification: "M.Sc. Chemistry",
      experience: "9 years experience"
    },
    syllabus: "Organic Chemistry",
    totalTests: 10,
    startingDate: "2024-08-05",
    validity: "5 months",
    fee: 399,
    description: "Specialized test series focusing on Organic Chemistry concepts and reactions.",
    features: [
      "Mechanism-based questions",
      "Named reaction focus",
      "Synthesis problems",
      "Structure elucidation"
    ]
  },
  
  // Biology Test Series
  {
    id: "neet_biology_001",
    title: "Mock Test Series on Biology",
    subject: "Biology",
    specialization: "NEET",
    educator: {
      id: "educator_005",
      name: "Ankit Sharma",
      photo: "/images/educators/ankit-sharma.jpg",
      qualification: "M.Sc. PhD",
      experience: "8 years experience"
    },
    syllabus: "Full syllabus",
    totalTests: 12,
    startingDate: "2024-07-15",
    validity: "6 months",
    fee: 499,
    description: "Complete biology test series covering Botany and Zoology for NEET preparation.",
    features: [
      "Diagram-based questions",
      "NCERT focused content",
      "Previous year analysis",
      "Topic-wise performance tracking"
    ]
  },
  {
    id: "neet_biology_002",
    title: "Advanced Biology Test Series",
    subject: "Biology",
    specialization: "NEET",
    educator: {
      id: "educator_006",
      name: "Dr. Sneha Gupta",
      photo: "/images/educators/sneha-gupta.jpg",
      qualification: "Ph.D. in Botany",
      experience: "11 years experience"
    },
    syllabus: "Full syllabus",
    totalTests: 20,
    startingDate: "2024-08-10",
    validity: "9 months",
    fee: 799,
    description: "Advanced biology test series with extensive coverage of all NEET topics.",
    features: [
      "High-quality diagrams",
      "Conceptual clarity focus",
      "Application-based questions",
      "Expert doubt resolution"
    ]
  },
  {
    id: "neet_biology_003",
    title: "Human Physiology Test Series",
    subject: "Biology",
    specialization: "NEET",
    educator: {
      id: "educator_007",
      name: "Dr. Amit Verma",
      photo: "/images/educators/amit-verma.jpg",
      qualification: "M.D. Physiology",
      experience: "7 years experience"
    },
    syllabus: "Human Physiology",
    totalTests: 8,
    startingDate: "2024-08-15",
    validity: "4 months",
    fee: 299,
    description: "Specialized test series focusing on Human Physiology and related topics.",
    features: [
      "System-wise tests",
      "Clinical correlations",
      "Process-based questions",
      "Memory aids included"
    ]
  }
];

// Helper functions
export const getTestSeriesBySubject = (subject) => {
  return testSeriesData.filter(test => test.subject === subject);
};

export const getTestSeriesById = (id) => {
  return testSeriesData.find(test => test.id === id);
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
