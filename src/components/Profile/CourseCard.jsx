"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      {course?.image?.url && (
        <div className="w-full h-40 relative mb-4">
          <Image
            src={course.image.url}
            alt={course.title || "Course"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <div className="space-y-3">
        <h4
          className="font-semibold text-gray-900 text-lg leading-tight truncate"
          title={course?.title}
        >
          {course?.title || "Course Title"}
        </h4>
        <div className="flex items-center flex-wrap gap-2 text-sm">
          {course?.specialization && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {course.specialization}
            </span>
          )}
          {course?.courseClass && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
              Class {course.courseClass}
            </span>
          )}
        </div>
        {course?.subject && (
          <p className="text-sm text-gray-600 capitalize">{course.subject}</p>
        )}
        {(course?.slug || course?._id) && (
          <Link
            href={`/student-courses/${course._id || course.slug}`}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
          >
            View Details
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
