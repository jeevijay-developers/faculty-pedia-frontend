const liveTestSeriesExample = {
  title: "full stack developer mock series",
  description: {
    short: "A quick practice set for full-stack interviews.",
    long: "This test series covers full-stack development topics, including HTML, CSS, JavaScript, Node.js, Express, MongoDB, React, and deployment practices. Perfect for job interview preparation.",
  },
  price: 499,
  noOfTests: 5,
  startDate: new Date("2025-08-20"),
  endDate: new Date("2025-09-20"),
  image: {
    public_id: "testseries123",
    url: "/images/placeholders/1.svg",
  },
  teacherId: "64f2a8f3a27c4a9ab0f27b91",
  enrolledStudents: [
    { studentId: "64f2a8f3a27c4a9ab0f27b91" },
    { studentId: "64f2a8f3a27c4a9ab0f27b91" },
  ],
  liveTests: [
    {
      title: "html fundamentals test",
      description: {
        short: "Covers HTML basics.",
        long: "This live test includes questions on HTML structure, forms, media tags, and best practices.",
      },
      image: {
        public_id: "htmltest001",
        url: "https://example.com/images/html-test.jpg",
      },
      subject: "html",
      startDate: new Date("2025-08-21T10:00:00Z"),
      duration: 60,
      overallMarks: {
        positive: 4,
        negative: -1,
      },
      markingType: "PQM",
      questions: ["64f2a8f3a27c4a9ab0f27b91", "64f2a8f3a27c4a9ab0f27b91"],
      testSeriesId: "64f2a8f3a27c4a9ab0f27b91",
      educatorId: "64f2a8f3a27c4a9ab0f27b91",
    },
    {
      title: "css styling test",
      description: {
        short: "Focuses on CSS basics and layouts.",
        long: "Covers CSS selectors, positioning, flexbox, grid, and responsive design.",
      },
      image: {
        public_id: "csstest001",
        url: "https://example.com/images/css-test.jpg",
      },
      subject: "css",
      startDate: new Date("2025-08-22T10:00:00Z"),
      duration: 60,
      overallMarks: {
        positive: 4,
        negative: -1,
      },
      markingType: "PQM",
      questions: [],
      testSeriesId: "64f2a8f3a27c4a9ab0f27b91",
      educatorId: "64f2a8f3a27c4a9ab0f27b91",
    },
    {
      title: "javascript basics test",
      description: {
        short: "Tests JavaScript fundamentals.",
        long: "Includes variables, data types, functions, scope, DOM manipulation, and ES6 features.",
      },
      image: {
        public_id: "jstest001",
        url: "https://example.com/images/js-test.jpg",
      },
      subject: "javascript",
      startDate: new Date("2025-08-23T10:00:00Z"),
      duration: 90,
      overallMarks: {
        positive: 4,
        negative: -1,
      },
      markingType: "PQM",
      questions: [],
      testSeriesId: "64f2a8f3a27c4a9ab0f27b91",
      educatorId: "64f2a8f3a27c4a9ab0f27b91",
    },
    {
      title: "node.js backend test",
      description: {
        short: "Covers Node.js and Express basics.",
        long: "Tests server-side concepts, routing, middleware, and REST APIs.",
      },
      image: {
        public_id: "nodetest001",
        url: "https://example.com/images/node-test.jpg",
      },
      subject: "node.js",
      startDate: new Date("2025-08-24T10:00:00Z"),
      duration: 90,
      overallMarks: {
        positive: 4,
        negative: -1,
      },
      markingType: "PQM",
      questions: [],
      testSeriesId: "64f2a8f3a27c4a9ab0f27b91",
      educatorId: "64f2a8f3a27c4a9ab0f27b91",
    },
    {
      title: "react frontend test",
      description: {
        short: "Tests React basics.",
        long: "Includes JSX, components, props, state, hooks, and lifecycle methods.",
      },
      image: {
        public_id: "reacttest001",
        url: "https://example.com/images/react-test.jpg",
      },
      subject: "react",
      startDate: new Date("2025-08-25T10:00:00Z"),
      duration: 90,
      overallMarks: {
        positive: 4,
        negative: -1,
      },
      markingType: "PQM",
      questions: [],
      testSeriesId: "64f2a8f3a27c4a9ab0f27b91",
      educatorId: "64f2a8f3a27c4a9ab0f27b91",
    },
  ],
  isCourseSpecific: true,
  courseId: "64f2a8f3a27c4a9ab0f27b91",
};

export default liveTestSeriesExample;
