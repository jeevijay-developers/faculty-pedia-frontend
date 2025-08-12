'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CBSEData } from '@/Data/Exams/cbse.data';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

const extractClassFromTitle = (title) => {
  // looks for patterns like "Class 6", "6th", "Class 12th", etc.
  const match = title.match(/Class\s*(\d{1,2})|\b(\d{1,2})(st|nd|rd|th)\b/i);
  if (!match) return null;
  const num = match[1] || match[2];
  const parsed = Number(num);
  return Number.isNaN(parsed) ? null : parsed;
};

const ClassesList = ({ selectedClass = null }) => {
  const filtered = useMemo(() => {
    if (selectedClass == null) return CBSEData;
    return CBSEData.filter((item) => extractClassFromTitle(item.title) === selectedClass);
  }, [selectedClass]);

  if (!filtered.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-600">No classes found for the selected filter.</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="relative h-44 bg-gray-100">
                <Image
                  src={classItem.image}
                  alt={classItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
                  {classItem.title}
                </h3>
                <div className="flex items-center mb-3 text-gray-600">
                  <FiUser className="mr-2 text-blue-600" size={16} />
                  <p className="text-sm">{classItem.instructor}</p>
                </div>
                <div className="flex flex-col text-gray-600 gap-1 mb-4">
                  <div className="flex items-center">
                    <FiClock className="mr-2 text-blue-600" size={16} />
                    <span className="text-sm">{classItem.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-blue-600" size={16} />
                    <span className="text-sm">{classItem.startDate}</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">₹{classItem.price}</span>
                    {classItem.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{classItem.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={classItem.detailsLink}
                      className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      href={classItem.enrollLink}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium text-center"
                    >
                      Book Session
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesList;