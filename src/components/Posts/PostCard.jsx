'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRegCalendarAlt } from 'react-icons/fa';

const PostCard = ({ post }) => {
  const {
    title,
    description,
    category,
    publishDate,
    facultyInfo,
    slug
  } = post;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'NEET':
        return 'bg-green-100 text-green-800';
      case 'IIT-JEE':
        return 'bg-blue-100 text-blue-800';
      case 'CBSE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group">
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors line">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <FaRegCalendarAlt className="h-4 w-4" />
              <span>{formatDate(publishDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={facultyInfo.profilePic}
                alt={facultyInfo.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {facultyInfo.name}
              </span>
            </div>
          </div>

          {/* Read More Link */}
          <Link
            href={`/posts/${slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
          >
            <span>Read More</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;