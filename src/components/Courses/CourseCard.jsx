import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdSchool, MdAccessTime, MdCalendarToday } from "react-icons/md";
import { IoStarSharp } from "react-icons/io5";
import { FaBook } from "react-icons/fa";

const CourseCard = ({ course }) => {
  // Format the starting date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <Image
          src={
            course?.image?.url || course?.image || "/images/placeholders/1.svg"
          }
          alt={course?.title || "Course"}
          fill
          className="object-cover"
          // onError={(e) => {
          //   e.target.src = "/images/placeholders/1.svg";
          // }}
        />
        {/* Specialization Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {course?.specialization}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {course.title}
        </h3>

        {/* Subject and Specialization */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaBook className="mr-1 text-blue-700" />
            <span>{course.subject}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MdSchool className="w-4 h-4 mr-1 text-green-700" />
            <span>{course.specialization}</span>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="space-y-3 mb-4">
          {/* Start Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdCalendarToday className="w-4 h-4 mr-2 text-orange-700" />
              <span className="font-medium">Starts:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {formatDate(course.startDate)}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdAccessTime className="w-4 h-4 mr-2 text-purple-700" />
              <span className="font-medium">Total Seats:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {course.seatLimit}
            </span>
          </div>
        </div>

        {/* Educator Section */}
        {course.educator && (
          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={
                    course.image?.url ||
                    "/images/placeholders/square.svg"
                  }
                  alt={`${course.educatorId.firstName} ${course.educatorId.lastName}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {`${course.educatorId.firstName} ${course.educatorId.lastName}`}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {course.subject}
                  </span>
                  {/* {course.educator.rating && (
                    <div className="flex items-center space-x-1">
                      <IoStarSharp className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">
                        {course.educator.rating}
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div className="border-t border-gray-100 mb-4 mt-auto">
          <div className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{course.price || course.fees}
              </span>
              {course.originalPrice &&
                course.originalPrice !== (course.price || course.fees) && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{course.originalPrice}
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/details/course/${course._id || course.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md transition-colors duration-200 font-medium text-sm text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
