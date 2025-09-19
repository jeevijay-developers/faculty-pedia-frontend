"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourseForStudent } from "@/components/server/student/student.routes";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowLeft,
  FiFileText,
  FiCheckCircle,
  FiStar,
  FiBookOpen,
  FiTarget,
  FiDollarSign,
  FiPlay,
  FiExternalLink,
  FiDownload,
  FiUsers,
} from "react-icons/fi";
import Image from "next/image";

const StudentCourseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // course id

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [activeTab, setActiveTab] = useState("classes");

  useEffect(() => {
    try {
      const userData = localStorage.getItem("faculty-pedia-student-data");
      if (userData) {
        const parsed = JSON.parse(userData);
        setStudentId(parsed._id);
      } else {
        setError("Please log in to view this course");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Authentication error");
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!id || !studentId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourseForStudent(studentId, id);
        setCourse(data);
      } catch (err) {
        console.error("Error loading course:", err);
        if (err.response?.status === 403) {
          setError("You are not enrolled in this course.");
        } else if (err.response?.status === 404) {
          setError("Course not found.");
        } else {
          setError("Failed to load course.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, studentId]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeStr) => {
    try {
      // If it's already formatted, return as is
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        return timeStr;
      }

      // Handle different time formats
      if (timeStr.includes(":")) {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      return timeStr;
    } catch (e) {
      return timeStr;
    }
  };

  const isClassAvailable = (classDate) => {
    const currentDate = new Date();
    const scheduleDate = new Date(classDate);

    // Reset time to start of day for accurate comparison
    currentDate.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    return currentDate >= scheduleDate;
  };

  const isTestAvailable = (testDate) => {
    const currentDate = new Date();
    const scheduleDate = new Date(testDate);

    // Reset time to start of day for accurate comparison
    currentDate.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    return currentDate >= scheduleDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FiFileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Course
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiFileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  <FiBookOpen className="w-3 h-3 mr-1" />
                  {course.subject}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                  <FiTarget className="w-3 h-3 mr-1" />
                  {course.specialization}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  <FiCheckCircle className="w-3 h-3 mr-1" />
                  Enrolled
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                  Class {course.courseClass}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {course.classes?.length || 0}
                </p>
                <p>Live Classes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">
                  {course.tests?.length || 0}
                </p>
                <p>Live Tests</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  ₹{course.fees}
                </p>
                <p>Course Fee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview and Instructor */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {course.image?.url ? (
                <div className="relative h-48">
                  <Image
                    src={course.image.url}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <FiBookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      Live Course
                    </h2>
                  </div>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About this Course
                </h2>
                <div className="text-gray-700 mb-6">
                  {course.description?.longDesc ||
                    course.description?.shortDesc ||
                    "This comprehensive course is designed to help you excel in your studies with live classes and tests."}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FiCalendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Start Date</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatDate(course.startDate)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <FiClock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">End Date</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatDate(course.endDate)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <FiUsers className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Enrolled</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {course.enrolledStudents?.length || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <FiClock className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {course.classDuration}h per class
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4">Your Instructor</h4>
            {course.educatorId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {course.educatorId.image?.url ? (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={course.educatorId.image.url}
                        alt={`${course.educatorId.firstName} ${course.educatorId.lastName}`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold text-gray-900 capitalize">
                      {course.educatorId.firstName} {course.educatorId.lastName}
                    </h5>
                    <div className="flex items-center mt-1">
                      <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        Expert Instructor
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FiUser className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Instructor info not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("classes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "classes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiBookOpen className="w-4 h-4 inline mr-2" />
                Live Classes ({course.classes?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "tests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiFileText className="w-4 h-4 inline mr-2" />
                Live Tests ({course.tests?.length || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "classes" && (
              <div className="space-y-4">
                {course.classes && course.classes.length > 0 ? (
                  course.classes.map((liveClass, index) => (
                    <div
                      key={liveClass._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {liveClass.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {liveClass.topic}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                            <span className="inline-flex items-center">
                              <FiCalendar className="w-4 h-4 mr-1" />
                              {formatDate(liveClass.date)}
                            </span>
                            <span className="inline-flex items-center">
                              <FiClock className="w-4 h-4 mr-1" />
                              {formatTime(liveClass.time)}
                            </span>
                            <span className="inline-flex items-center">
                              <FiClock className="w-4 h-4 mr-1" />
                              {liveClass.duration} minutes
                            </span>
                          </div>

                          <p className="text-gray-700 text-sm mb-4">
                            {liveClass.description}
                          </p>

                          {/* Assets Links */}
                          {liveClass.assetsLinks &&
                            liveClass.assetsLinks.length > 0 &&
                            isClassAvailable(liveClass.date) && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Assets:
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {liveClass.assetsLinks.map(
                                    (asset, assetIndex) => (
                                      <a
                                        key={assetIndex}
                                        href={asset.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                      >
                                        <FiDownload className="w-3 h-3 mr-1" />
                                        {asset.name}
                                      </a>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="flex-shrink-0 ml-4">
                          {isClassAvailable(liveClass.date) ? (
                            <div className="space-y-2">
                              {liveClass.liveClassLink && (
                                <a
                                  href={liveClass.liveClassLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <FiExternalLink className="w-4 h-4 mr-2" />
                                  Join Class
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="text-center">
                              <button
                                disabled
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                              >
                                <FiClock className="w-4 h-4 mr-2" />
                                Not Available
                              </button>
                              <p className="text-xs text-gray-400 mt-1">
                                Available from {formatDate(liveClass.date)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiBookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      No Classes Available
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Classes will be added to this course soon.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-4">
                {course.tests && course.tests.length > 0 ? (
                  course.tests.map((test, index) => (
                    <div
                      key={test._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {test.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="inline-flex items-center">
                                <FiCalendar className="w-4 h-4 mr-1" />
                                {formatDate(test.startDate)}
                              </span>
                              <span className="inline-flex items-center">
                                <FiClock className="w-4 h-4 mr-1" />
                                {test.duration} minutes
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {test.description?.short ||
                                test.description?.long ||
                                "Test description not available"}
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {isTestAvailable(test.startDate) ? (
                            <button
                              onClick={() => {
                                router.push(`/live-test/${test._id}/attend`);
                              }}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <FiPlay className="w-4 h-4 mr-2" />
                              Attend Test
                            </button>
                          ) : (
                            <div className="text-center">
                              <button
                                disabled
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                              >
                                <FiClock className="w-4 h-4 mr-2" />
                                Not Available
                              </button>
                              <p className="text-xs text-gray-400 mt-1">
                                Available from {formatDate(test.startDate)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiFileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      No Tests Available
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Tests will be added to this course soon.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;
