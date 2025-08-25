import React from 'react';
import Link from 'next/link';

const CourseCard = ({ course }) => {
  // Format the starting date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 flex flex-col h-full">
      {/* Course Title */}
      <h3 className="text-xl font-bold text-black mb-4 leading-tight">
        {course.title}
      </h3>

      {/* Educator Section */}
      <div className="flex items-center mb-4">
        {/* Educator Photo */}
        <div className="flex-shrink-0 mr-3">
          <img 
            src={course?.educator?.profileImage || '/images/placeholders/square.svg'}
            alt={course?.educator?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
          />
        </div>

        {/* Educator Name */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-black">
            {course.educator.name}
          </h4>
        </div>
      </div>

      {/* Course Information */}
      <div className="space-y-2 mb-6">
        {/* Starting Date */}
        <div className="flex items-center">
          <span className="text-black text-sm">
            <strong>Starting From:</strong> {formatDate(course.startDate)}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center">
          <span className="text-black text-sm">
            <strong>Duration:</strong> {course.totalWeeks} weeks
          </span>
        </div>
      </div>

      {/* View More Button */}
  <div className="flex justify-end mt-auto">
        <Link 
          href={`/details/course/${course._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
        >
          View More
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
