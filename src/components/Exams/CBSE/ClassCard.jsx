'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser, FiClock, FiBook, FiAward } from 'react-icons/fi';

const ClassCard = ({ testItem }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gray-100">
        <Image
          src="/images/placeholders/1.svg"
          alt={testItem.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
          Class {testItem.class}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
          {testItem.title}
        </h3>
        
        <div className="flex items-center mb-3 text-gray-600">
          <FiUser className="mr-2 text-blue-600" size={16} />
          <p className="text-sm">{testItem.educatorName}</p>
        </div>
        
        <div className="flex items-center mb-2 text-gray-600">
          <FiAward className="mr-2 text-blue-600" size={16} />
          <span className="text-sm">{testItem.qualification}</span>
        </div>
        
        <div className="flex flex-col text-gray-600 gap-1 mb-4">
          <div className="flex items-center">
            <FiBook className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">{testItem.noOfTests} Tests • {testItem.subject}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">{testItem.startingDate}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">{testItem.validity} validity • {testItem.workExperience} exp.</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">₹{testItem.fee}</span>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
              {testItem.specialization}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/details/exam/${testItem.id}`}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium text-center transition-colors"
            >
              View Details
            </Link>
            <Link
              href={`/enroll/${testItem.slug}`}
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
