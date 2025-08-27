// Test Series Data for NEET - Based on LiveTestSeries Schema
export const testSeriesData = [
  // Physics Test Series
  {
    _id: 1,
    title: "mock test series on physics",
    description: {
      short: "Comprehensive physics test series covering all NEET syllabus topics",
      long: "Comprehensive physics test series covering all NEET syllabus topics with detailed solutions and analysis. Perfect for NEET aspirants looking to excel in Physics."
    },
    price: 499,
    noOfTests: 2,
    startDate: "2024-07-15T00:00:00.000Z",
    endDate: "2024-12-15T00:00:00.000Z",
    image: {
      public_id: "neet_physics_001_img",
      url: "/images/placeholders/1.svg"
    },
    teacherId: "educator_001",
    enrolledStudents: [],
    liveTests: [
      {
        _id: "test_1_1",
        title: "mechanics fundamentals test",
        description: {
          short: "Basic mechanics concepts test covering kinematics and dynamics",
          long: "Comprehensive test covering fundamental concepts of mechanics including kinematics, dynamics, Newton's laws, and motion in one and two dimensions."
        },
        image: {
          public_id: "test_1_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "physics",
        startDate: "2024-07-20T10:00:00.000Z",
        duration: 120, // minutes
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q1", "q2", "q3"], // Mock question IDs
        testSeriesId: 1,
        educatorId: "educator_001"
      },
      {
        _id: "test_1_2",
        title: "waves and oscillations test",
        description: {
          short: "Test on wave motion, sound waves, and simple harmonic motion",
          long: "Detailed test covering wave properties, sound waves, Doppler effect, simple harmonic motion, and oscillatory systems."
        },
        image: {
          public_id: "test_1_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "physics",
        startDate: "2024-08-05T10:00:00.000Z",
        duration: 120,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q4", "q5", "q6"],
        testSeriesId: 1,
        educatorId: "educator_001"
      }
    ],
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
    _id: 2,
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
    liveTests: [
      {
        _id: "test_2_1",
        title: "electromagnetic induction test",
        description: {
          short: "Advanced test on electromagnetic induction and magnetic effects",
          long: "Comprehensive test covering Faraday's law, Lenz's law, electromagnetic induction, mutual and self-inductance, and AC circuits."
        },
        image: {
          public_id: "test_2_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "physics",
        startDate: "2024-08-10T14:00:00.000Z",
        duration: 150,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q7", "q8", "q9"],
        testSeriesId: 2,
        educatorId: "educator_002"
      },
      {
        _id: "test_2_2",
        title: "modern physics test",
        description: {
          short: "Test covering quantum mechanics, atomic structure, and nuclear physics",
          long: "Advanced test on modern physics concepts including photoelectric effect, Bohr's model, quantum mechanics principles, and nuclear reactions."
        },
        image: {
          public_id: "test_2_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "physics",
        startDate: "2024-08-25T14:00:00.000Z",
        duration: 150,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q10", "q11", "q12"],
        testSeriesId: 2,
        educatorId: "educator_002"
      }
    ],
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
    _id: 3,
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
    liveTests: [
      {
        _id: "test_3_1",
        title: "organic chemistry nomenclature test",
        description: {
          short: "Test on IUPAC nomenclature and basic organic chemistry concepts",
          long: "Comprehensive test covering IUPAC nomenclature, functional groups, isomerism, and basic organic reaction mechanisms."
        },
        image: {
          public_id: "test_3_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "chemistry",
        startDate: "2024-07-25T11:00:00.000Z",
        duration: 120,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q13", "q14", "q15"],
        testSeriesId: 3,
        educatorId: "educator_003"
      },
      {
        _id: "test_3_2",
        title: "physical chemistry equilibrium test",
        description: {
          short: "Test on chemical equilibrium, thermodynamics, and kinetics",
          long: "Detailed test covering chemical equilibrium principles, Le Chatelier's principle, thermodynamics laws, and chemical kinetics."
        },
        image: {
          public_id: "test_3_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "chemistry",
        startDate: "2024-08-15T11:00:00.000Z",
        duration: 120,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q16", "q17", "q18"],
        testSeriesId: 3,
        educatorId: "educator_003"
      }
    ],
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
    _id: 4,
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
    liveTests: [
      {
        _id: "test_4_1",
        title: "organic reaction mechanisms test",
        description: {
          short: "Test focusing on organic reaction mechanisms and synthesis",
          long: "Specialized test on organic reaction mechanisms, synthesis pathways, and stereochemistry concepts for advanced organic chemistry."
        },
        image: {
          public_id: "test_4_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "chemistry",
        startDate: "2024-08-12T09:00:00.000Z",
        duration: 90,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q19", "q20", "q21"],
        testSeriesId: 4,
        educatorId: "educator_004"
      }
    ],
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
    _id: 5,
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
    liveTests: [
      {
        _id: "test_5_1",
        title: "plant anatomy and morphology test",
        description: {
          short: "Test on plant structure, anatomy, and morphological features",
          long: "Comprehensive test covering plant anatomy, morphology, tissue systems, and structural adaptations in flowering plants."
        },
        image: {
          public_id: "test_5_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "biology",
        startDate: "2024-07-22T10:00:00.000Z",
        duration: 120,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q22", "q23", "q24"],
        testSeriesId: 5,
        educatorId: "educator_005"
      },
      {
        _id: "test_5_2",
        title: "animal diversity test",
        description: {
          short: "Test on animal classification, diversity, and evolutionary relationships",
          long: "Detailed test covering animal kingdom classification, phylogenetic relationships, and diversity patterns across different taxa."
        },
        image: {
          public_id: "test_5_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "biology",
        startDate: "2024-08-08T10:00:00.000Z",
        duration: 120,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q25", "q26", "q27"],
        testSeriesId: 5,
        educatorId: "educator_005"
      }
    ],
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
    _id: 6,
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
    liveTests: [
      {
        _id: "test_6_1",
        title: "cell biology and genetics test",
        description: {
          short: "Advanced test on cell structure, function, and genetic principles",
          long: "Comprehensive test covering cell organelles, cell cycle, molecular genetics, inheritance patterns, and genetic engineering."
        },
        image: {
          public_id: "test_6_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "biology",
        startDate: "2024-08-18T13:00:00.000Z",
        duration: 150,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q28", "q29", "q30"],
        testSeriesId: 6,
        educatorId: "educator_006"
      },
      {
        _id: "test_6_2",
        title: "ecology and environment test",
        description: {
          short: "Test on ecological principles, ecosystems, and environmental issues",
          long: "Advanced test covering ecosystem dynamics, biodiversity, conservation biology, and environmental challenges."
        },
        image: {
          public_id: "test_6_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "biology",
        startDate: "2024-09-05T13:00:00.000Z",
        duration: 150,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q31", "q32", "q33"],
        testSeriesId: 6,
        educatorId: "educator_006"
      }
    ],
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
    _id: 7,
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
    liveTests: [
      {
        _id: "test_7_1",
        title: "cardiovascular system test",
        description: {
          short: "Test on heart structure, circulation, and cardiovascular physiology",
          long: "Specialized test covering heart anatomy, cardiac cycle, blood circulation, and cardiovascular system disorders."
        },
        image: {
          public_id: "test_7_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "biology",
        startDate: "2024-08-22T15:00:00.000Z",
        duration: 90,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q34", "q35", "q36"],
        testSeriesId: 7,
        educatorId: "educator_007"
      }
    ],
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
    _id: 8,
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
    liveTests: [
      {
        _id: "test_8_1",
        title: "jee mechanics advanced test",
        description: {
          short: "Advanced JEE level mechanics test with complex problem solving",
          long: "Challenging JEE Advanced level test covering advanced mechanics concepts including rotational dynamics, gravitation, and oscillations."
        },
        image: {
          public_id: "test_8_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "physics",
        startDate: "2024-09-08T10:00:00.000Z",
        duration: 180,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q37", "q38", "q39"],
        testSeriesId: 8,
        educatorId: "educator_011"
      },
      {
        _id: "test_8_2",
        title: "jee electromagnetism test",
        description: {
          short: "JEE level test on electrostatics, current electricity, and magnetism",
          long: "Comprehensive JEE test covering electrostatics, current electricity, magnetic effects of current, and electromagnetic waves."
        },
        image: {
          public_id: "test_8_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "physics",
        startDate: "2024-09-22T10:00:00.000Z",
        duration: 180,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q40", "q41", "q42"],
        testSeriesId: 8,
        educatorId: "educator_011"
      }
    ],
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
    _id: 9,
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
    liveTests: [
      {
        _id: "test_9_1",
        title: "jee physical chemistry test",
        description: {
          short: "JEE level test on thermodynamics, kinetics, and equilibrium",
          long: "Advanced JEE test covering thermodynamics, chemical kinetics, equilibrium, and electrochemistry concepts."
        },
        image: {
          public_id: "test_9_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "chemistry",
        startDate: "2024-09-15T11:00:00.000Z",
        duration: 180,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q43", "q44", "q45"],
        testSeriesId: 9,
        educatorId: "educator_012"
      },
      {
        _id: "test_9_2",
        title: "jee inorganic chemistry test",
        description: {
          short: "JEE test on coordination compounds, d-block, and qualitative analysis",
          long: "Comprehensive JEE test covering coordination chemistry, transition elements, and inorganic qualitative analysis."
        },
        image: {
          public_id: "test_9_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "chemistry",
        startDate: "2024-10-01T11:00:00.000Z",
        duration: 180,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q46", "q47", "q48"],
        testSeriesId: 9,
        educatorId: "educator_012"
      }
    ],
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
    _id: 10,
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
    liveTests: [
      {
        _id: "test_10_1",
        title: "jee calculus and differential equations test",
        description: {
          short: "JEE test on calculus, limits, derivatives, and differential equations",
          long: "Advanced JEE mathematics test covering limits, continuity, derivatives, integrals, and differential equations."
        },
        image: {
          public_id: "test_10_1_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "mathematics",
        startDate: "2024-09-12T14:00:00.000Z",
        duration: 180,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q49", "q50", "q51"],
        testSeriesId: 10,
        educatorId: "educator_013"
      },
      {
        _id: "test_10_2",
        title: "jee algebra and coordinate geometry test",
        description: {
          short: "JEE test on complex numbers, algebra, and coordinate geometry",
          long: "Comprehensive JEE test covering complex numbers, quadratic equations, sequences, coordinate geometry, and conic sections."
        },
        image: {
          public_id: "test_10_2_img",
          url: "/images/placeholders/1.svg"
        },
        subject: "mathematics",
        startDate: "2024-09-28T14:00:00.000Z",
        duration: 180,
        overallMarks: {
          positive: 4,
          negative: -1
        },
        markingType: "PQM",
        questions: ["q52", "q53", "q54"],
        testSeriesId: 10,
        educatorId: "educator_013"
      }
    ],
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