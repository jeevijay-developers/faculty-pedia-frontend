'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlay, FaCalendarAlt, FaClock, FaUsers, FaGraduationCap, FaStar, FaChevronRight } from 'react-icons/fa';
import { MdOutlineOndemandVideo, MdAccessTime, MdDateRange } from 'react-icons/md';
import { BsShieldCheck, BsPeople } from 'react-icons/bs';
import { getCoursesByEducatorId, formatDate, formatCurrency } from '../../Data/Courses/courses.data';

const CoursesBySpecificEducator = ({ educatorId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeVideoType, setActiveVideoType] = useState('intro');

  useEffect(() => {
    if (educatorId) {
      const educatorCourses = getCoursesByEducatorId(educatorId);
      setCourses(educatorCourses);
      if (educatorCourses.length > 0) {
        setSelectedCourse(educatorCourses[0]);
      }
    }
  }, [educatorId]);

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  const getSpecializationColor = (spec) => {
    switch (spec) {
      case 'IIT-JEE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NEET': return 'bg-green-100 text-green-800 border-green-200';
      case 'CBSE': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const CourseCard = ({ course, isSelected, onClick }) => (
    <div 
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}
      onClick={() => onClick(course)}
    >
      <div className="flex items-center space-x-3">
        <Image
          src={course.image?.url || "/images/placeholders/1.svg"}
          alt={course.title}
          width={60}
          height={60}
          className="rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 capitalize text-sm">
            {course.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Class {course.courseClass} • {course.subject}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-blue-600 font-bold text-sm">
              {formatCurrency(course.fees)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs border ${getSpecializationColor(course.specialization)}`}>
              {course.specialization}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Courses</span>
            <FaChevronRight className="w-3 h-3" />
            <span>Educator</span>
            <FaChevronRight className="w-3 h-3" />
            <span className="text-blue-600">{selectedCourse.educator.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Courses by {selectedCourse.educator.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Available Courses ({courses.length})
              </h2>
              <div className="space-y-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isSelected={selectedCourse._id === course._id}
                    onClick={setSelectedCourse}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Educator Info Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <Image
                    src={selectedCourse.educator.profileImage?.url || "/images/placeholders/square.svg"}
                    alt={selectedCourse.educator.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-blue-100"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCourse.educator.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-3">
                    {selectedCourse.educator.qualification}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {selectedCourse.educator.experience}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.educator.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm border ${getSpecializationColor(spec)}`}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                  <span className="text-gray-600 ml-2">(4.9)</span>
                </div>
              </div>
            </div>

            {/* Course Videos Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Videos</h3>
              
              {/* Video Toggle Buttons */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveVideoType('intro')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeVideoType === 'intro'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaPlay className="inline-block w-4 h-4 mr-2" />
                  Course Intro
                </button>
                <button
                  onClick={() => setActiveVideoType('demo')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeVideoType === 'demo'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MdOutlineOndemandVideo className="inline-block w-4 h-4 mr-2" />
                  Demo Video
                </button>
              </div>

              {/* Video Player */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <iframe
                  src={activeVideoType === 'intro' ? selectedCourse.videos.intro : selectedCourse.videos.descriptionVideo}
                  title={`${activeVideoType === 'intro' ? 'Course Intro' : 'Demo Video'} - ${selectedCourse.title}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>

            {/* About Course Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">About the Course</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course Description */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Course Description</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedCourse.description.longDesc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <FaGraduationCap className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="font-medium text-gray-900">{selectedCourse.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BsPeople className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-medium text-gray-900">{selectedCourse.courseClass}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Course Details</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <MdDateRange className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Starting Date</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedCourse.startDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <MdAccessTime className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Total Hours</span>
                      </div>
                      <span className="font-medium text-gray-900">{selectedCourse.totalHours}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Classes per Week</span>
                      </div>
                      <span className="font-medium text-gray-900">{selectedCourse.classesPerWeek}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <FaClock className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Each Class Duration</span>
                      </div>
                      <span className="font-medium text-gray-900">{selectedCourse.classDuration} hours</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Duration in Weeks</span>
                      </div>
                      <span className="font-medium text-gray-900">{selectedCourse.totalWeeks}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <BsShieldCheck className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Validity</span>
                      </div>
                      <span className="font-medium text-gray-900">{selectedCourse.validity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Fee</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(selectedCourse.fees)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(selectedCourse.fees * 1.3)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      23% OFF
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    <FaUsers className="inline-block w-4 h-4 mr-1" />
                    {selectedCourse.seatLimit - 15} seats remaining
                  </p>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-102 shadow-lg hover:shadow-xl">
                  Pay Now & Enroll
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <BsShieldCheck className="inline-block w-4 h-4 mr-2" />
                  30-day money-back guarantee • Lifetime access to course materials • Certificate of completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesBySpecificEducator;
