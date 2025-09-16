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
  FiTrendingUp,
  FiTarget,
  FiStar,
} from "react-icons/fi";

const StudentProfile = ({
  studentData,
  loading = false,
  error = null,
  onRefresh,
  isOwnProfile = false,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Debug: Log the studentData to see what's being passed
  console.log("StudentProfile received data:", studentData);

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

  // Handle both nested (studentData.student) and flat data structures
  const student = studentData.student || studentData;

  const {
    name,
    email,
    mobileNumber,
    profileImage,
    courses = [],
    followingEducators = [],
    tests = [],
    results = [],
  } = student || {};

  // Debug: Log extracted data
  console.log("Extracted student data:", {
    name,
    email,
    mobileNumber,
    profileImage,
    coursesLength: courses.length,
    followingEducatorsLength: followingEducators.length,
    testsLength: tests.length,
    resultsLength: results.length,
  });

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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <FiBookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Enrolled Courses
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
              <FiTarget className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Tests Taken</p>
              <p className="text-2xl font-bold text-gray-900">{totalResults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
              <FiTrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Following</p>
              <p className="text-2xl font-bold text-gray-900">
                {followingEducators.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Test Results
            </h3>
            {results.length > 5 && (
              <button
                onClick={() => setActiveTab("results")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                      <FiAward className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900">
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
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {result.obtainedScore || 0}/{result.totalScore || 0}
                    </p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-green-600 font-medium">
                        {result.totalCorrect || 0} correct
                      </span>
                      <span className="text-red-500 font-medium">
                        {result.totalIncorrect || 0} wrong
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiAward className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No test results yet</p>
              <p className="text-sm text-gray-400 mt-1">Take your first test to see results here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">
          Enrolled Courses
        </h3>
      </div>
      <div className="p-6">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={course._id || index}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
              >
                {course.image?.url && (
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={course.image.url}
                      alt={course.title || "Course"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-lg leading-tight">
                    {course.title || "Course Title"}
                  </h4>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {course.specialization}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                      Class {course.courseClass}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">
                    {course.subject}
                  </p>
                  {course.slug && (
                    <Link
                      href={`/details/course/${course.slug}`}
                      className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiBookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No courses enrolled yet</h4>
            <p className="text-gray-500 mb-6">Explore and enroll in courses to start learning</p>
            <Link 
              href="/courses" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">
          Test Results
        </h3>
      </div>
      <div className="overflow-hidden">
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Correct
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Incorrect
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => {
                  const percentage = result.totalScore ? 
                    ((result.obtainedScore / result.totalScore) * 100).toFixed(1) : 0;
                  const performanceColor = percentage >= 80 ? 'text-green-600' : 
                                         percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
                  const performanceBg = percentage >= 80 ? 'bg-green-100' : 
                                      percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100';
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <FiAward className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Test #{result.testId || index + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              Series #{result.seriesId || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {result.obtainedScore || 0}/{result.totalScore || 0}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage}% scored
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {result.totalCorrect || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {result.totalIncorrect || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${performanceBg} ${performanceColor}`}>
                          {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiAward className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No test results available</h4>
            <p className="text-gray-500 mb-6">Take your first test to see detailed results and analytics</p>
            <Link 
              href="/live-test" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take a Test
            </Link>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profileImage?.url ? (
                  <div className="w-28 h-28 relative">
                    <Image
                      src={profileImage.url}
                      alt={name}
                      fill
                      className="object-cover rounded-full border-4 border-white shadow-xl ring-4 ring-blue-100"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border-4 border-white shadow-xl ring-4 ring-blue-100">
                    <FiUser className="w-14 h-14 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {name}
                  </h1>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-gray-600">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {isOwnProfile && (
                <Link
                  href="/profile/edit"
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Link>
              )}
              {onRefresh && (
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
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
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-3 font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  } rounded-t-lg`}
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
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
