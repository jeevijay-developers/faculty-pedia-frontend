"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoPersonSharp } from "react-icons/io5";
import { FaBook, FaClock } from "react-icons/fa";

const OneToOneLiveClassesCard = ({ classData }) => {
  const {
    id,
    title,
    educatorName,
    postImage,
    qualification,
    subject,
    specialization,
    duration,
    _id,
    description,
  } = classData;

  function calculateWeeksDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffMs = end - start; // difference in milliseconds
    const weeks = diffMs / (1000 * 60 * 60 * 24 * 7); // convert to weeks

    return Math.round(weeks) ?? 0; // rounded to nearest whole week
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Class Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden flex-shrink-0">
        <Image
          src={classData.image?.url || "/images/placeholders/1.svg"}
          alt={`${classData.educatorId.firstName} ${classData.educatorId.lastName}`}
          fill
          className="object-cover"
          // onError={(e) => {
          //   e.target.src = "/images/placeholders/1.svg";
          // }}
        />
        {/* Specialization Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {specialization}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Class Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description.shortDesc || "No description available"}
        </p>

        {/* Educator Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <IoPersonSharp className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Educator:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium truncate ml-2">
              {`${classData.educatorId.firstName} ${classData.educatorId.lastName}`}
            </span>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdSchool className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Qualification:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium truncate ml-2">
              {qualification}
            </span>
          </div> */}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaBook className="mr-2 text-blue-600" />
              <span className="font-medium">Subject:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {String(subject)?.toUpperCase() || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Duration:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {calculateWeeksDifference(
                classData.startDate,
                classData.endDate
              ) || 0}{" "}
              weeks
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{String(classData.fees)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            href={`/1-1-live-class/${_id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            Book Session
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OneToOneLiveClassesCard;
