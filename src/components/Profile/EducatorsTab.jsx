"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiStar } from "react-icons/fi";

const EducatorsTab = ({ followingEducators }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Following Educators
        </h3>
        {followingEducators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followingEducators.map((educator, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  {educator.image?.url ? (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={educator.image.url}
                        alt={educator.name || "Educator"}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">
                      {educator.firstName} {educator.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {educator.specialization}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{educator.subject}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiStar className="w-4 h-4 mr-1" />
                  <span>{educator.rating || 0}</span>
                  <span className="mx-2">•</span>
                  <span>{educator.yearsExperience || 0} years exp</span>
                </div>
                {educator.slug && (
                  <Link
                    href={`/educators/${educator.slug}`}
                    className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Profile →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Not following any educators yet
          </p>
        )}
      </div>
    </div>
  );
};

export default EducatorsTab;
