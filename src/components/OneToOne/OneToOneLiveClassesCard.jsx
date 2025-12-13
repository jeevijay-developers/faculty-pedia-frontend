"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoPersonSharp } from "react-icons/io5";
import { FaBook, FaClock, FaCalendarAlt } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

const OneToOneLiveClassesCard = ({ classData }) => {
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format the time
  const formatTime = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Class Image */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex-shrink-0">
        {classData.introVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <FaBook className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Live Class</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <FaBook className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Live Class</p>
            </div>
          </div>
        )}
        {/* Specialization Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {Array.isArray(classData.liveClassSpecification) &&
            classData.liveClassSpecification.map((spec, idx) => (
              <span
                key={idx}
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium"
              >
                {spec}
              </span>
            ))}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Class Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
          {classData.liveClassTitle}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {classData.description || "Interactive live class session"}
        </p>

        {/* Class Information */}
        <div className="space-y-2 mb-4">
          {/* Educator */}
          {classData.educatorID && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <IoPersonSharp className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Educator:</span>
              </div>
              <span className="text-sm text-gray-800 font-medium truncate ml-2">
                {classData.educatorID?.fullName ||
                  classData.educatorID?.username ||
                  "Instructor"}
              </span>
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaBook className="mr-2 text-blue-600" />
              <span className="font-medium">Subject:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium capitalize">
              {Array.isArray(classData.subject)
                ? classData.subject.join(", ")
                : classData.subject || "N/A"}
            </span>
          </div>

          {/* Class Level */}
          {classData.class && classData.class.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <MdSchool className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Class:</span>
              </div>
              <span className="text-sm text-gray-800 font-medium">
                {Array.isArray(classData.class)
                  ? classData.class.join(", ")
                  : classData.class}
              </span>
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Duration:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {classData.classDuration} mins
            </span>
          </div>

          {/* Class Timing */}
          {classData.classTiming && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                <span className="font-medium">Scheduled:</span>
              </div>
              <span className="text-xs text-gray-800 font-medium">
                {formatDate(classData.classTiming)} at{" "}
                {formatTime(classData.classTiming)}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{(classData.liveClassesFee || 0).toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {classData.enrolledStudents?.length || 0}/{classData.maxStudents}{" "}
              enrolled
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            href={`/1-1-live-class/${classData._id || classData.id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OneToOneLiveClassesCard;
