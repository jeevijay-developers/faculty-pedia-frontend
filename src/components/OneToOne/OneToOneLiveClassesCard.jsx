"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBook, FaClock, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

const EDUCATOR_FALLBACK_IMAGE = "/images/placeholders/educatorFallback.svg";

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

  // Calculate enrollment percentage
  const enrollmentPercentage =
    ((classData.enrolledStudents?.length || 0) / (classData.maxStudents || 1)) *
    100;
  const isNearlyFull = enrollmentPercentage > 80;

  const educatorName =
    classData.educatorID?.fullName ||
    classData.educatorID?.username ||
    "Instructor";

  const [avatarSrc, setAvatarSrc] = useState(
    classData.educatorID?.profilePicture || EDUCATOR_FALLBACK_IMAGE
  );

  useEffect(() => {
    setAvatarSrc(
      classData.educatorID?.profilePicture || EDUCATOR_FALLBACK_IMAGE
    );
  }, [classData.educatorID?.profilePicture, classData.educatorID]);

  return (
    <div className="group relative flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-600/30 h-full overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <Image
          src="/images/placeholders/1.svg"
          alt={classData.liveClassTitle || "Live Class"}
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        {/* Specialization Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {Array.isArray(classData.liveClassSpecification) &&
            classData.liveClassSpecification.map((spec, idx) => (
              <span
                key={idx}
                className="bg-white/90 backdrop-blur-sm text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold"
              >
                {spec}
              </span>
            ))}
        </div>
      </div>

      <div className="flex flex-col grow p-4">
        {/* Educator Info Section */}
        {classData.educatorID && (
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={avatarSrc}
              alt={educatorName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              onError={() => setAvatarSrc(EDUCATOR_FALLBACK_IMAGE)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {educatorName}
              </p>
              <p className="text-xs text-gray-500">Educator</p>
            </div>
          </div>
        )}

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
            {classData.liveClassTitle}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {classData.description || "Interactive live class session"}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="border-t border-b border-gray-200 py-3 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Class Level */}
            {classData.class && classData.class.length > 0 && (
              <div className="flex items-center gap-2">
                <MdSchool className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {Array.isArray(classData.class)
                      ? classData.class.join(", ")
                      : classData.class}
                  </p>
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-semibold text-gray-900">
                  {classData.classDuration} mins
                </p>
              </div>
            </div>
          </div>

          {/* Full-width Timing */}
          {classData.classTiming && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Scheduled</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(classData.classTiming)} at{" "}
                  {formatTime(classData.classTiming)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Layout */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-1">
            {/* Enrollment Status */}
            <div
              className={`text-xs font-medium ${
                isNearlyFull ? "text-orange-500" : "text-green-600"
              }`}
            >
              {classData.enrolledStudents?.length || 0}/{classData.maxStudents}{" "}
              enrolled
            </div>
            {/* Price */}
            <div className="text-xl font-bold text-gray-900">
              ₹{(classData.liveClassesFee || 0).toLocaleString()}
            </div>
          </div>

          {/* Details Button */}
          <Link
            href={`/1-1-live-class/${classData._id || classData.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 h-9 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Details
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OneToOneLiveClassesCard;
