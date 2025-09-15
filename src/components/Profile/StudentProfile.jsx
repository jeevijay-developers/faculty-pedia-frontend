"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProfileSkeleton from "./ProfileSkeleton";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiAward,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiTarget,
  FiStar,
} from "react-icons/fi";

const StudentProfile = ({
  studentData,
  loading = false,
  error = null,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {refreshing ? "Retrying..." : "Try Again"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Student Not Found
          </h2>
          <p className="text-gray-600">
            The requested student profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    mobileNumber,
    image,
    courses = [],
    followingEducators = [],
    tests = [],
    results = [],
  } = studentData;

  // Calculate statistics
  const totalCourses = courses.length;
  const totalTests = tests.length;
  const totalResults = results.length;
  const averageScore =
    results.length > 0
      ? (
          results.reduce(
            (sum, result) => sum + (result.obtainedScore || 0),
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "courses", label: "Courses", icon: FiBookOpen },
    { id: "results", label: "Test Results", icon: FiAward },
    { id: "educators", label: "Following", icon: FiUsers },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FiBookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Enrolled Courses
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FiTarget className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tests Taken</p>
              <p className="text-2xl font-bold text-gray-900">{totalResults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FiTrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Following</p>
              <p className="text-2xl font-bold text-gray-900">
                {followingEducators.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Test Results
          </h3>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100">
                      <FiAward className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Test Series #{result.seriesId || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          result.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {result.obtainedScore || 0}/{result.totalScore || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.totalCorrect || 0} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No test results yet
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enrolled Courses
        </h3>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {course.image?.url && (
                  <div className="w-full h-32 relative mb-4">
                    <Image
                      src={course.image.url}
                      alt={course.title || "Course"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <h4 className="font-semibold text-gray-900 mb-2">
                  {course.title || "Course Title"}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {course.specialization} • Class {course.courseClass}
                </p>
                <p className="text-sm text-gray-500">{course.subject}</p>
                {course.slug && (
                  <Link
                    href={`/details/course/${course.slug}`}
                    className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No courses enrolled yet
          </p>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Results
        </h3>
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correct
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incorrect
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Test #{result.testId || index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.obtainedScore || 0}/{result.totalScore || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {result.totalCorrect || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {result.totalIncorrect || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(
                        result.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No test results available
          </p>
        )}
      </div>
    </div>
  );

  const renderEducators = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Following Educators
        </h3>
        {followingEducators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followingEducators.map((educator, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  {educator.image?.url ? (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={educator.image.url}
                        alt={educator.name || "Educator"}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">
                      {educator.firstName} {educator.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {educator.specialization}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{educator.subject}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiStar className="w-4 h-4 mr-1" />
                  <span>{educator.rating || 0}</span>
                  <span className="mx-2">•</span>
                  <span>{educator.yearsExperience || 0} years exp</span>
                </div>
                {educator.slug && (
                  <Link
                    href={`/educators/${educator.slug}`}
                    className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Profile →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Not following any educators yet
          </p>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "courses":
        return renderCourses();
      case "results":
        return renderResults();
      case "educators":
        return renderEducators();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {image?.url ? (
                  <div className="w-24 h-24 relative">
                    <Image
                      src={image.url}
                      alt={name}
                      fill
                      className="object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <FiUser className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 mr-2" />
                    <span>{mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <svg
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } transition-colors`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StudentProfile;
