import { educatorsData } from '../Educator/educator-profile.data.js';

export const defaultCourses = [
  {
    id: 1,
    title: "JEE Maths Foundation Course",
    instructor: "Meera Sharma",
    educatorId: "edu_003", // Rajesh Kumar - Mathematics IIT-JEE
    specialization: "IIT-JEE",
    courseClass: "11",
    purchases: [],
    image: {
      public_id: "course_1_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Complete foundation course for JEE Mathematics covering all essential topics.",
      longDesc: "Comprehensive JEE Maths Foundation Course designed for Class 11 and 12 students. This course covers algebra, calculus, coordinate geometry, trigonometry, and statistics with detailed explanations and problem-solving techniques. Perfect preparation for JEE Main and Advanced examinations."
    },
    courseType: "OTA", // One to All
    startDate: "2025-08-08",
    endDate: "2026-02-07", // 24 weeks later
    seatLimit: 50,
    classDuration: 2, // hours
    fees: 7999,
    videos: {
      intro: "https://youtu.be/2buJqPi8L4o?si=aFw0nJ2rLUA2i6lS",
      descriptionVideo: "https://youtu.be/nhfblNTpP3U?si=_fBmWbLI17P4Phue"
    },
    classes: [
      {
        id: "class_1_1",
        title: "Introduction to Algebra",
        description: "Basic algebraic concepts and operations",
        subject: "Mathematics",
        topic: "Algebra Fundamentals",
        time: "10:00 AM - 12:00 PM",
        date: "2025-08-08",
        duration: 120,
        liveClassLink: "https://meet.google.com/abc-defg-hij",
        assetsLinks: [
          { name: "PPT", link: "/assets/algebra-intro.ppt" },
          { name: "PDF", link: "/assets/algebra-notes.pdf" }
        ]
      },
      {
        id: "class_1_2",
        title: "Quadratic Equations",
        description: "Solving quadratic equations using various methods",
        subject: "Mathematics",
        topic: "Quadratic Equations",
        time: "10:00 AM - 12:00 PM",
        date: "2025-08-15",
        duration: 120,
        liveClassLink: "https://meet.google.com/abc-defg-hij",
        assetsLinks: [
          { name: "PPT", link: "/assets/quadratic-equations.ppt" },
          { name: "PDF", link: "/assets/quadratic-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_1_1",
        title: "Algebra Basic Test",
        description: {
          short: "Test your algebra fundamentals",
          long: "Comprehensive test covering basic algebraic operations, equations, and problem-solving"
        },
        subject: "Mathematics",
        startDate: "2025-08-22",
        duration: 90,
        overallMarks: { positive: 100, negative: 25 },
        markingType: "PQM"
      }
    ],
    duration: "24 weeks",
    price: "7999",
    originalPrice: "9999",
    subject: "Mathematics"
  },
  {
    id: 2,
    title: "NEET Biology Masterclass",
    instructor: "Dr. Rajesh Kumar",
    educatorId: "edu_004", // Anjali Verma - Biology NEET
    specialization: "NEET",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_2_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Complete NEET Biology preparation covering botany and zoology.",
      longDesc: "Comprehensive NEET Biology Masterclass designed for medical entrance preparation. This course covers detailed botany and zoology concepts, human physiology, genetics, ecology, and biotechnology with extensive practice questions and mock tests."
    },
    courseType: "OTA",
    startDate: "2025-08-15",
    endDate: "2026-04-10", // 32 weeks later
    seatLimit: 75,
    classDuration: 2.5, // hours
    fees: 8999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_2_1",
        title: "Cell Structure and Function",
        description: "Detailed study of cell organelles and their functions",
        subject: "Biology",
        topic: "Cell Biology",
        time: "2:00 PM - 4:30 PM",
        date: "2025-08-15",
        duration: 150,
        liveClassLink: "https://meet.google.com/bio-cell-study",
        assetsLinks: [
          { name: "PPT", link: "/assets/cell-structure.ppt" },
          { name: "PDF", link: "/assets/cell-notes.pdf" },
          { name: "VIDEO", link: "/assets/cell-animation.mp4" }
        ]
      },
      {
        id: "class_2_2",
        title: "Human Physiology",
        description: "Circulatory and respiratory systems",
        subject: "Biology",
        topic: "Human Physiology",
        time: "2:00 PM - 4:30 PM",
        date: "2025-08-22",
        duration: 150,
        liveClassLink: "https://meet.google.com/bio-physiology",
        assetsLinks: [
          { name: "PPT", link: "/assets/physiology.ppt" },
          { name: "PDF", link: "/assets/physiology-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_2_1",
        title: "Cell Biology Test",
        description: {
          short: "Test on cell structure and functions",
          long: "Comprehensive test covering cell organelles, membrane transport, and cellular processes"
        },
        subject: "Biology",
        startDate: "2025-08-29",
        duration: 120,
        overallMarks: { positive: 150, negative: 37 },
        markingType: "PQM"
      }
    ],
    duration: "32 weeks",
    price: "8999",
    originalPrice: "11999",
    subject: "Biology"
  },
  {
    id: 3,
    title: "Physics for Engineering",
    instructor: "Prof. Anita Singh",
    educatorId: "edu_001", // John Doe - Physics IIT-JEE
    specialization: "IIT-JEE",
    courseClass: "11",
    purchases: [],
    image: {
      public_id: "course_3_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Physics course tailored for engineering entrance exams.",
      longDesc: "Comprehensive Physics course for engineering aspirants covering mechanics, thermodynamics, waves, optics, and modern physics. Designed specifically for JEE Main and Advanced with extensive problem-solving sessions and conceptual clarity."
    },
    courseType: "OTA",
    startDate: "2025-09-01",
    endDate: "2026-01-20", // 20 weeks later
    seatLimit: 60,
    classDuration: 2, // hours
    fees: 6999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_3_1",
        title: "Laws of Motion",
        description: "Newton's laws and their applications",
        subject: "Physics",
        topic: "Mechanics",
        time: "9:00 AM - 11:00 AM",
        date: "2025-09-01",
        duration: 120,
        liveClassLink: "https://meet.google.com/physics-mechanics",
        assetsLinks: [
          { name: "PPT", link: "/assets/laws-of-motion.ppt" },
          { name: "PDF", link: "/assets/mechanics-notes.pdf" }
        ]
      },
      {
        id: "class_3_2",
        title: "Work, Energy and Power",
        description: "Energy conservation and power calculations",
        subject: "Physics",
        topic: "Work-Energy",
        time: "9:00 AM - 11:00 AM",
        date: "2025-09-08",
        duration: 120,
        liveClassLink: "https://meet.google.com/physics-energy",
        assetsLinks: [
          { name: "PPT", link: "/assets/work-energy.ppt" },
          { name: "PDF", link: "/assets/energy-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_3_1",
        title: "Mechanics Test",
        description: {
          short: "Test on mechanics concepts",
          long: "Comprehensive test covering laws of motion, work-energy theorem, and momentum conservation"
        },
        subject: "Physics",
        startDate: "2025-09-15",
        duration: 105,
        overallMarks: { positive: 120, negative: 30 },
        markingType: "PQM"
      }
    ],
    duration: "20 weeks",
    price: "6999",
    originalPrice: "8999",
    subject: "Physics"
  },
  {
    id: 4,
    title: "Chemistry Complete Package",
    instructor: "Dr. Vikram Patel",
    educatorId: "edu_006", // Kavitha Reddy - Chemistry NEET
    specialization: "NEET",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_4_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Complete chemistry preparation for NEET examinations.",
      longDesc: "Comprehensive Chemistry Complete Package for NEET preparation covering physical chemistry, inorganic chemistry, and organic chemistry. Includes detailed theory, numerical problems, and extensive practice questions for medical entrance success."
    },
    courseType: "OTA",
    startDate: "2025-08-20",
    endDate: "2026-03-10", // 28 weeks later
    seatLimit: 80,
    classDuration: 2.5, // hours
    fees: 7499,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_4_1",
        title: "Atomic Structure",
        description: "Electronic configuration and periodic properties",
        subject: "Chemistry",
        topic: "Atomic Structure",
        time: "3:00 PM - 5:30 PM",
        date: "2025-08-20",
        duration: 150,
        liveClassLink: "https://meet.google.com/chem-atomic",
        assetsLinks: [
          { name: "PPT", link: "/assets/atomic-structure.ppt" },
          { name: "PDF", link: "/assets/atomic-notes.pdf" }
        ]
      },
      {
        id: "class_4_2",
        title: "Chemical Bonding",
        description: "Ionic, covalent and coordinate bonding",
        subject: "Chemistry",
        topic: "Chemical Bonding",
        time: "3:00 PM - 5:30 PM",
        date: "2025-08-27",
        duration: 150,
        liveClassLink: "https://meet.google.com/chem-bonding",
        assetsLinks: [
          { name: "PPT", link: "/assets/chemical-bonding.ppt" },
          { name: "PDF", link: "/assets/bonding-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_4_1",
        title: "Atomic Structure Test",
        description: {
          short: "Test on atomic structure and periodicity",
          long: "Comprehensive test covering atomic structure, electronic configuration, and periodic properties"
        },
        subject: "Chemistry",
        startDate: "2025-09-03",
        duration: 90,
        overallMarks: { positive: 100, negative: 25 },
        markingType: "PQM"
      }
    ],
    duration: "28 weeks",
    price: "7499",
    originalPrice: "9499",
    subject: "Chemistry"
  },
  {
    id: 5,
    title: "English for Competitive Exams",
    instructor: "Ms. Priya Mehta",
    educatorId: "edu_009", // Vikram Malhotra - English & Social Studies CBSE
    specialization: "CBSE",
    courseClass: "10",
    purchases: [],
    image: {
      public_id: "course_5_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Complete English preparation for all competitive exams with grammar and comprehension.",
      longDesc: "Comprehensive English course designed for competitive exam preparation. Covers grammar fundamentals, vocabulary building, reading comprehension, essay writing, and communication skills essential for various competitive examinations."
    },
    courseType: "OTA",
    startDate: "2025-09-10",
    endDate: "2026-01-02", // 16 weeks later
    seatLimit: 40,
    classDuration: 1.5, // hours
    fees: 4999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_5_1",
        title: "Grammar Fundamentals",
        description: "Basic grammar rules and sentence structure",
        subject: "English",
        topic: "Grammar",
        time: "11:00 AM - 12:30 PM",
        date: "2025-09-10",
        duration: 90,
        liveClassLink: "https://meet.google.com/english-grammar",
        assetsLinks: [
          { name: "PPT", link: "/assets/grammar-basics.ppt" },
          { name: "PDF", link: "/assets/grammar-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_5_1",
        title: "English Grammar Test",
        description: {
          short: "Test on basic grammar concepts",
          long: "Comprehensive test covering parts of speech, tenses, and sentence formation"
        },
        subject: "English",
        startDate: "2025-09-17",
        duration: 60,
        overallMarks: { positive: 80, negative: 20 },
        markingType: "PQM"
      }
    ],
    duration: "16 weeks",
    price: "4999",
    originalPrice: "6999",
    subject: "English"
  },
  {
    id: 6,
    title: "Advanced Organic Chemistry for JEE",
    instructor: "Dr. Priya Sharma",
    educatorId: "edu_002", // Priya Sharma - Chemistry IIT-JEE
    specialization: "IIT-JEE",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_6_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Master organic chemistry with advanced reaction mechanisms and problem-solving techniques for JEE Main and Advanced.",
      longDesc: "Advanced Organic Chemistry course specifically designed for JEE aspirants. Covers complex reaction mechanisms, stereochemistry, organometallic compounds, and advanced problem-solving strategies for both JEE Main and Advanced examinations."
    },
    courseType: "OTA",
    startDate: "2025-09-05",
    endDate: "2026-02-14", // 22 weeks later
    seatLimit: 45,
    classDuration: 2.5, // hours
    fees: 8499,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_6_1",
        title: "Reaction Mechanisms",
        description: "Understanding organic reaction mechanisms",
        subject: "Chemistry",
        topic: "Organic Chemistry",
        time: "4:00 PM - 6:30 PM",
        date: "2025-09-05",
        duration: 150,
        liveClassLink: "https://meet.google.com/organic-mechanisms",
        assetsLinks: [
          { name: "PPT", link: "/assets/reaction-mechanisms.ppt" },
          { name: "PDF", link: "/assets/organic-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_6_1",
        title: "Organic Chemistry Test",
        description: {
          short: "Test on organic reaction mechanisms",
          long: "Advanced test covering reaction mechanisms, stereochemistry, and organic synthesis"
        },
        subject: "Chemistry",
        startDate: "2025-09-12",
        duration: 120,
        overallMarks: { positive: 150, negative: 50 },
        markingType: "PQM"
      }
    ],
    duration: "22 weeks",
    price: "8499",
    originalPrice: "10999",
    subject: "Chemistry"
  },
  {
    id: 7,
    title: "NEET Physics Crash Course",
    instructor: "Dr. Suresh Nair",
    educatorId: "edu_005", // Suresh Nair - Physics NEET
    specialization: "NEET",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_7_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Intensive physics preparation for NEET with focus on mechanics, thermodynamics, and modern physics.",
      longDesc: "Comprehensive NEET Physics Crash Course designed for medical entrance preparation. Covers mechanics, heat and thermodynamics, waves and optics, electricity and magnetism, and modern physics with intensive problem-solving and conceptual clarity."
    },
    courseType: "OTA",
    startDate: "2025-09-12",
    endDate: "2026-01-24", // 18 weeks later
    seatLimit: 65,
    classDuration: 2, // hours
    fees: 6999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_7_1",
        title: "Kinematics and Dynamics",
        description: "Motion in one and two dimensions",
        subject: "Physics",
        topic: "Mechanics",
        time: "8:00 AM - 10:00 AM",
        date: "2025-09-12",
        duration: 120,
        liveClassLink: "https://meet.google.com/neet-physics",
        assetsLinks: [
          { name: "PPT", link: "/assets/kinematics.ppt" },
          { name: "PDF", link: "/assets/mechanics-neet.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_7_1",
        title: "NEET Physics Test",
        description: {
          short: "Test on physics fundamentals for NEET",
          long: "Comprehensive physics test covering mechanics, thermodynamics, and wave optics"
        },
        subject: "Physics",
        startDate: "2025-09-19",
        duration: 105,
        overallMarks: { positive: 120, negative: 30 },
        markingType: "PQM"
      }
    ],
    duration: "18 weeks",
    price: "6999",
    originalPrice: "8499",
    subject: "Physics"
  },
  {
    id: 8,
    title: "NEET Chemistry Foundation",
    instructor: "Dr. Rohit Sharma",
    educatorId: "edu_012", // Rohit Sharma - Chemistry NEET
    specialization: "NEET",
    courseClass: "11",
    purchases: [],
    image: {
      public_id: "course_8_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Comprehensive chemistry foundation for NEET covering physical, inorganic, and organic chemistry concepts.",
      longDesc: "Complete NEET Chemistry Foundation course covering all three branches of chemistry. Includes detailed study of physical chemistry concepts, inorganic chemistry reactions, and organic chemistry mechanisms with extensive practice for medical entrance examinations."
    },
    courseType: "OTA",
    startDate: "2025-08-18",
    endDate: "2026-02-28", // 26 weeks later
    seatLimit: 70,
    classDuration: 2.5, // hours
    fees: 7999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_8_1",
        title: "States of Matter",
        description: "Solid, liquid, and gaseous states",
        subject: "Chemistry",
        topic: "Physical Chemistry",
        time: "1:00 PM - 3:30 PM",
        date: "2025-08-18",
        duration: 150,
        liveClassLink: "https://meet.google.com/neet-chemistry",
        assetsLinks: [
          { name: "PPT", link: "/assets/states-matter.ppt" },
          { name: "PDF", link: "/assets/physical-chem-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_8_1",
        title: "Chemistry Foundation Test",
        description: {
          short: "Test on basic chemistry concepts",
          long: "Foundation test covering states of matter, atomic structure, and chemical bonding"
        },
        subject: "Chemistry",
        startDate: "2025-08-25",
        duration: 90,
        overallMarks: { positive: 100, negative: 25 },
        markingType: "PQM"
      }
    ],
    duration: "26 weeks",
    price: "7999",
    originalPrice: "9999",
    subject: "Chemistry"
  },
  {
    id: 9,
    title: "JEE Advanced Mathematics Masterclass",
    instructor: "Dr. Neeraj Agarwal",
    educatorId: "edu_010", // Neeraj Agarwal - Mathematics & Physics IIT-JEE
    specialization: "IIT-JEE",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_9_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Advanced mathematics for JEE with calculus, coordinate geometry, and complex problem-solving strategies.",
      longDesc: "JEE Advanced Mathematics Masterclass designed for serious JEE aspirants. Covers advanced calculus, coordinate geometry, vector algebra, complex numbers, and challenging problem-solving techniques specifically for JEE Advanced level questions."
    },
    courseType: "OTA",
    startDate: "2025-08-22",
    endDate: "2026-02-21", // 25 weeks later
    seatLimit: 35,
    classDuration: 3, // hours
    fees: 9999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_9_1",
        title: "Advanced Calculus",
        description: "Differential and integral calculus for JEE Advanced",
        subject: "Mathematics",
        topic: "Calculus",
        time: "6:00 PM - 9:00 PM",
        date: "2025-08-22",
        duration: 180,
        liveClassLink: "https://meet.google.com/jee-advanced-math",
        assetsLinks: [
          { name: "PPT", link: "/assets/advanced-calculus.ppt" },
          { name: "PDF", link: "/assets/calculus-advanced.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_9_1",
        title: "JEE Advanced Math Test",
        description: {
          short: "Advanced mathematics test for JEE",
          long: "Challenging test covering advanced calculus, coordinate geometry, and complex problem solving"
        },
        subject: "Mathematics",
        startDate: "2025-08-29",
        duration: 180,
        overallMarks: { positive: 200, negative: 67 },
        markingType: "PQM"
      }
    ],
    duration: "25 weeks",
    price: "9999",
    originalPrice: "12999",
    subject: "Mathematics"
  },
  {
    id: 11,
    title: "CBSE Science for Class 10",
    instructor: "Dr. Meera Joshi",
    educatorId: "edu_008", // Meera Joshi - Science CBSE
    specialization: "CBSE",
    courseClass: "10",
    purchases: [],
    image: {
      public_id: "course_11_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Complete Class 10 CBSE Science covering physics, chemistry, and biology for board exam success.",
      longDesc: "Comprehensive CBSE Science course for Class 10 students. Covers all physics, chemistry, and biology topics as per CBSE curriculum with practical demonstrations, experiments, and extensive practice for board examination excellence."
    },
    courseType: "OTA",
    startDate: "2025-08-28",
    endDate: "2026-01-15", // 20 weeks later
    seatLimit: 60,
    classDuration: 2, // hours
    fees: 4499,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_11_1",
        title: "Light - Reflection and Refraction",
        description: "Laws of reflection and refraction",
        subject: "Science",
        topic: "Physics",
        time: "4:00 PM - 6:00 PM",
        date: "2025-08-28",
        duration: 120,
        liveClassLink: "https://meet.google.com/cbse-science",
        assetsLinks: [
          { name: "PPT", link: "/assets/light-cbse.ppt" },
          { name: "PDF", link: "/assets/science-class10.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_11_1",
        title: "CBSE Science Test",
        description: {
          short: "Test on Class 10 science concepts",
          long: "Comprehensive test covering physics, chemistry, and biology topics for CBSE Class 10"
        },
        subject: "Science",
        startDate: "2025-09-04",
        duration: 90,
        overallMarks: { positive: 80, negative: 0 },
        markingType: "PQM"
      }
    ],
    duration: "20 weeks",
    price: "4499",
    originalPrice: "5999",
    subject: "Science"
  },
  {
    id: 12,
    title: "NEET Botany and Zoology Complete",
    instructor: "Dr. Deepika Paul",
    educatorId: "edu_011", // Deepika Paul - Biology NEET
    specialization: "NEET",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_12_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Comprehensive botany and zoology course for NEET with detailed diagrams and extensive practice questions.",
      longDesc: "Complete NEET Botany and Zoology course covering plant kingdom, animal kingdom, structural organization, biomolecules, and detailed study of plant and animal physiology with extensive diagrams and practice questions for medical entrance success."
    },
    courseType: "OTA",
    startDate: "2025-09-03",
    endDate: "2026-03-31", // 28 weeks later
    seatLimit: 80,
    classDuration: 2.5, // hours
    fees: 8999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_12_1",
        title: "Plant Kingdom Classification",
        description: "Detailed classification of plant kingdom",
        subject: "Biology",
        topic: "Botany",
        time: "10:00 AM - 12:30 PM",
        date: "2025-09-03",
        duration: 150,
        liveClassLink: "https://meet.google.com/neet-botany",
        assetsLinks: [
          { name: "PPT", link: "/assets/plant-kingdom.ppt" },
          { name: "PDF", link: "/assets/botany-notes.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_12_1",
        title: "Botany and Zoology Test",
        description: {
          short: "Test on plant and animal kingdom",
          long: "Comprehensive test covering plant classification, animal classification, and morphology"
        },
        subject: "Biology",
        startDate: "2025-09-10",
        duration: 120,
        overallMarks: { positive: 150, negative: 37 },
        markingType: "PQM"
      }
    ],
    duration: "28 weeks",
    price: "8999",
    originalPrice: "11499",
    subject: "Biology"
  },
  {
    id: 13,
    title: "JEE Physics Problem Solving Workshop",
    instructor: "Dr. John Doe",
    educatorId: "edu_001", // John Doe - Physics IIT-JEE
    specialization: "IIT-JEE",
    courseClass: "12",
    purchases: [],
    image: {
      public_id: "course_13_image",
      url: "/images/placeholders/1.svg"
    },
    description: {
      shortDesc: "Intensive problem-solving workshop for JEE physics with challenging numerical and conceptual questions.",
      longDesc: "Intensive JEE Physics Problem Solving Workshop designed for advanced JEE preparation. Focuses on challenging numerical problems, conceptual questions, and advanced problem-solving techniques for both JEE Main and Advanced examinations."
    },
    courseType: "OTA",
    startDate: "2025-09-15",
    endDate: "2025-12-28", // 15 weeks later
    seatLimit: 30,
    classDuration: 2, // hours
    fees: 5999,
    videos: {
      intro: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      descriptionVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    classes: [
      {
        id: "class_13_1",
        title: "Advanced Problem Solving - Mechanics",
        description: "Challenging mechanics problems for JEE",
        subject: "Physics",
        topic: "Advanced Mechanics",
        time: "7:00 PM - 9:00 PM",
        date: "2025-09-15",
        duration: 120,
        liveClassLink: "https://meet.google.com/jee-physics-workshop",
        assetsLinks: [
          { name: "PPT", link: "/assets/advanced-mechanics.ppt" },
          { name: "PDF", link: "/assets/physics-problems.pdf" }
        ]
      }
    ],
    tests: [
      {
        id: "test_13_1",
        title: "Physics Problem Solving Test",
        description: {
          short: "Advanced physics problem test",
          long: "Challenging test with advanced numerical and conceptual physics problems for JEE"
        },
        subject: "Physics",
        startDate: "2025-09-22",
        duration: 120,
        overallMarks: { positive: 120, negative: 40 },
        markingType: "PQM"
      }
    ],
    duration: "15 weeks",
    price: "5999",
    originalPrice: "7499",
    subject: "Physics"
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
