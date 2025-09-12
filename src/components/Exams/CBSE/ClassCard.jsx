"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiUser, FiClock, FiBook, FiAward } from "react-icons/fi";

const ClassCard = ({ courseItem }) => {
  // Extract data from the course schema with fallbacks
  const title = courseItem.title || "Course Title";
  const courseClass = courseItem.courseClass || "N/A";
  const subject = courseItem.subject || "General";
  const specialization = courseItem.specialization || "CBSE";
  const fees = courseItem.fees || 0;
  const courseType = courseItem.courseType || "OTA";
  const startDate = courseItem.startDate
    ? new Date(courseItem.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "TBD";
  const endDate = courseItem.endDate
    ? new Date(courseItem.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "TBD";
  const duration = courseItem.classDuration || 1;
  const seatLimit = courseItem.seatLimit || 0;
  const imageUrl = courseItem.image?.url || "/images/placeholders/1.svg";

  // Educator information
  const educatorName =
    courseItem.educatorId?.firstName && courseItem.educatorId?.lastName
      ? `${courseItem.educatorId.firstName} ${courseItem.educatorId.lastName}`
      : courseItem.educatorId?.firstName || "Instructor";
  const qualification =
    courseItem.educatorId?.qualification?.[0]?.title || "Qualified Educator";

  // Generate slug for course details link
  const courseId = courseItem._id || courseItem.id;
  const slug = courseItem.slug || courseId;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gray-100">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
          Class {courseClass}
        </div>
        <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
          {courseType === "OTO" ? "One-to-One" : "One-to-All"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
          {title
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h3>

        <div className="flex items-center mb-3 text-gray-600">
          <FiUser className="mr-2 text-blue-600" size={16} />
          <p className="text-sm">{educatorName}</p>
        </div>

        <div className="flex items-center mb-2 text-gray-600">
          <FiAward className="mr-2 text-blue-600" size={16} />
          <span className="text-sm">{qualification}</span>
        </div>

        <div className="flex flex-col text-gray-600 gap-1 mb-4">
          <div className="flex items-center">
            <FiBook className="mr-2 text-blue-600" size={16} />
            <span className="text-sm capitalize">
              {subject} • {seatLimit} seats
            </span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">{duration}h per class</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">₹{fees}</span>
              {fees === 0 && (
                <span className="text-green-600 text-sm font-medium">Free</span>
              )}
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
              {specialization}
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/details/course/${courseId}`}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium text-center transition-colors"
            >
              View Details
            </Link>
            <Link
              href={`/enroll/${slug}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium text-center transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
