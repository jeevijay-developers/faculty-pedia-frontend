"use client";

import React from "react";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import CourseCard from "./CourseCard";

const CoursesTab = ({ resolvedCourses, coursesLoading, coursesError }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Enrolled Courses
        </h3>
        {coursesLoading && (
          <span className="text-xs text-gray-500 animate-pulse">
            Loading...
          </span>
        )}
      </div>
      <div className="p-6">
        {coursesError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {coursesError}
          </div>
        )}
        {resolvedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolvedCourses.map((course, index) => (
              <CourseCard key={course?._id || index} course={course} />
            ))}
          </div>
        ) : (
          !coursesLoading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiBookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No courses enrolled yet
              </h4>
              <p className="text-gray-500 mb-6">
                Explore and enroll in courses to start learning
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )
        )}
        {coursesLoading && resolvedCourses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-5 animate-pulse space-y-4"
              >
                <div className="w-full h-40 bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;
