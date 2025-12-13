"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoStarSharp } from "react-icons/io5";
import { FaBook, FaUser } from "react-icons/fa";

const EducatorCard = ({ educator }) => {
  const {
    _id,
    firstName,
    lastName,
    name,
    fullName,
    profileImage,
    profilePicture,
    image,
    qualification,
    qualifications,
    experience,
    yearsExperience,
    yoe,
    followers,
    followerCount,
    bio,
    description,
    specialization,
    subject,
    rating,
    reviewCount,
    status,
  } = educator;

  // Normalize educator data for display
  const displayName =
    name ||
    fullName ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    "Educator";

  const formatSubject = (value) => {
    if (typeof value !== "string") return value;
    return value
      .split(" ")
      .map((word) =>
        word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word
      )
      .join(" ");
  };

  const displaySubjects = Array.isArray(subject)
    ? subject.map((sub) => formatSubject(sub?.replace(/-/g, " ") || ""))?.join(", ")
    : subject
    ? formatSubject(subject?.replace(/-/g, " ") || "")
    : "Not specified";

  const displayFollowers =
    typeof followerCount === "number"
      ? followerCount
      : Array.isArray(followers)
      ? followers.length
      : 0;

  const displayQualification = (() => {
    if (Array.isArray(qualification) && qualification.length > 0) {
      return qualification[0]?.title || qualification[0];
    }
    if (Array.isArray(qualifications) && qualifications.length > 0) {
      return qualifications[0]?.title || qualifications[0];
    }
    if (typeof qualification === "string" && qualification.trim()) {
      return qualification;
    }
    return "Not specified";
  })();

  const displayExperience =
    experience || `${yoe ?? yearsExperience ?? 0}+ years`;

  const displayBio = bio || description || "";

  const profileImageUrl =
    profileImage?.url ||
    profilePicture ||
    image?.url ||
    "/images/placeholders/1.svg";

  const ratingAverage =
    typeof rating?.average === "number" ? rating.average : null;

  const ratingCount =
    rating?.count ?? reviewCount ?? followers?.length ?? 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
      {/* Header Section */}
      <div className="p-2 border-b border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <Image
              src={profileImageUrl}
              alt={displayName}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            {status === "active" && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {displayName}
            </h3>

            <p className="text-blue-600 font-medium text-sm mb-2 flex items-center">
              <FaBook className="mr-1" />
              {displaySubjects}
            </p>
            <p className="text-black/70 font-medium text-sm mb-2 flex items-center">
              <FaUser className="mr-2 w-3 h-3" />
              Followers: {displayFollowers}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6 py-2 flex-1">
        {/* Bio Section */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {displayBio}
          </p>
        </div>
        {/* Qualification & Experience */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              Education:
            </span>
            <span className="text-sm text-gray-600 text-right flex-1 pl-2 line-clamp-1">
              {displayQualification}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              Experience:
            </span>
            <span className="text-sm text-gray-600 text-right flex-1 pl-2">
              {displayExperience}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              Rating:
            </span>
            <div className="flex items-center space-x-1  pl-2">
              <IoStarSharp className="text-yellow-500 w-4 h-4" />
              <span className="text-sm font-medium text-gray-900">
                {ratingAverage !== null ? ratingAverage.toFixed(1) : "N/A"}
              </span>
              <span className="text-xs text-gray-500">
                ({ratingCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Specialization Badge */}
        <div className="mb-3 flex flex-wrap gap-2">
          {Array.isArray(specialization) ? (
            specialization.map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                {spec}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              {specialization || 'Not specified'}
            </span>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-3 pt-0 mt-auto">
        <Link href={`/profile/educator/${_id}`}>
          <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            View Full Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EducatorCard;
