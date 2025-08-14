"use client";
import React, { useState } from "react";
import ClassesTab from "./ClassesTab";
import TestsTab from "./TestsTab";
import CourseHeader from "./CourseHeader";

const CourseDetails = ({ course }) => {
  const [activeTab, setActiveTab] = useState("classes");

  return (
    <div className="max-w-7xl mx-auto p-4">
      <CourseHeader course={course} />

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("classes")}
              className={`${
                activeTab === "classes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Classes
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`${
                activeTab === "tests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Tests
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "classes" ? (
            <ClassesTab classes={course.classes} />
          ) : (
            <TestsTab tests={course.tests[0].liveTests} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
