'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  FaStar, 
  FaUsers, 
  FaClock, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay,
  FaRupeeSign 
} from 'react-icons/fa';
import { formatDate } from '@/utils/dateFormatter';

const EnhancedCoursesSection = ({ courses, educatorName }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const coursesPerSlide = 3;
  const totalSlides = Math.ceil(courses.length / coursesPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getVisibleCourses = () => {
    const startIndex = currentSlide * coursesPerSlide;
    return courses.slice(startIndex, startIndex + coursesPerSlide);
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Courses by {educatorName}
        </h2>
        <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm sm:text-base">
            No courses available from this educator yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Courses by {educatorName}
        </h2>
        
        {/* Carousel Navigation */}
        {courses.length > coursesPerSlide && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={currentSlide === 0}
            >
              <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={currentSlide === totalSlides - 1}
            >
              <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Courses Grid/Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {getVisibleCourses().map((course, index) => (
          <CourseCard key={course._id || index} course={course} />
        ))}
      </div>

      {/* Slide Indicators */}
      {courses.length > coursesPerSlide && (
        <div className="flex justify-center mt-4 sm:mt-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const getCourseTypeTag = (courseType) => {
    const typeMap = {
      'OTA': { label: 'Online Course', color: 'bg-blue-100 text-blue-800' },
      'live': { label: '1-1 Live', color: 'bg-green-100 text-green-800' },
      'webinar': { label: 'Webinar', color: 'bg-purple-100 text-purple-800' },
    };
    
    return typeMap[courseType] || { label: 'Course', color: 'bg-gray-100 text-gray-800' };
  };

  const typeInfo = getCourseTypeTag(course.courseType);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Course Thumbnail */}
      <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden">
        <Image
          src={course.image?.url || "/images/placeholders/1.svg"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Course Type Tag */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </div>

        {/* Play Button for Video Preview */}
        {course.videos?.intro && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <FaPlay className="text-gray-800 ml-1 w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Course Details */}
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {course.description?.shortDesc || 'No description available'}
        </p>

        {/* Course Info */}
        <div className="space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
              <FaUsers className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{course.seatLimit} seats</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
              <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{course.classDuration}h/class</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <span className="truncate">
              {formatDate(course.startDate, 'short')} - {formatDate(course.endDate, 'short')}
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <FaRupeeSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              <span className="font-bold text-lg sm:text-xl text-gray-900">
                {course.fees?.toLocaleString()}
              </span>
              {course.originalPrice && (
                <span className="ml-1 sm:ml-2 text-gray-500 line-through text-xs sm:text-sm">
                  ₹{course.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={`/details/course/${course._id}`}
              className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              View More
            </Link>
            <Link
              href={`/details/course/${course._id}?enroll=true`}
              className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Enroll
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCoursesSection;
