'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EducatorCard = ({ educator }) => {
    const { 
        firstName, 
        lastName, 
        profileImage, 
        qualification, 
        yearsExperience, 
        bio,
        specialization 
    } = educator;

    // Get the highest qualification
    const highestQualification = qualification && qualification.length > 0 
        ? qualification[qualification.length - 1] 
        : null;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            {/* Educator Profile */}
            <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                    <Image
                        src={profileImage?.url || "/images/placeholders/1.svg"}
                        alt={`${firstName} ${lastName}`}
                        width={64}
                        height={64}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>
                
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {firstName} {lastName}
                    </h3>
                    
                    {highestQualification && (
                        <p className="text-gray-600 text-sm mb-1">
                            {highestQualification.title}
                        </p>
                    )}
                    
                    <p className="text-gray-500 text-sm">
                        {yearsExperience} years experience
                    </p>
                </div>
            </div>

            {/* Bio Section */}
            <div className="mb-4">
                <p className="text-gray-600 text-sm line-clamp-2">
                    {bio}
                </p>
            </div>

            {/* Followers and Follow Button */}
            <div className="flex items-center justify-end">
                <div className="flex space-x-2">
                    
                    <Link href={`/profile/educator/${educator.id}`}>
                        <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            View Profile
                        </button>
                    </Link>
                    <Link href={`/educators/${educator.id}/courses`}>
                        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            View Courses
                        </button>
                    </Link>
                </div>
            </div>

            {/* Specialization Badge */}
            <div className="mt-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {specialization}
                </span>
            </div>
        </div>
    );
};

export default EducatorCard;