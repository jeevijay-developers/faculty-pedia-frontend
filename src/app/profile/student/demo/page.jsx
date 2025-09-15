"use client";

import { useState } from "react";
import StudentProfile from "@/components/Profile/StudentProfile";

// Example/Demo data that matches your schema structure
const demoStudentData = {
  _id: "demo123",
  name: "John Doe",
  email: "john.doe@example.com",
  mobileNumber: "+1234567890",
  image: {
    public_id: "demo_image",
    url: "/images/placeholders/square.svg", // Using existing placeholder
  },
  courses: [
    {
      _id: "course1",
      title: "Physics Mastery for IIT-JEE",
      specialization: "IIT-JEE",
      courseClass: "12",
      subject: "Physics",
      description: {
        shortDesc: "Complete physics course for JEE preparation",
      },
      fees: 15000,
      slug: "physics-mastery-iit-jee",
      image: {
        url: "/images/placeholders/1.svg",
      },
    },
    {
      _id: "course2",
      title: "Advanced Mathematics CBSE",
      specialization: "CBSE",
      courseClass: "12",
      subject: "Mathematics",
      description: {
        shortDesc: "Advanced mathematics concepts",
      },
      fees: 12000,
      slug: "advanced-mathematics-cbse",
    },
  ],
  results: [
    {
      _id: "result1",
      testId: "test1",
      seriesId: "series1",
      totalCorrect: 45,
      totalIncorrect: 5,
      totalUnattempted: 10,
      totalScore: 100,
      obtainedScore: 85,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "result2",
      testId: "test2",
      seriesId: "series1",
      totalCorrect: 38,
      totalIncorrect: 12,
      totalUnattempted: 5,
      totalScore: 100,
      obtainedScore: 72,
      createdAt: "2024-01-20T14:15:00Z",
    },
    {
      _id: "result3",
      testId: "test3",
      seriesId: "series2",
      totalCorrect: 52,
      totalIncorrect: 3,
      totalUnattempted: 5,
      totalScore: 100,
      obtainedScore: 94,
      createdAt: "2024-01-25T09:45:00Z",
    },
  ],
  followingEducators: [
    {
      _id: "educator1",
      firstName: "Dr. Rajesh",
      lastName: "Kumar",
      specialization: "IIT-JEE",
      subject: "Physics",
      rating: 4.8,
      yearsExperience: 15,
      slug: "dr-rajesh-kumar-physics",
      image: {
        url: "/images/placeholders/square.svg",
      },
    },
    {
      _id: "educator2",
      firstName: "Prof. Anita",
      lastName: "Sharma",
      specialization: "CBSE",
      subject: "Mathematics",
      rating: 4.9,
      yearsExperience: 12,
      slug: "prof-anita-sharma-math",
    },
  ],
  tests: [{ testSeriesId: "series1" }, { testSeriesId: "series2" }],
};

const StudentProfileDemo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleToggleError = () => {
    setError(error ? null : "Demo error: Unable to fetch student data");
  };

  const handleToggleLoading = () => {
    setLoading(!loading);
  };

  return (
    <div>
      {/* Demo Controls */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-yellow-800">
              Student Profile Demo
            </h3>
            <p className="text-yellow-700">
              This is a demo showing the StudentProfile component with sample
              data
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Toggle Loading
            </button>
            <button
              onClick={handleToggleError}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Toggle Error
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Component */}
      <StudentProfile
        studentData={demoStudentData}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default StudentProfileDemo;
