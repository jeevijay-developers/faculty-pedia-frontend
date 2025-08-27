// Array of multiple educators for carousel
export const educatorsData = [
  {
    id: "edu_001",
    firstName: "john",
    lastName: "doe",
    name: "Dr. John Doe",
    email: "johndoe@example.com",
    password: "hashedPassword123", // In real app, this would be hashed
    mobileNumber: "+91-9876543210",
    profileImage: {
      public_id: "educator_placeholder",
      url: "/images/Banner/1.png",
    },
    bio: "Passionate physics educator with over 10 years of experience teaching IIT-JEE aspirants.",
    workExperience: [
      {
        title: "SENIOR PHYSICS TEACHER",
        company: "Resonance Institute",
        startDate: "2020-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "PHYSICS FACULTY",
        company: "Allen Career Institute",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "M.SC PHYSICS",
        institute: "Delhi University",
        startDate: "2016-01-01",
        endDate: "2018-01-01"
      },
      {
        title: "B.SC PHYSICS",
        institute: "Delhi University",
        startDate: "2013-01-01",
        endDate: "2016-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/johndoe_physics",
      facebook: "https://facebook.com/johndoe.physics",
      twitter: "https://twitter.com/johndoe_physics",
      linkedin: "https://linkedin.com/in/johndoe-physics",
      youtube: "https://youtube.com/johndoe_physics"
    },
    rating: 4.7,
    reviewCount: 120,
    status: "active",
    specialization: "IIT-JEE",
    specializedSubject: "Physics",
    courses: [
      {
        id: 3,
        title: "Physics for Engineering",
        duration: "20 weeks",
        startDate: "1 Sep 2025",
        price: "6999",
        originalPrice: "8999",
        image: "/images/placeholders/1.svg",
        subject: "Physics",
        specialization: "IIT-JEE",
      },
      {
        id: 13,
        title: "JEE Physics Problem Solving Workshop",
        duration: "15 weeks",
        startDate: "15 Sep 2025",
        price: "5999",
        originalPrice: "7499",
        image: "/images/placeholders/1.svg",
        subject: "Physics",
        specialization: "IIT-JEE",
      }
    ],
    webinars: [
      {
        id: 3,
        title: "Physics for JEE: Mechanics and Thermodynamics",
        price: "11,599",
        originalPrice: "14,599",
        image: "/images/placeholders/1.svg",
        subjects: ["Physics", "JEE"],
      }
    ],
    testSeries: [
      {
        id: "ts_001",
        title: "JEE Physics Test Series",
        price: 2999,
        numberOfTests: 25,
        subject: "Physics",
        specialization: "IIT-JEE"
      }
    ],
    followers: ["student_001", "student_002", "student_003"],
    yearsExperience: 10,
    class: "XI, XII, JEE",
    courseFees: 18000,
    totalHours: 120,
    validity: "12 months"
  },
  {
    id: "edu_002",
    firstName: "priya",
    lastName: "sharma",
    name: "Dr. Priya Sharma",
    email: "priyasharma@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543211",
    profileImage: {
      public_id: "educator_placeholder_2",
      url: "/images/Banner/2.png",
    },
    bio: "Experienced chemistry teacher specializing in organic chemistry for competitive exams.",
    workExperience: [
      {
        title: "HEAD OF CHEMISTRY DEPARTMENT",
        company: "FIITJEE",
        startDate: "2019-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "CHEMISTRY LECTURER",
        company: "Narayana College",
        startDate: "2016-01-01",
        endDate: "2019-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "PH.D CHEMISTRY",
        institute: "IIT Delhi",
        startDate: "2014-01-01",
        endDate: "2018-01-01"
      },
      {
        title: "M.SC CHEMISTRY",
        institute: "Delhi University",
        startDate: "2012-01-01",
        endDate: "2014-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/priya_chemistry",
      facebook: "https://facebook.com/priya.sharma.chem",
      twitter: "https://twitter.com/priya_chem",
      linkedin: "https://linkedin.com/in/priya-sharma-chemistry",
      youtube: "https://youtube.com/priya_chemistry"
    },
    rating: 4.8,
    reviewCount: 95,
    status: "active",
    specialization: "IIT-JEE",
    specializedSubject: "Chemistry",
    courses: [
      {
        id: 6,
        title: "Advanced Organic Chemistry for JEE",
        duration: "22 weeks",
        startDate: "5 Sep 2025",
        price: "8499",
        originalPrice: "10999",
        image: "/images/placeholders/1.svg",
        subject: "Chemistry",
        specialization: "IIT-JEE",
      }
    ],
    webinars: [
      {
        id: 2,
        title: "Complete Organic Chemistry for NEET",
        price: "10,999",
        originalPrice: "13,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Chemistry", "NEET"],
      },
      {
        id: 5,
        title: "Advanced Problem Solving in Physical Chemistry",
        price: "13,599",
        originalPrice: "16,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Chemistry", "JEE Advanced"],
      }
    ],
    testSeries: [
      {
        id: "ts_002",
        title: "JEE Chemistry Complete Series",
        price: 3499,
        numberOfTests: 30,
        subject: "Chemistry",
        specialization: "IIT-JEE"
      }
    ],
    followers: ["student_004", "student_005", "student_006"],
    yearsExperience: 12,
    class: "XI, XII, JEE",
    courseFees: 17500,
    totalHours: 110,
    validity: "12 months"
  },
  {
    id: "edu_003",
    firstName: "rajesh",
    lastName: "kumar",
    name: "Prof. Rajesh Kumar",
    email: "rajeshkumar@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543212",
    profileImage: {
      public_id: "educator_placeholder_3",
      url: "/images/Banner/3.png",
    },
    bio: "Mathematics expert with a passion for teaching advanced calculus and algebra.",
    workExperience: [
      {
        title: "MATHEMATICS FACULTY",
        company: "Aakash Institute",
        startDate: "2020-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "MATHEMATICS TEACHER",
        company: "Brilliant Tutorials",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "M.SC MATHEMATICS",
        institute: "IIT Bombay",
        startDate: "2016-01-01",
        endDate: "2018-01-01"
      },
      {
        title: "B.SC MATHEMATICS",
        institute: "Mumbai University",
        startDate: "2013-01-01",
        endDate: "2016-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/rajesh_maths",
      facebook: "https://facebook.com/rajesh.kumar.math",
      twitter: "https://twitter.com/rajesh_math",
      linkedin: "https://linkedin.com/in/rajesh-kumar-mathematics",
      youtube: "https://youtube.com/rajesh_mathematics"
    },
    rating: 4.6,
    reviewCount: 78,
    status: "active",
    specialization: "IIT-JEE",
    specializedSubject: "Mathematics",
    courses: [
      {
        id: 1,
        title: "JEE Maths Foundation Course",
        duration: "24 weeks",
        startDate: "8 Aug 2025",
        price: "7999",
        originalPrice: "9999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      },
      {
        id: 9,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }, 
      {
        id: 10,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }, 
      {
        id: 10,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }, 
      {
        id: 11,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }, 
      {
        id: 12,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }, 
      {
        id: 13,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }, 
    ],
    webinars: [
      {
        id: 1,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
      {
        id: 2,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
      {
        id: 3,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
      {
        id: 4,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
      {
        id: 5,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
      {
        id: 6,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
      {
        id: 7,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }, 
    ],
    testSeries: [
      {
        id: "ts_003",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
      {
        id: "ts_010",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
      {
        id: "ts_011",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
      {
        id: "ts_012",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
      {
        id: "ts_013",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
      {
        id: "ts_014",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
      {
        id: "ts_015",
        title: "JEE Mathematics Complete Test Series",
        price: 3999,
        numberOfTests: 35,
        subject: "Mathematics",
        specialization: "IIT-JEE"
      },
    ],
    followers: ["student_007", "student_008"],
    yearsExperience: 8,
    class: "XI, XII, Dropper",
  },
  {
    id: "edu_004",
    firstName: "anjali",
    lastName: "verma",
    name: "Dr. Anjali Verma",
    email: "anjaliverma@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543213",
    profileImage: {
      public_id: "educator_placeholder_4",
      url: "/images/Banner/4.png",
    },
    bio: "Biology teacher with expertise in human physiology and genetics for NEET preparation.",
    workExperience: [
      {
        title: "SENIOR BIOLOGY FACULTY",
        company: "Allen Career Institute",
        startDate: "2018-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "BIOLOGY LECTURER",
        company: "Career Point",
        startDate: "2015-01-01",
        endDate: "2018-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "PH.D BIOLOGY",
        institute: "AIIMS Delhi",
        startDate: "2013-01-01",
        endDate: "2017-01-01"
      },
      {
        title: "M.SC BOTANY",
        institute: "Delhi University",
        startDate: "2011-01-01",
        endDate: "2013-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/anjali_biology",
      facebook: "https://facebook.com/anjali.verma.bio",
      twitter: "https://twitter.com/anjali_bio",
      linkedin: "https://linkedin.com/in/anjali-verma-biology",
      youtube: "https://youtube.com/anjali_biology"
    },
    rating: 4.9,
    reviewCount: 150,
    status: "active",
    specialization: "NEET",
    specializedSubject: "Biology",
    courses: [
      {
        id: 2,
        title: "NEET Biology Masterclass",
        duration: "32 weeks",
        startDate: "15 Aug 2025",
        price: "8999",
        originalPrice: "11999",
        image: "/images/placeholders/1.svg",
        subject: "Biology",
        specialization: "NEET",
      },
      {
        id: 12,
        title: "NEET Botany and Zoology Complete",
        duration: "28 weeks",
        startDate: "3 Sep 2025",
        price: "8999",
        originalPrice: "11499",
        image: "/images/placeholders/1.svg",
        subject: "Biology",
        specialization: "NEET",
      }
    ],
    webinars: [
      {
        id: 4,
        title: "Biology Masterclass for Medical Entrances",
        price: "9,999",
        originalPrice: "12,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Biology", "NEET"],
      },
      {
        id: 2,
        title: "Cracking NEET 2026: Biology Revision Marathon",
        price: "6,499",
        originalPrice: "8,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Biology", "NEET"],
      }
    ],
    testSeries: [
      {
        id: "ts_004",
        title: "NEET Biology Complete Test Series",
        price: 2999,
        numberOfTests: 40,
        subject: "Biology",
        specialization: "NEET"
      }
    ],
    followers: ["student_009", "student_010", "student_011", "student_012"],
    yearsExperience: 15,
    class: "XI, XII, NEET",
    courseFees: 18500,
    totalHours: 130,
    validity: "12 months"
  },
  {
    id: "edu_005",
    firstName: "suresh",
    lastName: "nair",
    name: "Dr. Suresh Nair",
    email: "sureshnair@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543214",
    profileImage: {
      public_id: "educator_placeholder_5",
      url: "/images/Banner/1.png",
    },
    bio: "Physics educator specializing in mechanics and thermodynamics for NEET students.",
    workExperience: [
      {
        title: "PHYSICS FACULTY",
        company: "Resonance Institute",
        startDate: "2019-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "PHYSICS TEACHER",
        company: "Vidyamandir Classes",
        startDate: "2017-01-01",
        endDate: "2019-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "M.SC PHYSICS",
        institute: "Kerala University",
        startDate: "2015-01-01",
        endDate: "2017-01-01"
      },
      {
        title: "B.SC PHYSICS",
        institute: "Kerala University",
        startDate: "2012-01-01",
        endDate: "2015-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/suresh_physics",
      facebook: "https://facebook.com/suresh.nair.physics",
      twitter: "https://twitter.com/suresh_physics",
      linkedin: "https://linkedin.com/in/suresh-nair-physics",
      youtube: "https://youtube.com/suresh_physics"
    },
    rating: 4.5,
    reviewCount: 88,
    status: "active",
    specialization: "NEET",
    specializedSubject: "Physics",
    courses: [
      {
        id: 7,
        title: "NEET Physics Crash Course",
        duration: "18 weeks",
        startDate: "12 Sep 2025",
        price: "6999",
        originalPrice: "8499",
        image: "/images/placeholders/1.svg",
        subject: "Physics",
        specialization: "NEET",
      }
    ],
    webinars: [],
    testSeries: [
      {
        id: "ts_005",
        title: "NEET Physics Test Series",
        price: 2499,
        numberOfTests: 20,
        subject: "Physics",
        specialization: "NEET"
      }
    ],
    followers: ["student_013", "student_014"],
    yearsExperience: 9,
    class: "XI, XII, NEET",
    courseFees: 16000,
    totalHours: 90,
    validity: "12 months"
  },
  {
    id: "edu_006",
    firstName: "kavitha",
    lastName: "reddy",
    name: "Dr. Kavitha Reddy",
    email: "kavithareddy@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543215",
    profileImage: {
      public_id: "educator_placeholder_6",
      url: "/images/Banner/2.png",
    },
    bio: "Chemistry teacher with focus on inorganic and physical chemistry for NEET aspirants.",
    workExperience: [
      {
        title: "CHEMISTRY HEAD",
        company: "Narayana Group",
        startDate: "2018-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "CHEMISTRY LECTURER",
        company: "Sri Chaitanya",
        startDate: "2015-01-01",
        endDate: "2018-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "PH.D CHEMISTRY",
        institute: "University of Hyderabad",
        startDate: "2013-01-01",
        endDate: "2017-01-01"
      },
      {
        title: "M.SC CHEMISTRY",
        institute: "Osmania University",
        startDate: "2011-01-01",
        endDate: "2013-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/kavitha_chemistry",
      facebook: "https://facebook.com/kavitha.reddy.chem",
      twitter: "https://twitter.com/kavitha_chem",
      linkedin: "https://linkedin.com/in/kavitha-reddy-chemistry",
      youtube: "https://youtube.com/kavitha_chemistry"
    },
    rating: 4.7,
    reviewCount: 102,
    status: "active",
    specialization: "NEET",
    specializedSubject: "Chemistry",
    courses: [
      {
        id: 4,
        title: "Chemistry Complete Package",
        duration: "28 weeks",
        startDate: "20 Aug 2025",
        price: "7499",
        originalPrice: "9499",
        image: "/images/placeholders/1.svg",
        subject: "Chemistry",
        specialization: "NEET",
      },
      {
        id: 8,
        title: "NEET Chemistry Foundation",
        duration: "26 weeks",
        startDate: "18 Aug 2025",
        price: "7999",
        originalPrice: "9999",
        image: "/images/placeholders/1.svg",
        subject: "Chemistry",
        specialization: "NEET",
      }
    ],
    webinars: [
      {
        id: 4,
        title: "CBSE 12th Chemistry: Last-Minute Tips",
        price: "5,999",
        originalPrice: "7,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Chemistry", "CBSE"],
      }
    ],
    testSeries: [
      {
        id: "ts_006",
        title: "NEET Chemistry Complete Series",
        price: 2999,
        numberOfTests: 25,
        subject: "Chemistry",
        specialization: "NEET"
      }
    ],
    followers: ["student_015", "student_016", "student_017"],
    yearsExperience: 11,
    class: "XI, XII, NEET",
    courseFees: 16500,
    totalHours: 95,
    validity: "12 months"
  },
  {
    id: "edu_007",
    firstName: "amit",
    lastName: "singh",
    name: "Prof. Amit Singh",
    email: "amitsingh@example.com",
    mobileNumber: "+91-9876543216",
    profileImage: {
      public_id: "educator_placeholder_7",
      url: "/images/Banner/3.png",
    },
    bio: "Mathematics teacher specializing in CBSE curriculum for classes 9-12.",
    workExperience: [
      {
        title: "MATHEMATICS TEACHER",
        company: "Delhi Public School",
        startDate: "2020-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "MATHEMATICS TUTOR",
        company: "BYJU'S",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "M.SC MATHEMATICS",
        institute: "Jamia Millia Islamia",
        startDate: "2016-01-01",
        endDate: "2018-01-01"
      },
      {
        title: "B.ED",
        institute: "IGNOU",
        startDate: "2015-01-01",
        endDate: "2016-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/amit_mathematics",
      facebook: "https://facebook.com/amit.singh.math",
      twitter: "https://twitter.com/amit_math",
      linkedin: "https://linkedin.com/in/amit-singh-mathematics",
      youtube: "https://youtube.com/amit_mathematics"
    },
    rating: 4.4,
    reviewCount: 65,
    status: "active",
    specialization: "CBSE",
    specializedSubject: "Mathematics",
    password: "hashedPassword123",
    courses: [
      {
        id: 11,
        title: "CBSE Mathematics for Class 11-12",
        duration: "20 weeks",
        startDate: "28 Aug 2025",
        price: "4499",
        originalPrice: "5999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "CBSE",
      }
    ],
    webinars: [],
    testSeries: [
      {
        id: "ts_007",
        title: "CBSE Mathematics Test Series",
        price: 1999,
        numberOfTests: 15,
        subject: "Mathematics",
        specialization: "CBSE"
      }
    ],
    followers: ["student_018", "student_019"],
    yearsExperience: 7,
    class: "IX, X, XI, XII",
    courseFees: 14000,
    totalHours: 80,
    validity: "10 months"
  },
  {
    id: "edu_008",
    firstName: "meera",
    lastName: "joshi",
    name: "Dr. Meera Joshi",
    email: "meerajoshi@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543217",
    profileImage: {
      public_id: "educator_placeholder_8",
      url: "/images/Banner/4.png",
    },
    bio: "Science teacher with expertise in CBSE physics and chemistry for board exams.",
    workExperience: [
      {
        title: "SCIENCE TEACHER",
        company: "Kendriya Vidyalaya",
        startDate: "2021-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "PHYSICS TUTOR",
        company: "Vedantu",
        startDate: "2019-01-01",
        endDate: "2021-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "M.SC PHYSICS",
        institute: "Pune University",
        startDate: "2017-01-01",
        endDate: "2019-01-01"
      },
      {
        title: "B.SC CHEMISTRY",
        institute: "Pune University",
        startDate: "2014-01-01",
        endDate: "2017-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/meera_science",
      facebook: "https://facebook.com/meera.joshi.science",
      twitter: "https://twitter.com/meera_science",
      linkedin: "https://linkedin.com/in/meera-joshi-science",
      youtube: "https://youtube.com/meera_science"
    },
    rating: 4.3,
    reviewCount: 45,
    status: "active",
    specialization: "CBSE",
    specializedSubject: "Physics",
    courses: [
      {
        id: 11,
        title: "CBSE Science for Class 10",
        duration: "20 weeks",
        startDate: "28 Aug 2025",
        price: "4499",
        originalPrice: "5999",
        image: "/images/placeholders/1.svg",
        subject: "Science",
        specialization: "CBSE",
      }
    ],
    webinars: [],
    testSeries: [
      {
        id: "ts_008",
        title: "CBSE Science Test Series",
        price: 1999,
        numberOfTests: 12,
        subject: "Science",
        specialization: "CBSE"
      }
    ],
    followers: ["student_020", "student_021"],
    yearsExperience: 6,
    class: "IX, X, XI, XII",
    courseFees: 13500,
    totalHours: 75,
    validity: "10 months"
  },
  {
    id: "edu_009",
    firstName: "vikram",
    lastName: "malhotra",
    name: "Prof. Vikram Malhotra",
    email: "vikrammalhotra@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543218",
    profileImage: {
      public_id: "educator_placeholder_9",
      url: "/images/Banner/1.png",
    },
    bio: "English and Social Studies teacher for CBSE students with focus on board exam preparation.",
    workExperience: [
      {
        title: "ENGLISH TEACHER",
        company: "Ryan International School",
        startDate: "2022-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "SOCIAL STUDIES TEACHER",
        company: "DAV Public School",
        startDate: "2020-01-01",
        endDate: "2022-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "M.A ENGLISH",
        institute: "University of Delhi",
        startDate: "2018-01-01",
        endDate: "2020-01-01"
      },
      {
        title: "B.ED",
        institute: "IGNOU",
        startDate: "2017-01-01",
        endDate: "2018-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/vikram_english",
      facebook: "https://facebook.com/vikram.malhotra.english",
      twitter: "https://twitter.com/vikram_english",
      linkedin: "https://linkedin.com/in/vikram-malhotra-english",
      youtube: "https://youtube.com/vikram_english"
    },
    rating: 4.2,
    reviewCount: 38,
    status: "active",
    specialization: "CBSE",
    specializedSubject: "English",
    password: "hashedPassword123",
    courses: [
      {
        id: 5,
        title: "English for Competitive Exams",
        duration: "16 weeks",
        startDate: "10 Sep 2025",
        price: "4999",
        originalPrice: "6999",
        image: "/images/placeholders/1.svg",
        subject: "English",
        specialization: "CBSE",
      }
    ],
    webinars: [
      {
        id: 5,
        title: "Effective Study Habits for Toppers",
        price: "4,499",
        originalPrice: "6,499",
        image: "/images/placeholders/1.svg",
        subjects: ["Study Skills", "Motivation"],
      }
    ],
    testSeries: [
      {
        id: "ts_009",
        title: "CBSE English Test Series",
        price: 1499,
        numberOfTests: 10,
        subject: "English",
        specialization: "CBSE"
      }
    ],
    followers: ["student_022"],
    yearsExperience: 5,
    class: "IX, X, XI, XII",
    courseFees: 13000,
    totalHours: 70,
    validity: "10 months"
  },
  {
    id: "edu_010",
    firstName: "neeraj",
    lastName: "agarwal",
    name: "Dr. Neeraj Agarwal",
    email: "neerajagarwal@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543219",
    profileImage: {
      public_id: "educator_placeholder_10",
      url: "/images/Banner/2.png",
    },
    bio: "Advanced mathematics and physics teacher for JEE Main and Advanced preparation.",
    workExperience: [
      {
        title: "SENIOR FACULTY",
        company: "FIITJEE",
        startDate: "2017-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "PHYSICS LECTURER",
        company: "Motion IIT-JEE",
        startDate: "2014-01-01",
        endDate: "2017-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "PH.D MATHEMATICS",
        institute: "IIT Kanpur",
        startDate: "2012-01-01",
        endDate: "2016-01-01"
      },
      {
        title: "M.SC PHYSICS",
        institute: "IIT Delhi",
        startDate: "2010-01-01",
        endDate: "2012-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/neeraj_mathphysics",
      facebook: "https://facebook.com/neeraj.agarwal.jee",
      twitter: "https://twitter.com/neeraj_jee",
      linkedin: "https://linkedin.com/in/neeraj-agarwal-jee",
      youtube: "https://youtube.com/neeraj_mathphysics"
    },
    rating: 4.8,
    reviewCount: 125,
    status: "active",
    specialization: "IIT-JEE",
    specializedSubject: "Mathematics",
    password: "hashedPassword123",
    courses: [
      {
        id: 9,
        title: "JEE Advanced Mathematics Masterclass",
        duration: "25 weeks",
        startDate: "22 Aug 2025",
        price: "9999",
        originalPrice: "12999",
        image: "/images/placeholders/1.svg",
        subject: "Mathematics",
        specialization: "IIT-JEE",
      }
    ],
    webinars: [
      {
        id: 1,
        title: "Mastering Complex Integration for JEE Advanced",
        price: "12,999",
        originalPrice: "15,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Mathematics", "JEE Advanced"],
      }
    ],
    testSeries: [
      {
        id: "ts_010",
        title: "JEE Advanced Mathematics & Physics Series",
        price: 4999,
        numberOfTests: 50,
        subject: "Mathematics & Physics",
        specialization: "IIT-JEE"
      }
    ],
    followers: ["student_023", "student_024", "student_025", "student_026", "student_027"],
    yearsExperience: 14,
    class: "XI, XII, JEE",
    courseFees: 20000,
    totalHours: 140,
    validity: "12 months"
  },
  {
    id: "edu_011",
    firstName: "deepika",
    lastName: "paul",
    name: "Dr. Deepika Paul",
    email: "deepikapaul@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543220",
    profileImage: {
      public_id: "educator_placeholder_11",
      url: "/images/Banner/3.png",
    },
    bio: "Zoology and Botany expert with extensive experience in NEET preparation.",
    workExperience: [
      {
        title: "BIOLOGY DEPARTMENT HEAD",
        company: "Allen Career Institute",
        startDate: "2016-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "BIOLOGY LECTURER",
        company: "Akash Institute",
        startDate: "2013-01-01",
        endDate: "2016-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "PH.D ZOOLOGY",
        institute: "University of Calcutta",
        startDate: "2011-01-01",
        endDate: "2015-01-01"
      },
      {
        title: "M.SC BOTANY",
        institute: "University of Calcutta",
        startDate: "2009-01-01",
        endDate: "2011-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/deepika_biology",
      facebook: "https://facebook.com/deepika.paul.bio",
      twitter: "https://twitter.com/deepika_bio",
      linkedin: "https://linkedin.com/in/deepika-paul-biology",
      youtube: "https://youtube.com/deepika_biology"
    },
    rating: 4.6,
    reviewCount: 89,
    status: "active",
    specialization: "NEET",
    specializedSubject: "Biology",
    password: "hashedPassword123",
    courses: [
      {
        id: 12,
        title: "NEET Botany and Zoology Complete",
        duration: "28 weeks",
        startDate: "3 Sep 2025",
        price: "8999",
        originalPrice: "11499",
        image: "/images/placeholders/1.svg",
        subject: "Biology",
        specialization: "NEET",
      }
    ],
    webinars: [
      {
        id: 4,
        title: "Biology Masterclass for Medical Entrances",
        price: "9,999",
        originalPrice: "12,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Biology", "NEET"],
      }
    ],
    testSeries: [
      {
        id: "ts_011",
        title: "NEET Biology Advanced Test Series",
        price: 3499,
        numberOfTests: 45,
        subject: "Biology",
        specialization: "NEET"
      }
    ],
    followers: ["student_028", "student_029", "student_030"],
    yearsExperience: 13,
    class: "XI, XII, NEET",
    courseFees: 17500,
    totalHours: 110,
    validity: "12 months"
  },
  {
    id: "edu_012",
    firstName: "rohit",
    lastName: "sharma",
    name: "Dr. Rohit Sharma",
    email: "rohitsharma@example.com",
    password: "hashedPassword123",
    mobileNumber: "+91-9876543221",
    profileImage: {
      public_id: "educator_placeholder_12",
      url: "/images/Banner/4.png",
    },
    bio: "Physical chemistry specialist focusing on NEET chemistry preparation.",
    workExperience: [
      {
        title: "CHEMISTRY FACULTY",
        company: "Resonance Institute",
        startDate: "2019-01-01",
        endDate: "2024-01-01"
      },
      {
        title: "CHEMISTRY TEACHER",
        company: "Career Point",
        startDate: "2016-01-01",
        endDate: "2019-01-01"
      }
    ],
    introVideoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    qualification: [
      {
        title: "PH.D CHEMISTRY",
        institute: "IIT Roorkee",
        startDate: "2014-01-01",
        endDate: "2018-01-01"
      },
      {
        title: "M.SC PHYSICAL CHEMISTRY",
        institute: "University of Delhi",
        startDate: "2012-01-01",
        endDate: "2014-01-01"
      }
    ],
    socials: {
      instagram: "https://instagram.com/rohit_chemistry",
      facebook: "https://facebook.com/rohit.sharma.chem",
      twitter: "https://twitter.com/rohit_chem",
      linkedin: "https://linkedin.com/in/rohit-sharma-chemistry",
      youtube: "https://youtube.com/rohit_chemistry"
    },
    rating: 4.4,
    reviewCount: 76,
    status: "active",
    specialization: "NEET",
    specializedSubject: "Chemistry",
    password: "hashedPassword123",
    courses: [
      {
        id: 8,
        title: "NEET Chemistry Foundation",
        duration: "26 weeks",
        startDate: "18 Aug 2025",
        price: "7999",
        originalPrice: "9999",
        image: "/images/placeholders/1.svg",
        subject: "Chemistry",
        specialization: "NEET",
      }
    ],
    webinars: [
      {
        id: 5,
        title: "Advanced Problem Solving in Physical Chemistry",
        price: "13,599",
        originalPrice: "16,999",
        image: "/images/placeholders/1.svg",
        subjects: ["Chemistry", "JEE Advanced"],
      }
    ],
    testSeries: [
      {
        id: "ts_012",
        title: "NEET Physical Chemistry Test Series",
        price: 2999,
        numberOfTests: 30,
        subject: "Chemistry",
        specialization: "NEET"
      }
    ],
    followers: ["student_031", "student_032"],
    yearsExperience: 10,
    class: "XI, XII, NEET",
    courseFees: 16000,
    totalHours: 90,
    validity: "12 months"
  }
];

// Function to filter educators by specialization
export const getEducatorsBySpecialization = (specialization) => {
  if (specialization === 'All') {
    return educatorsData;
  }
  return educatorsData.filter(educator => educator.specialization === specialization);
};

export const getEducatorBySubject = (specializedSubject) => {
  if(specializedSubject === 'All') {
    return educatorsData;
  }
  return educatorsData.filter(educator => educator.specializedSubject === specializedSubject);
}

// Function to get educator by ID
export const getEducatorById = (id) => {
  return educatorsData.find(educator => educator.id === id);
};
