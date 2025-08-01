export const educatorData = [
  {
    id: 1,
    name: "Meera Sharma",
    rating: 4.5,
    reviewCount: 124,
    image: "/images/placeholders/1.svg",
    videoUrl: "/videos/intro-meera.mp4",
    bio: "A passionate Computer Science educator with 7+ years of experience in teaching programming, data structures, and software development. Known for making complex concepts simple and engaging through real-world examples and interactive sessions.",
    specialization: [
      "Core Java & Advanced Java",
      "Data Structures & Algorithms",
      "Web Development (HTML, CSS, JS, React)",
      "Database Management Systems (MySQL, MongoDB)",
      "Software Engineering & SDLC"
    ],
    qualifications: [
      { degree: "B.Sc. in Computer Science", university: "University of Delhi", period: "2012 - 2015" },
      { degree: "M.Sc. in Computer Science", university: "University of Delhi", period: "2015 - 2017" },
      { degree: "Ph.D. in Computer Science", university: "IIT Delhi", period: "2017 - 2021" }
    ],
    workExperience: [
      { position: "Senior Lecturer", institution: "ABC Institute of Technology, Delhi", period: "Aug 2020 - Present" },
      { position: "Assistant Professor", institution: "XYZ University, Delhi", period: "Jan 2018 - July 2020" },
      { position: "Teaching Assistant", institution: "IIT Delhi", period: "Aug 2017 - Dec 2017" }
    ],
    courses: [
      { 
        id: 101, 
        title: "JEE Advanced Master Batch - Physics & Maths (2025)", 
        description: "A focused 6-month course designed for JEE 2025 aspirants to master complex Physics and Mathematics concepts with clear explanations and interactive problem-solving sessions.",
        price: "28,999", 
        originalPrice: "32,999",
        tags: ["Advanced", "Physics", "Mathematics"],
        enrollLink: "/courses/jee-advanced-physics-maths"
      },
      { 
        id: 102, 
        title: "Data Structures & Algorithms Masterclass", 
        description: "Comprehensive course covering essential data structures and algorithms concepts with practical implementations and problem-solving techniques for competitive programming.",
        price: "24,999", 
        originalPrice: "29,999",
        tags: ["Programming", "DSA", "Computer Science"],
        enrollLink: "/courses/dsa-masterclass"
      },
      { 
        id: 103, 
        title: "Full Stack Web Development Bootcamp", 
        description: "Learn end-to-end web development with modern technologies including React, Node.js, and MongoDB to build responsive and dynamic web applications.",
        price: "32,999", 
        originalPrice: "36,999",
        tags: ["Web Dev", "React", "Node.js"],
        enrollLink: "/courses/fullstack-bootcamp"
      },
    ]
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    rating: 4.8,
    reviewCount: 156,
    image: "/images/placeholders/1.svg",
    videoUrl: "/videos/intro-rajesh.mp4",
    bio: "An expert in Physics with over 12 years of teaching experience at prestigious institutions. Specialized in making complex physics concepts understandable through visualization and practical applications.",
    specialization: [
      "Classical Mechanics",
      "Electromagnetism",
      "Thermodynamics",
      "Modern Physics",
      "IIT-JEE Physics"
    ],
    qualifications: [
      { degree: "B.Tech in Engineering Physics", university: "IIT Bombay", period: "2005 - 2009" },
      { degree: "M.Tech in Applied Physics", university: "IIT Bombay", period: "2009 - 2011" },
      { degree: "Ph.D in Physics", university: "University of Cambridge", period: "2011 - 2015" }
    ],
    workExperience: [
      { position: "Professor", institution: "National Institute of Technology, Delhi", period: "Jan 2019 - Present" },
      { position: "Associate Professor", institution: "Delhi University", period: "Mar 2015 - Dec 2018" },
      { position: "Research Fellow", institution: "University of Cambridge", period: "Jan 2011 - Feb 2015" }
    ],
    courses: [
      { 
        id: 201, 
        title: "Advanced Physics for JEE", 
        description: "Comprehensive physics course covering mechanics, electromagnetism, optics, and modern physics designed specifically for JEE Advanced preparation.",
        price: "26,999", 
        originalPrice: "30,999",
        tags: ["JEE Advanced", "Physics", "Competitive Exam"],
        enrollLink: "/courses/advanced-physics-jee"
      },
      { 
        id: 202, 
        title: "Mastering NEET Physics", 
        description: "Complete physics course tailored for NEET aspirants, focusing on key concepts, problem-solving strategies, and exam techniques.",
        price: "22,999", 
        originalPrice: "25,999",
        tags: ["NEET", "Physics", "Medical"],
        enrollLink: "/courses/neet-physics"
      },
      { 
        id: 203, 
        title: "Physics Olympiad Preparation", 
        description: "Intensive training program for students aiming to excel in Physics Olympiads with advanced problem-solving techniques and theoretical concepts.",
        price: "34,999", 
        originalPrice: "39,999",
        tags: ["Olympiad", "Advanced", "Physics"],
        enrollLink: "/courses/physics-olympiad"
      },
    ]
  }
];

export const getEducatorById = (id) => {
  const numericId = parseInt(id, 10);
  return educatorData.find(educator => educator.id === numericId) || null;
};
