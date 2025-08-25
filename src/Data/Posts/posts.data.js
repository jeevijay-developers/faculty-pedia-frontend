// Example post data for NEET and JEE
export const postsData = [
  {
    id: 1,
    title: "Top 10 Tips for JEE Chemistry",
    description: "Master JEE Chemistry with these essential tips. Focus on concepts, practice regularly, and avoid common mistakes for a top score.",
    facultyInfo: {
      name: "Dr. Rakesh Sharma",
      profilePic: "/images/Banner/1.png"
    },
    category: "IIT-JEE",
    slug: "top-10-tips-for-jee-chemistry",
    publishDate: "2025-08-01"
  },
  {
    id: 2,
    title: "How to Ace NEET Biology",
    description: "Learn the best strategies to excel in NEET Biology. Time management, revision, and smart study plans are key.",
    facultyInfo: {
      name: "Dr. Priya Verma",
      profilePic: "/images/Banner/2.png"
    },
    category: "NEET",
    slug: "how-to-ace-neet-biology",
    publishDate: "2025-08-02"
  },
  {
    id: 3,
    title: "Physics Problem Solving Hacks",
    description: "Boost your Physics scores with these problem-solving hacks. Understand the basics and apply shortcuts for quick solutions.",
    facultyInfo: {
      name: "Prof. Amit Singh",
      profilePic: "/images/Banner/3.png"
    },
    category: "IIT-JEE",
    slug: "physics-problem-solving-hacks",
    publishDate: "2025-08-03"
  },
  {
    id: 4,
    title: "Organic Chemistry: Must-Know Reactions",
    description: "A quick guide to the most important organic reactions for JEE. Memorize mechanisms and practice applications.",
    facultyInfo: {
      name: "Dr. Meena Gupta",
      profilePic: "/images/Banner/4.png"
    },
    category: "IIT-JEE",
    slug: "organic-chemistry-must-know-reactions",
    publishDate: "2025-08-04"
  },
  {
    id: 5,
    title: "NEET Physics: Scoring Topics",
    description: "Focus on these high-yield topics in NEET Physics to maximize your score. Includes tips for quick revision.",
    facultyInfo: {
      name: "Dr. Suresh Kumar",
      profilePic: "/images/Banner/1.png"
    },
    category: "NEET",
    slug: "neet-physics-scoring-topics",
    publishDate: "2025-08-05"
  },
  {
    id: 6,
    title: "JEE Maths: Time Management",
    description: "Learn how to manage your time effectively during JEE Maths paper. Practice with mock tests and set timers.",
    facultyInfo: {
      name: "Prof. Anjali Rao",
      profilePic: "/images/Banner/2.png"
    },
    category: "IIT-JEE",
    slug: "jee-maths-time-management",
    publishDate: "2025-08-06"
  },
  {
    id: 7,
    title: "Biology Diagrams for NEET",
    description: "Master important diagrams for NEET Biology. Visual memory helps in quick recall during exams.",
    facultyInfo: {
      name: "Dr. Kavita Joshi",
      profilePic: "/images/Banner/3.png"
    },
    category: "NEET",
    slug: "biology-diagrams-for-neet",
    publishDate: "2025-08-07"
  },
  {
    id: 8,
    title: "JEE Physics: Error Analysis",
    description: "Understand error analysis and measurement techniques for JEE Physics. Practice with solved examples.",
    facultyInfo: {
      name: "Prof. Rajeev Nair",
      profilePic: "/images/Banner/4.png"
    },
    category: "IIT-JEE",
    slug: "jee-physics-error-analysis",
    publishDate: "2025-08-08"
  },
  {
    id: 9,
    title: "NEET Chemistry: Revision Plan",
    description: "Create an effective revision plan for NEET Chemistry. Cover all chapters and revise regularly.",
    facultyInfo: {
      name: "Dr. Sunita Agarwal",
      profilePic: "/images/Banner/1.png"
    },
    category: "NEET",
    slug: "neet-chemistry-revision-plan",
    publishDate: "2025-08-09"
  },
  {
    id: 10,
    title: "JEE Maths: Common Mistakes",
    description: "Avoid these common mistakes in JEE Maths. Double-check calculations and read questions carefully.",
    facultyInfo: {
      name: "Prof. Vikram Patel",
      profilePic: "/images/Banner/2.png"
    },
    category: "IIT-JEE",
    slug: "jee-maths-common-mistakes",
    publishDate: "2025-08-10"
  },
  {
    id: 11,
    title: "NEET Biology: Mnemonics",
    description: "Use mnemonics to remember complex Biology concepts for NEET. Make your own and share with friends.",
    facultyInfo: {
      name: "Dr. Neha Singh",
      profilePic: "/images/Banner/3.png"
    },
    category: "NEET",
    slug: "neet-biology-mnemonics",
    publishDate: "2025-08-11"
  },
  {
    id: 12,
    title: "JEE Chemistry: Quick Revision",
    description: "Quick revision tips for JEE Chemistry. Focus on formulas, reactions, and periodic table trends.",
    facultyInfo: {
      name: "Dr. Arvind Kumar",
      profilePic: "/images/Banner/4.png"
    },
    category: "IIT-JEE",
    slug: "jee-chemistry-quick-revision",
    publishDate: "2025-08-12"
  },
  {
    id: 13,
    title: "NEET Physics: Formula Sheet",
    description: "Prepare a formula sheet for NEET Physics. Revise daily and keep it handy for last-minute prep.",
    facultyInfo: {
      name: "Dr. Shalini Mishra",
      profilePic: "/images/Banner/1.png"
    },
    category: "NEET",
    slug: "neet-physics-formula-sheet",
    publishDate: "2025-08-13"
  },
  {
    id: 14,
    title: "JEE Maths: Practice Sets",
    description: "Solve practice sets for JEE Maths. Focus on weak areas and improve speed and accuracy.",
    facultyInfo: {
      name: "Prof. Manoj Desai",
      profilePic: "/images/Banner/2.png"
    },
    category: "IIT-JEE",
    slug: "jee-maths-practice-sets",
    publishDate: "2025-08-14"
  },
  {
    id: 15,
    title: "NEET Chemistry: Important Chapters",
    description: "List of important chapters for NEET Chemistry. Prioritize these for better results.",
    facultyInfo: {
      name: "Dr. Pooja Mehra",
      profilePic: "/images/Banner/3.png"
    },
    category: "NEET",
    slug: "neet-chemistry-important-chapters",
    publishDate: "2025-08-15"
  }
];

export const getPostsByCategory = (category) => {
  return postsData.filter(post => post.category === category);
};
