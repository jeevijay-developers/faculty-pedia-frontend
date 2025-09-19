"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTestSeriesForStudent } from "@/components/server/student/student.routes";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPlay,
  FiArrowLeft,
  FiFileText,
  FiCheckCircle,
  FiStar,
  FiBookOpen,
  FiTarget,
  FiDollarSign,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const StudentTestSeriesDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // series id

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("faculty-pedia-student-data");
      if (userData) {
        const parsed = JSON.parse(userData);
        setStudentId(parsed._id);
      } else {
        setError("Please log in to view this test series");
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

    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestSeriesForStudent(studentId, id);
        setSeries(data);
      } catch (err) {
        console.error("Error loading series:", err);
        if (err.response?.status === 403) {
          setError("You are not enrolled in this test series.");
        } else if (err.response?.status === 404) {
          setError("Test series not found.");
        } else {
          setError("Failed to load test series.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
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

  const isTestSeriesStarted = (startDate) => {
    const currentDate = new Date();
    const seriesStartDate = new Date(startDate);

    // Reset time to start of day for accurate comparison
    currentDate.setHours(0, 0, 0, 0);
    seriesStartDate.setHours(0, 0, 0, 0);

    return currentDate >= seriesStartDate;
  };

  const onAttendTest = (testId) => {
    // redirect to attend page
    router.push(`/live-test/${testId}/attend`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test series...</p>
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
            Unable to Load Test Series
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

  if (!series) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiFileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Test Series Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The test series you're looking for doesn't exist or has been
            removed.
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
              Back to Test Series
            </button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {series.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  <FiBookOpen className="w-3 h-3 mr-1" />
                  {series.subject}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                  <FiTarget className="w-3 h-3 mr-1" />
                  {series.specialization}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  <FiCheckCircle className="w-3 h-3 mr-1" />
                  Enrolled
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {series.liveTests?.length || 0}
                </p>
                <p>Live Tests</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  ₹{series.price}
                </p>
                <p>Course Fee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Series Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {series.image?.url ? (
              <div className="relative h-48">
                <Image
                  src={series.image.url}
                  alt={series.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FiFileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Test Series
                  </h2>
                </div>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About this Test Series
              </h2>
              <div className="text-gray-700 mb-6">
                {series.description?.long ||
                  series.description?.short ||
                  "This comprehensive test series is designed to help you excel in your exams with practice tests and detailed analysis."}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatDate(series.startDate)}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <FiClock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatDate(series.endDate)}
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <FiFileText className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-1">Tests</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {series.liveTests?.length || 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-1">Price</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    ₹{series.price}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Tests Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Live Tests</h3>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {series.liveTests?.length || 0} Tests Available
              </span>
            </div>

            {series.liveTests && series.liveTests.length > 0 ? (
              <div className="space-y-4">
                {series.liveTests.map((test, index) => (
                  <div
                    key={test._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>

                      {test.image?.url ? (
                        <div className="w-16 h-12 relative rounded-md overflow-hidden">
                          <Image
                            src={test.image.url}
                            alt={test.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <FiFileText className="w-5 h-5 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {test.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
                          <span className="inline-flex items-center">
                            <FiBookOpen className="w-3 h-3 mr-1" />
                            {test.subject}
                          </span>
                          <span className="inline-flex items-center">
                            <FiTarget className="w-3 h-3 mr-1" />
                            {test.specialization}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center">
                            <FiCalendar className="w-3 h-3 mr-1" />
                            {formatDate(test.startDate)}
                          </span>
                          <span className="inline-flex items-center">
                            <FiClock className="w-3 h-3 mr-1" />
                            {test.duration} minutes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isTestSeriesStarted(series.startDate) ? (
                        <button
                          onClick={() => onAttendTest(test._id)}
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
                            Available from {formatDate(series.startDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiFileText className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  No Tests Available
                </h4>
                <p className="text-gray-600 text-sm">
                  Tests will be added to this series soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4">Your Instructor</h4>
            {series.educatorId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {series.educatorId.image?.url ? (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={series.educatorId.image.url}
                        alt={`${series.educatorId.firstName} ${series.educatorId.lastName}`}
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
                    <h5 className="font-semibold text-gray-900">
                      {series.educatorId.firstName} {series.educatorId.lastName}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {series.educatorId.specialization || "Expert Educator"}
                    </p>
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

          {/* Enrollment Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4">Course Statistics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Enrolled Students</span>
                <span className="font-semibold text-gray-900">
                  {series.enrolledStudents?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Course Type</span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {series.isCourseSpecific
                    ? "Course Specific"
                    : "Open Enrollment"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold text-gray-900">
                  {Math.ceil(
                    (new Date(series.endDate) - new Date(series.startDate)) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-blue-600 rounded-lg p-6 text-white">
            <h4 className="font-bold mb-2">Your Progress</h4>
            <p className="text-blue-100 text-sm mb-4">
              Track your performance and stay motivated
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Tests Completed</span>
                <span className="font-semibold">
                  0 / {series.liveTests?.length || 0}
                </span>
              </div>
              <div className="w-full bg-blue-500 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTestSeriesDetail;
