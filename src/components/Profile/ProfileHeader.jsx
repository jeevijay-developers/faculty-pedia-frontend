"use client";

import React from "react";
import Image from "next/image";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";

const ProfileHeader = ({
  name,
  email,
  mobileNumber,
  image,
  username,
  specialization,
  classLevel,
  joinedAt,
  isOwnProfile = false,
  onEditClick,
}) => {
  const joinedDateLabel = joinedAt
    ? new Date(joinedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const resolvedImageSrc = (() => {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (image?.url) return image.url;
    return null;
  })();

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {resolvedImageSrc ? (
                <div className="w-28 h-28 relative">
                  <Image
                    src={resolvedImageSrc}
                    alt={name}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-xl ring-4 ring-blue-100"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border-4 border-white shadow-xl ring-4 ring-blue-100">
                  <FiUser className="w-14 h-14 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              </div>
              {username && (
                <p className="text-sm text-gray-500 mb-3">@{username}</p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-gray-600">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{mobileNumber}</span>
                </div>
              </div>
              {(specialization || classLevel || joinedDateLabel) && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {specialization && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {specialization}
                    </span>
                  )}
                  {classLevel && (
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-xs font-semibold">
                      {classLevel}
                    </span>
                  )}
                  {joinedDateLabel && (
                    <span className="text-sm text-gray-500">
                      Joined {joinedDateLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isOwnProfile && (
              <button
                onClick={onEditClick}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
