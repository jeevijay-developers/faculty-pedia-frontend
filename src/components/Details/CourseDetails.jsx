"use client";
import React, { useEffect, useState } from "react";
import CourseHeader from "./CourseHeader";
import ClassCard from "./ClassCard";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import {
  FaUsers,
  FaClock,
  FaCalendarAlt,
  FaChair,
  FaGraduationCap,
} from "react-icons/fa";
import { getCourseById } from "../server/course.routes";
import Loading from "../Common/Loading";
import EnrollButton from "../Common/EnrollButton";

const CourseDetails = ({ id }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    let videoId = null;

    // youtu.be format
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    // youtube.com/watch format
    else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }
    // youtube.com/embed format (already correct)
    else if (url.includes("youtube.com/embed/")) {
      return url;
    }

    const embedUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : null;
    return embedUrl;
  };

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchCourseDetails = async () => {
      try {
        console.log("Fetching course with ID:", id);
        
        const data = await getCourseById(id);
        console.log("Course data received:", data);
        
        if (data) {
          setCourse(data);
        } else {
          setError("Course not found");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message || "Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Course not found.</p>
        </div>
      </div>
    );
  }

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
              Live Classes ({course.liveClass?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`${
                activeTab === "tests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Test Series ({course.testSeries?.length || 0})
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
                    <div className="text-2xl font-bold text-gray-900">
                      {course.maxStudents || 0}
                    </div>
                    <div className="text-sm text-gray-600">Max Students</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <FaClock className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {course.courseDuration || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Course Duration</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <FaGraduationCap className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {course.liveClass?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Live Classes</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <FaChair className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {course.enrolledStudents?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Enrolled</div>
                  </div>
                </div>

                {/* Course Videos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Intro Video */}
                  {course.introVideo && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Course Introduction
                      </h3>
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                          src={getYouTubeEmbedUrl(course.introVideo)}
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

                  {/* Demo Videos */}
                  {course.videos && course.videos.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Demo Video
                      </h3>
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                          src={getYouTubeEmbedUrl(course.videos[0].link)}
                          title={course.videos[0].title || "Course Demo"}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Course Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {course.description}
                  </p>
                </div>

                {/* Course Timeline */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Course Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">
                          {new Date(course.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium">
                          {new Date(course.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaClock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{course.courseDuration}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Objectives */}
                {course.courseObjectives && course.courseObjectives.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Course Objectives
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {course.courseObjectives.map((objective, index) => (
                        <li key={index} className="text-gray-700">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Prerequisites
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="text-gray-700">{prerequisite}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Study Materials */}
                {course.studyMaterials && course.studyMaterials.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Study Materials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.studyMaterials.map((material, index) => (
                        <a
                          key={index}
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{material.title}</p>
                            <p className="text-sm text-gray-500">{material.fileType}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "classes" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Live Classes
                  </h3>
                  <p className="text-gray-600">
                    All scheduled live classes for this course
                  </p>
                </div>
                {course.liveClass && course.liveClass.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {course.liveClass.map((classItem, index) => (
                      <ClassCard key={classItem._id || index} classData={classItem} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No live classes scheduled yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tests" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Test Series
                  </h3>
                  <p className="text-gray-600">
                    Practice tests and assessments for this course
                  </p>
                </div>
                {course.testSeries && course.testSeries.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {course.testSeries.map((test, index) => (
                      <TestSeriesCard
                        key={test._id || index}
                        testSeries={{
                          id: test._id || test.id,
                          title: test.title,
                          educatorName: course.educatorID?.fullName || "Instructor",
                          educatorPhoto:
                            course.educatorID?.profilePicture || "/images/placeholders/1.svg",
                          qualification: "Course Test",
                          subject: course.subject?.[0] || "General",
                          specialization: course.specialization?.[0] || "General",
                          noOfTests: 1,
                          fee: 0, // Course tests are usually free
                          slug: test.slug || `test-${test._id || test.id}`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No test series available yet.</p>
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
                    ₹{course.fees?.toLocaleString()}
                  </div>
                  {course.discount > 0 && (
                    <div className="text-sm text-green-600 mb-4">
                      {course.discount}% discount
                    </div>
                  )}
                  {course.rating > 0 && (
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{course.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({course.ratingCount || 0} reviews)
                      </span>
                    </div>
                  )}
                  <EnrollButton
                    type="course"
                    itemId={course._id || course.id}
                    price={course.fees}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                  />
                  {course.certificateAvailable && (
                    <div className="text-sm text-gray-600 mt-2">
                      🎓 Certificate available upon completion
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enroll Button for Overview Tab Bottom */}
        {activeTab === "overview" && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have transformed their academic
              performance with our comprehensive courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EnrollButton
                type="course"
                itemId={course._id || course.id}
                price={course.fees}
                className="bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              />
              <div className="text-sm text-gray-600">
                💳 Secure payment • 🔒 Money-back guarantee
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
