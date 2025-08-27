"use client";
import React, { useState } from "react";
import CourseHeader from "./CourseHeader";
import ClassCard from "./ClassCard";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import { FaUsers, FaClock, FaCalendarAlt, FaChair, FaGraduationCap } from "react-icons/fa";

const CourseDetails = ({ course }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    let videoId = null;
    
    // youtu.be format
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // youtube.com/watch format
    else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    // youtube.com/embed format (already correct)
    else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    console.log('Converting URL:', url, 'to:', embedUrl); // Debug log
    return embedUrl;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <CourseHeader course={course} />

      <div className="mt-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("classes")}
              className={`${
                activeTab === "classes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Classes ({course.classes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`${
                activeTab === "tests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Tests ({course.tests?.length || 0})
            </button>
          </nav>
        </div>

        {/* Main Content with Sidebar */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <FaUsers className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.seatLimit}</div>
                  <div className="text-sm text-gray-600">Seat Limit</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <FaClock className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.classDuration}h</div>
                  <div className="text-sm text-gray-600">Per Class</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <FaGraduationCap className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.classes?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <FaChair className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.purchases?.length || 0}</div>
                  <div className="text-sm text-gray-600">Enrolled</div>
                </div>
              </div>

              {/* Course Videos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Intro Video */}
                {course.videos?.intro && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Introduction</h3>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <iframe
                        src={getYouTubeEmbedUrl(course.videos.intro)}
                        title="Course Introduction"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Description Video */}
                {course.videos?.descriptionVideo && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Description Video</h3>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <iframe
                        src={getYouTubeEmbedUrl(course.videos.descriptionVideo)}
                        title="Course Description"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Description</h3>
                <p className="text-gray-700 leading-relaxed">{course.description?.longDesc}</p>
              </div>

              {/* Course Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{new Date(course.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{new Date(course.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaClock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "classes" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Course Classes</h3>
                <p className="text-gray-600">All scheduled classes for this course</p>
              </div>
              {course.classes && course.classes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {course.classes.map((classItem, index) => (
                    <ClassCard key={index} classData={classItem} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No classes scheduled yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "tests" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Course Tests</h3>
                <p className="text-gray-600">Practice tests and assessments for this course</p>
              </div>
              {course.tests && course.tests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {course.tests.map((test, index) => (
                    <TestSeriesCard 
                      key={index} 
                      testSeries={{
                        id: test.id,
                        title: test.title,
                        educatorName: course.instructor,
                        educatorPhoto: course.image?.url || "/images/placeholders/1.svg",
                        qualification: "Course Test",
                        subject: test.subject,
                        specialization: course.specialization,
                        noOfTests: 1,
                        fee: 0, // Course tests are usually free
                        slug: `test-${test.id}`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tests available yet.</p>
                </div>
              )}
            </div>
          )}
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {/* Course Price and Enroll */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ₹{course.price || course.fees}
                  </div>
                  {course.originalPrice && course.originalPrice > (course.price || course.fees) && (
                    <div className="text-lg text-gray-500 line-through mb-4">
                      ₹{course.originalPrice}
                    </div>
                  )}
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enroll Button for Overview Tab Bottom */}
        {activeTab === "overview" && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Learning Journey?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have transformed their academic performance with our comprehensive courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg">
                Enroll Now - ₹{course.price || course.fees}
              </button>
              <button className="border border-blue-600 text-blue-600 py-4 px-8 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Download Syllabus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
