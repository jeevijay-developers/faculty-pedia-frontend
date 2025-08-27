'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoStarSharp } from 'react-icons/io5';
import { FaBook } from "react-icons/fa";

const EducatorCard = ({ educator }) => {
    const { 
        id,
        firstName, 
        lastName, 
        name,
        profileImage, 
        qualification, 
        experience,
        yearsExperience,
        bio,
        specialization,
        subject,
        rating,
        reviewCount,
        status
    } = educator;

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
            {/* Header Section */}
            <div className="p-2 border-b border-gray-100">
                <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                        <Image
                            src={profileImage?.url || "/images/placeholders/1.svg"}
                            alt={name || `${firstName} ${lastName}`}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        {status === 'active' && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {name || `${firstName} ${lastName}`}
                        </h3>
                        
                        <p className="text-blue-600 font-medium text-sm mb-2 flex items-center">
                            <FaBook className='mr-1' />
                            {subject}
                        </p>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="px-6 py-2 flex-1">
                {/* Bio Section */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {bio}
                    </p>
                </div>
                {/* Qualification & Experience */}
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">Education:</span>
                        <span className="text-sm text-gray-600 text-right flex-1 pl-2 line-clamp-1">
                            {qualification?.[0]?.title || 'Not specified'}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">Experience:</span>
                        <span className="text-sm text-gray-600 text-right flex-1 pl-2">
                            {experience || `${educator.yearsExperience}+ years`}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">Rating:</span>
                        <div className="flex items-center space-x-1  pl-2">
                            <IoStarSharp className="text-yellow-500 w-4 h-4" />
                            <span className="text-sm font-medium text-gray-900">{rating}</span>
                            <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>


                {/* Specialization Badge */}
                <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {specialization}
                    </span>
                </div>
            </div>

            {/* Footer Section */}
            <div className="p-3 pt-0 mt-auto">
                <Link href={`/profile/educator/${id}`}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        View Full Profile
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default EducatorCard;