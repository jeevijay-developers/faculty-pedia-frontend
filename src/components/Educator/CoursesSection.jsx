"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";
import { formatDate } from '@/Data/TestSeries/testseries.data';

const CoursesSection = ({ courses }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Courses by this Educator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No courses available from this educator yet.
          </p>
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    thumbnail,
    fees,
    originalPrice,
    startDate,
    endDate,
    seatLimit,
    rating,
  } = course;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Course Thumbnail */}
      <div className="relative h-40 w-full">
        <Image
          src={thumbnail || "/images/placeholders/square.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Course Details */}
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2">
          <Link
            href={`/courses/${id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        </h3>

        <div className="flex items-center justify-between mb-3">
          {/* <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="text-sm text-gray-700">{rating}</span>
          </div> */}

          <div className="flex items-center text-sm text-gray-600">
            <FaUsers className="mr-1" />
            <span>{seatLimit} students</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FaClock className="mr-1" />
          <div className="flex gap-1">
            <span>{formatDate(startDate)}</span> - 
            <span>{formatDate(endDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-800">₹{fees}</span>
            {originalPrice && (
              <span className="ml-2 text-gray-500 line-through text-sm">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <Link
            href={`/courses/${id}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
