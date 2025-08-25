// Sample course data based on LiveCourse schema
export const coursesData = [
  {
    _id: "course1",
    specialization: "IIT-JEE",
    courseClass: "11",
    educatorId: "educator1",
    image: {
      public_id: "course1_img",
      url: "/images/courses/physics-course-1.jpg"
    },
    title: "Comprehensive physics for iit jee",
    description: {
      shortDesc: "Master Physics for IIT JEE with comprehensive problem-solving techniques",
      longDesc: "This course covers all essential topics in Physics, providing in-depth knowledge and problem-solving techniques for IIT JEE aspirants. From mechanics to modern physics, every concept is explained with real-world applications and exam-focused strategies."
    },
    courseType: "OTA",
    startDate: "2024-06-01T00:00:00.000Z",
    endDate: "2024-12-31T00:00:00.000Z",
    seatLimit: 50,
    classDuration: 2,
    fees: 20000,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    subject: "Physics",
    classesPerWeek: 5,
    totalWeeks: 30,
    totalHours: 150,
    validity: "1 Year",
    educator: {
      _id: "educator1",
      name: "Dr. Rahul Sharma",
      qualification: "M.Sc. in Physics",
      experience: "10 years teaching experience",
      profileImage: "/images/educators/dr-rahul-sharma.jpg",
      specializations: ["IIT-JEE", "Physics"]
    }
  },
  {
    _id: "course2",
    specialization: "NEET",
    courseClass: "12",
    educatorId: "educator2",
    image: {
      public_id: "course2_img",
      url: "/images/courses/biology-course-1.jpg"
    },
    title: "Advanced Biology for NEET",
    description: {
      shortDesc: "Complete Biology preparation for NEET with latest syllabus coverage",
      longDesc: "Comprehensive Biology course designed specifically for NEET aspirants covering Botany, Zoology, and Human Physiology with detailed explanations and practice questions."
    },
    courseType: "OTA",
    startDate: "2024-07-01T00:00:00.000Z",
    endDate: "2025-01-31T00:00:00.000Z",
    seatLimit: 40,
    classDuration: 2.5,
    fees: 25000,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    subject: "Biology",
    classesPerWeek: 4,
    totalWeeks: 28,
    totalHours: 140,
    validity: "18 Months",
    educator: {
      _id: "educator2",
      name: "Dr. Priya Patel",
      qualification: "Ph.D. in Biology",
      experience: "12 years teaching experience",
      profileImage: "/images/educators/dr-priya-patel.jpg",
      specializations: ["NEET", "Biology"]
    }
  },
  {
    _id: "course3",
    specialization: "IIT-JEE",
    courseClass: "12",
    educatorId: "educator1",
    image: {
      public_id: "course3_img",
      url: "/images/courses/physics-course-2.jpg"
    },
    title: "Advanced Physics for IIT JEE Mains and Advanced ",
    description: {
      shortDesc: "Advanced Physics concepts for IIT JEE Mains and Advanced preparation",
      longDesc: "Advanced level Physics course targeting IIT JEE Mains and Advanced with focus on problem-solving strategies, time management, and conceptual clarity."
    },
    courseType: "OTO",
    startDate: "2024-08-01T00:00:00.000Z",
    endDate: "2025-02-28T00:00:00.000Z",
    seatLimit: 10,
    classDuration: 3,
    fees: 35000,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    subject: "Physics",
    classesPerWeek: 3,
    totalWeeks: 26,
    totalHours: 120,
    validity: "2 Years",
    educator: {
      _id: "educator1",
      name: "Dr. Rahul Sharma",
      qualification: "M.Sc. in Physics",
      experience: "10 years teaching experience",
      profileImage: "/images/educators/dr-rahul-sharma.jpg",
      specializations: ["IIT-JEE", "Physics"]
    }
  },
  {
    _id: "course4",
    specialization: "CBSE",
    courseClass: "10",
    educatorId: "educator3",
    image: {
      public_id: "course4_img",
      url: "/images/courses/math-course-1.jpg"
    },
    title: "Complete Mathematics for CBSE Class 10",
    description: {
      shortDesc: "Complete CBSE Class 10 Mathematics with board exam preparation",
      longDesc: "Comprehensive Mathematics course for CBSE Class 10 students covering all chapters with detailed explanations, practice problems, and board exam strategies."
    },
    courseType: "OTA",
    startDate: "2024-04-01T00:00:00.000Z",
    endDate: "2025-03-31T00:00:00.000Z",
    seatLimit: 60,
    classDuration: 1.5,
    fees: 15000,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    subject: "Mathematics",
    classesPerWeek: 4,
    totalWeeks: 40,
    totalHours: 120,
    validity: "1 Year",
    educator: {
      _id: "educator3",
      name: "Prof. Anjali Singh",
      qualification: "M.Sc. in Mathematics",
      experience: "8 years teaching experience",
      profileImage: "/images/educators/prof-anjali-singh.jpg",
      specializations: ["CBSE", "Mathematics"]
    }
  },
  {
    _id: "course5",
    specialization: "NEET",
    courseClass: "11",
    educatorId: "educator4",
    image: {
      public_id: "course5_img",
      url: "/images/courses/chemistry-course-1.jpg"
    },
    title: "Organic Chemistry Mastery for NEET",
    description: {
      shortDesc: "Master Organic Chemistry for NEET with mechanism-based learning",
      longDesc: "Specialized Organic Chemistry course for NEET preparation focusing on reaction mechanisms, name reactions, and problem-solving techniques with extensive practice."
    },
    courseType: "OTA",
    startDate: "2024-05-15T00:00:00.000Z",
    endDate: "2024-11-15T00:00:00.000Z",
    seatLimit: 35,
    classDuration: 2,
    fees: 18000,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    subject: "Chemistry",
    classesPerWeek: 5,
    totalWeeks: 24,
    totalHours: 120,
    validity: "15 Months",
    educator: {
      _id: "educator4",
      name: "Dr. Vikram Mehta",
      qualification: "Ph.D. in Organic Chemistry",
      experience: "15 years teaching experience",
      profileImage: "/images/educators/dr-vikram-mehta.jpg",
      specializations: ["NEET", "Chemistry"]
    }
  }
];

// Helper functions
export const getCoursesByEducatorId = (educatorId) => {
  return coursesData.filter(course => course.educatorId === educatorId);
};

export const getCourseById = (courseId) => {
  return coursesData.find(course => course._id === courseId);
};

export const getCoursesBySpecialization = (specialization) => {
  return coursesData.filter(course => course.specialization === specialization);
};

export const getCoursesByClass = (courseClass) => {
  return coursesData.filter(course => course.courseClass === courseClass);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
