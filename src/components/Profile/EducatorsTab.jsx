"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiStar } from "react-icons/fi";

const EducatorsTab = ({ followingEducators }) => {
  // Extract the actual educator data from the followingEducators array
  const educators = followingEducators
    .map((follow) => {
      // Handle both populated and unpopulated references
      const educatorData = follow.educatorId || follow;
      
      // Skip if no valid educator data
      if (!educatorData || !educatorData._id) {
        console.warn("Skipping invalid educator data:", follow);
        return null;
      }
      
      // Validate MongoDB ObjectId format
      const isValidId = /^[a-f\d]{24}$/i.test(educatorData._id);
      if (!isValidId) {
        console.warn("Invalid educator ID format:", educatorData._id);
        return null;
      }
      
      return {
        ...educatorData,
        followedAt: follow.followedAt
      };
    })
    .filter(Boolean); // Remove null entries

  console.log("Processed educators:", educators.map(e => ({ id: e._id, name: e.name })));

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Following Educators
          <span className="ml-2 text-sm text-gray-500 font-normal">
            ({educators.length})
          </span>
        </h3>
        {educators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educators.map((educator, index) => {
              const educatorName = educator.name || `${educator.firstName || ''} ${educator.lastName || ''}`.trim();
              const profileImage = educator.profileImage?.url || educator.image?.url;
              const educatorId = educator._id;
              
              // Log for debugging
              if (!educatorId) {
                console.error("Missing educator ID:", educator);
                return null;
              }
              
              return (
                <Link
                  key={educatorId}
                  href={`/profile/educator/${educatorId}`}
                  className="border rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer block"
                >
                  <div className="flex items-center mb-3">
                    {profileImage ? (
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image
                          src={profileImage}
                          alt={educatorName || "Educator"}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3 flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {educatorName || "Educator"}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {educator.specialization || educator.subject}
                      </p>
                    </div>
                  </div>
                  {educator.subject && (
                    <p className="text-sm text-gray-500 mb-2">
                      Subject: {educator.subject}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>
                      {educator.rating?.average 
                        ? educator.rating.average.toFixed(1)
                        : typeof educator.rating === 'number'
                        ? educator.rating.toFixed(1)
                        : "N/A"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{educator.yearsExperience || educator.experience || 0} years</span>
                  </div>
                  {educator.followedAt && (
                    <p className="text-xs text-gray-400">
                      Following since {new Date(educator.followedAt).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <p className="text-gray-500 text-lg mb-2">
              Not following any educators yet
            </p>
            <p className="text-gray-400 text-sm">
              Browse educators and click the follow button to start learning from the best!
            </p>
            <Link
              href="/educators"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Educators
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorsTab;
