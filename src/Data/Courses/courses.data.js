import { educatorsData } from '../Educator/educator-profile.data.js';

export const defaultCourses = [
  {
    id: 1,
    title: "JEE Maths Foundation Course",
    instructor: "Meera Sharma",
    educatorId: "edu_003", // Rajesh Kumar - Mathematics IIT-JEE
    duration: "24 weeks",
    startDate: "8 Aug 2025",
    price: "7999",
    originalPrice: "9999",
    image: "/images/placeholders/1.svg",
    subject: "Mathematics",
    specialization: "IIT-JEE",
  },
  {
    id: 2,
    title: "NEET Biology Masterclass",
    instructor: "Dr. Rajesh Kumar",
    educatorId: "edu_004", // Anjali Verma - Biology NEET
    duration: "32 weeks",
    startDate: "15 Aug 2025",
    price: "8999",
    originalPrice: "11999",
    image: "/images/placeholders/1.svg",
    subject: "Biology",
    specialization: "NEET",
  },
  {
    id: 3,
    title: "Physics for Engineering",
    instructor: "Prof. Anita Singh",
    educatorId: "edu_001", // John Doe - Physics IIT-JEE
    duration: "20 weeks",
    startDate: "1 Sep 2025",
    price: "6999",
    originalPrice: "8999",
    image: "/images/placeholders/1.svg",
    subject: "Physics",
    specialization: "IIT-JEE",
  },
  {
    id: 4,
    title: "Chemistry Complete Package",
    instructor: "Dr. Vikram Patel",
    educatorId: "edu_006", // Kavitha Reddy - Chemistry NEET
    duration: "28 weeks",
    startDate: "20 Aug 2025",
    price: "7499",
    originalPrice: "9499",
    image: "/images/placeholders/1.svg",
    subject: "Chemistry",
    specialization: "NEET",
  },
  {
    id: 5,
    title: "English for Competitive Exams",
    instructor: "Ms. Priya Mehta",
    educatorId: "edu_009", // Vikram Malhotra - English & Social Studies CBSE
    duration: "16 weeks",
    startDate: "10 Sep 2025",
    price: "4999",
    originalPrice: "6999",
    image: "/images/placeholders/1.svg",
    description: "Complete English preparation for all competitive exams with grammar and comprehension.",
    subject: "English",
    specialization: "CBSE",
  },
  {
    id: 6,
    title: "Advanced Organic Chemistry for JEE",
    instructor: "Dr. Priya Sharma",
    educatorId: "edu_002", // Priya Sharma - Chemistry IIT-JEE
    duration: "22 weeks",
    startDate: "5 Sep 2025",
    price: "8499",
    originalPrice: "10999",
    image: "/images/placeholders/1.svg",
    description: "Master organic chemistry with advanced reaction mechanisms and problem-solving techniques for JEE Main and Advanced.",
    subject: "Chemistry",
    specialization: "IIT-JEE",
  },
  {
    id: 7,
    title: "NEET Physics Crash Course",
    instructor: "Dr. Suresh Nair",
    educatorId: "edu_005", // Suresh Nair - Physics NEET
    duration: "18 weeks",
    startDate: "12 Sep 2025",
    price: "6999",
    originalPrice: "8499",
    image: "/images/placeholders/1.svg",
    description: "Intensive physics preparation for NEET with focus on mechanics, thermodynamics, and modern physics.",
    subject: "Physics",
    specialization: "NEET",
  },
  {
    id: 8,
    title: "CBSE Class 12 Mathematics",
    instructor: "Prof. Amit Singh",
    educatorId: "edu_007", // Amit Singh - Mathematics CBSE
    duration: "30 weeks",
    startDate: "1 Aug 2025",
    price: "5999",
    originalPrice: "7999",
    image: "/images/placeholders/1.svg",
    description: "Complete CBSE Class 12 Mathematics syllabus with calculus, algebra, and probability for board exam excellence.",
    subject: "Mathematics",
    specialization: "CBSE",
  },
  {
    id: 9,
    title: "NEET Chemistry Foundation",
    instructor: "Dr. Rohit Sharma",
    educatorId: "edu_012", // Rohit Sharma - Chemistry NEET
    duration: "26 weeks",
    startDate: "18 Aug 2025",
    price: "7999",
    originalPrice: "9999",
    image: "/images/placeholders/1.svg",
    description: "Comprehensive chemistry foundation for NEET covering physical, inorganic, and organic chemistry concepts.",
    subject: "Chemistry",
    specialization: "NEET",
  },
  {
    id: 10,
    title: "JEE Advanced Mathematics Masterclass",
    instructor: "Dr. Neeraj Agarwal",
    educatorId: "edu_010", // Neeraj Agarwal - Mathematics & Physics IIT-JEE
    duration: "25 weeks",
    startDate: "22 Aug 2025",
    price: "9999",
    originalPrice: "12999",
    image: "/images/placeholders/1.svg",
    description: "Advanced mathematics for JEE with calculus, coordinate geometry, and complex problem-solving strategies.",
    subject: "Mathematics",
    specialization: "IIT-JEE",
  },
  {
    id: 11,
    title: "CBSE Science for Class 10",
    instructor: "Dr. Meera Joshi",
    educatorId: "edu_008", // Meera Joshi - Science CBSE
    duration: "20 weeks",
    startDate: "28 Aug 2025",
    price: "4499",
    originalPrice: "5999",
    image: "/images/placeholders/1.svg",
    description: "Complete Class 10 CBSE Science covering physics, chemistry, and biology for board exam success.",
    subject: "Science",
    specialization: "CBSE",
  },
  {
    id: 12,
    title: "NEET Botany and Zoology Complete",
    instructor: "Dr. Deepika Paul",
    educatorId: "edu_011", // Deepika Paul - Biology NEET
    duration: "28 weeks",
    startDate: "3 Sep 2025",
    price: "8999",
    originalPrice: "11499",
    image: "/images/placeholders/1.svg",
    description: "Comprehensive botany and zoology course for NEET with detailed diagrams and extensive practice questions.",
    subject: "Biology",
    specialization: "NEET",
  },
  {
    id: 13,
    title: "JEE Physics Problem Solving Workshop",
    instructor: "Dr. John Doe",
    educatorId: "edu_001", // John Doe - Physics IIT-JEE
    duration: "15 weeks",
    startDate: "15 Sep 2025",
    price: "5999",
    originalPrice: "7499",
    image: "/images/placeholders/1.svg",
    description: "Intensive problem-solving workshop for JEE physics with challenging numerical and conceptual questions.",
    subject: "Physics",
    specialization: "IIT-JEE",
  },
];

// Utility function to get educator details by ID
export const getEducatorById = (educatorId) => {
  return educatorsData.find(educator => educator.id === educatorId);
};

// Utility function to get course with educator details
export const getCourseWithEducator = (courseId) => {
  const course = defaultCourses.find(course => course.id === courseId);
  if (!course) return null;
  
  const educator = getEducatorById(course.educatorId);
  return {
    ...course,
    educatorDetails: educator
  };
};

// Utility function to get all courses with educator details
export const getCoursesWithEducators = () => {
  return defaultCourses.map(course => ({
    ...course,
    educatorDetails: getEducatorById(course.educatorId)
  }));
};

// Filter courses by subject
export const getCoursesBySubject = (subject) => {
  if (subject === 'All') {
    return getCoursesWithEducators();
  }
  return getCoursesWithEducators().filter(course => course.subject === subject);
};

// Filter courses by specialization
export const getCoursesBySpecialization = (specialization) => {
  if (specialization === 'All') {
    return getCoursesWithEducators();
  }
  return getCoursesWithEducators().filter(course => course.specialization === specialization);
};
