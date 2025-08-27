import React from "react";
import { FaStar, FaUsers, FaClock, FaCalendarAlt, FaChair, FaGraduationCap, FaRupeeSign } from "react-icons/fa";

const CourseHeader = ({ course }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="text-black/80 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Image */}
          <div className="lg:col-span-1">
            <img
              src={course.image?.url || "/images/placeholders/1.svg"}
              alt={course.title}
              className="w-full h-64 lg:h-48 object-cover rounded-lg border-2 border-white/20"
            />
          </div>
          
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-blue-200/50 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium">
                {course.specialization}
              </span>
              <span className="bg-blue-200/50 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium">
                Class {course.courseClass}
              </span>
              <span className="bg-blue-200/50 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium">
                {course.courseType === 'OTA' ? 'One to All' : 'One to One'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-black/90 text-lg mb-4">{course.description?.shortDesc}</p>
            
            {/* Instructor Info */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-sm">
                <span className="text-black/80">Instructor: </span>
                <span className="font-semibold">{course.instructor}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{course.duration}</div>
                <div className="text-black/80 text-sm">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{course.classes?.length || 0}</div>
                <div className="text-black/80 text-sm">Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{course.classDuration}h</div>
                <div className="text-black/80 text-sm">Per Class</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{course.seatLimit}</div>
                <div className="text-black/80 text-sm">Seats</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pricing */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaRupeeSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Course Fee</span>
            </div>
            <div className="text-2xl font-bold text-green-800">₹{course.fees?.toLocaleString()}</div>
            {course.originalPrice && course.originalPrice !== course.price && (
              <div className="text-sm text-gray-500 line-through">₹{course.originalPrice}</div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaCalendarAlt className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Timeline</span>
            </div>
            <div className="text-sm text-blue-800">
              <div>Start: {formatDate(course.startDate)}</div>
              <div>End: {formatDate(course.endDate)}</div>
            </div>
          </div>

          {/* Enrollment */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaUsers className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Enrollment</span>
            </div>
            <div className="text-2xl font-bold text-purple-800">
              {course.purchases?.length || 0}/{course.seatLimit}
            </div>
            <div className="text-sm text-purple-600">Students</div>
          </div>

          {/* Subject */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaGraduationCap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Subject</span>
            </div>
            <div className="text-lg font-bold text-orange-800">{course.subject}</div>
            <div className="text-sm text-orange-600">{course.specialization}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
