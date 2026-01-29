"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const EDUCATOR_FALLBACK_IMAGE = "/images/placeholders/educatorFallback.svg";

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
        word.length > 0
          ? word[0].toUpperCase() + word.slice(1).toLowerCase()
          : word
      )
      .join(" ");
  };

  const displaySubjects = Array.isArray(subject)
    ? subject
        .map((sub) => formatSubject(sub?.replace(/-/g, " ") || ""))
        ?.join(", ")
    : subject
    ? formatSubject(subject?.replace(/-/g, " ") || "")
    : "Not specified";

  const displayFollowers =
    typeof followerCount === "number"
      ? followerCount
      : Array.isArray(followers)
      ? followers.length
      : 0;

  const formatFollowers = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

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
    return "Graduate";
  })();

  const displayExperience =
    yoe ?? yearsExperience ?? (experience ? parseInt(experience) : 0);

  const displayBio =
    bio || description || "Passionate educator dedicated to student success.";

  const resolveProfileImage = () =>
    profileImage?.url || profilePicture || image?.url || EDUCATOR_FALLBACK_IMAGE;

  const [profileImageUrl, setProfileImageUrl] = useState(resolveProfileImage);

  useEffect(() => {
    setProfileImageUrl(resolveProfileImage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileImage?.url, profilePicture, image?.url]);

  const ratingAverage =
    typeof rating?.average === "number" ? rating.average : 4.5;

  const ratingCount = rating?.count ?? reviewCount ?? 0;

  return (
    <div className=" group relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] h-full">
      {/* Profile Section */}
      <div className="mb-4 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md group-hover:border-blue-50 transition-colors">
            <Image
              src={profileImageUrl}
              alt={displayName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
              onError={() => setProfileImageUrl(EDUCATOR_FALLBACK_IMAGE)}
            />
          </div>
          <span
            className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm ${
              status === "active" ? "bg-green-500" : "bg-gray-400"
            }`}
            title={status === "active" ? "Online" : "Offline"}
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {displayName}
          </h3>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {displaySubjects}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-5 flex justify-center gap-6 border-y border-gray-100 py-3">
        <div className="text-center">
          <p className="text-base font-bold text-gray-900">
            {ratingAverage.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">Rating</p>
        </div>
        <div className="h-full w-px bg-gray-200"></div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-900">
            {formatFollowers(displayFollowers)}
          </p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div className="h-full w-px bg-gray-200"></div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-900">
            {displayExperience} Yrs
          </p>
          <p className="text-xs text-gray-500">Exp.</p>
        </div>
      </div>

      {/* Bio & Badges */}
      <div className="mb-5 flex-1">
        <p className="text-sm text-gray-600 line-clamp-2 text-center mb-3">
          {displayBio}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {displayQualification}
          </span>
          {Array.isArray(specialization) && specialization.length > 0 ? (
            specialization.slice(0, 2).map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              >
                {spec}
              </span>
            ))
          ) : specialization ? (
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {specialization}
            </span>
          ) : null}
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/profile/educator/${_id}`}>
        <button className="w-full rounded-full bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          View Full Profile
        </button>
      </Link>
    </div>
  );
};

export default EducatorCard;
