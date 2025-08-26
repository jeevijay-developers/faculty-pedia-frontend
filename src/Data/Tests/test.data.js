export const testData = [
  {
    id: 1,
    title: "Organic Chemistry Mastery",
    educatorName: "Dr. Priya Verma",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD, Chemistry",
    subject: "Chemistry",
    slug: "organic-chemistry-mastery",
    noOfTests: 25,
    fee: 15000,
    specialization: "IIT-JEE",
  },
  {
    id: 2,
    title: "Mathematics Complete Series",
    educatorName: "Prof. Amit Kumar",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD, Mathematics",
    slug: "mathematics-complete-series",
    subject: "Mathematics",
    noOfTests: 30,
    fee: 14000,
    specialization: "IIT-JEE",
  },
  {
    id: 3,
    title: "Physics Problem Solving",
    educatorName: "Dr. Rajiv Mehta",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD, Physics",
    slug: "physics-problem-solving",
    subject: "Physics",
    noOfTests: 22,
    fee: 14500,
    specialization: "IIT-JEE",
  },
  {
    id: 4,
    title: "Physical Chemistry Practice",
    educatorName: "Dr. Ankur Gupta",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD, Chemistry",
    slug: "physical-chemistry-practice",
    subject: "Chemistry",
    noOfTests: 18,
    fee: 13000,
    specialization: "NEET",
  },
  {
    id: 5,
    title: "Advanced Calculus Series",
    educatorName: "Prof. Neha Sharma",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD, Mathematics",
    slug: "advanced-calculus-series",
    subject: "Mathematics",
    noOfTests: 20,
    fee: 13500,
    specialization: "IIT-JEE",
  },
  {
    id: 6,
    title: "NEET Biology Masterclass",
    educatorName: "Dr. Anjali Verma",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD, Biology",
    slug: "neet-biology-masterclass",
    subject: "Biology",
    noOfTests: 28,
    fee: 14200,
    specialization: "NEET",
  },
  {
    id: 7,
    title: "CBSE Class 10 Science Comprehensive",
    educatorName: "Dr. Meera Joshi",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "M.Sc Physics, B.Sc Chemistry",
    slug: "cbse-class-10-science-comprehensive",
    subject: "Science",
    noOfTests: 15,
    fee: 9000,
    specialization: "CBSE",
  },
  {
    id: 8,
    title: "IIT-JEE Mechanics Drill",
    educatorName: "Dr. John Doe",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "M.Sc Physics",
    slug: "iit-jee-mechanics-drill",
    subject: "Physics",
    noOfTests: 24,
    fee: 14800,
    specialization: "IIT-JEE",
  },
  {
    id: 9,
    title: "NEET Zoology Focus Series",
    educatorName: "Dr. Deepika Paul",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "PhD Zoology, M.Sc Botany",
    slug: "neet-zoology-focus-series",
    subject: "Biology",
    noOfTests: 18,
    fee: 12000,
    specialization: "NEET",
  },
  {
    id: 10,
    title: "CBSE English Literature Practice",
    educatorName: "Prof. Vikram Malhotra",
    educatorPhoto: "/images/placeholders/1.svg",
    qualification: "M.A English, B.Ed",
    slug: "cbse-english-literature-practice",
    subject: "English",
    noOfTests: 12,
    fee: 8500,
    specialization: "CBSE",
  },
];

// Utility: get tests by specialization (IIT-JEE, NEET, CBSE, All)
export const getTestsBySpecialization = (specialization = 'All') => {
  if (specialization === 'All') return testData;
  return testData.filter(t => t.specialization === specialization);
};

// Utility: get tests by subject (Maths, Physics, Chemistry, Biology, etc.)
export const getTestsBySubject = (subject = 'All') => {
  if (subject === 'All') return testData;
  return testData.filter(t => t.subject === subject);
};

// Utility: get single test by slug
export const getTestBySlug = (slug) => testData.find(t => t.slug === slug);