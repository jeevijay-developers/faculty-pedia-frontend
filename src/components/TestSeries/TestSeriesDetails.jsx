"use client";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaTrophy,
  FaBookOpen,
  FaCheckCircle,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import EnrollButton from "../Common/EnrollButton";

const TestSeriesDetails = ({ testSeriesData }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [isClient, setIsClient] = useState(false);

  // Check if testSeriesData exists
  if (!testSeriesData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">No test series data available</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setIsClient(true);
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const formatDate = (dateString) => {
    if (!isClient) return "Loading...";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getProgressPercentage = () => {
    if (!isClient) return 0;
    try {
      const now = new Date();
      const start = new Date(testSeriesData.startDate);
      const end = new Date(testSeriesData.endDate);

      if (now < start) return 0;
      if (now > end) return 100;

      const total = end - start;
      const elapsed = now - start;
      return Math.round((elapsed / total) * 100);
    } catch (error) {
      return 0;
    }
  };

  const getFormattedEndDate = () => {
    if (!isClient) return "Loading...";
    try {
      return new Date(testSeriesData.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <div data-aos="fade-up" className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                {testSeriesData.isCourseSpecific
                  ? "Course Specific"
                  : "General"}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {testSeriesData.noOfTests || 0} Tests
              </span>
            </div>
            <h1 className="text-4xl font-bold capitalize text-gray-900">
              {testSeriesData.title || "Test Series Title"}
            </h1>
            <p className="text-lg text-gray-600">
              {testSeriesData.description?.short || "No description available"}
            </p>
          </div>

          {/* Test Series Image */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={testSeriesData.image?.url || "/images/placeholders/1.svg"}
              alt={testSeriesData.title || "Test Series"}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Key Information */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FaCalendarAlt className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Duration
                </h3>
              </div>
              <p className="text-gray-700 font-medium">
                Start: {formatDate(testSeriesData.startDate)}
              </p>
              <p className="text-gray-600">
                End: {formatDate(testSeriesData.endDate)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${getProgressPercentage()}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isClient
                  ? `${getProgressPercentage()}% Complete`
                  : "Loading..."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FaUsers className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Enrollment
                </h3>
              </div>
              <p className="text-gray-700 font-medium">
                {testSeriesData.enrolledStudents?.length || 0} students enrolled
              </p>
              <div className="flex items-center mt-2">
                <FaTrophy className="text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Join the competition
                </span>
              </div>
            </div>
          </div>

          {/* Test Features */}
          {/* <div
            data-aos="fade-up"
            data-aos-delay="250"
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <FaChartLine className="mr-3 text-purple-600" />
              Test Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <FaFileAlt className="text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Full Length Tests
                    </p>
                    <p className="text-sm text-gray-600">
                      Complete exam simulation
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <FaChartLine className="text-green-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Performance Analytics
                    </p>
                    <p className="text-sm text-gray-600">
                      Detailed score analysis
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <FaClock className="text-orange-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Time Management
                    </p>
                    <p className="text-sm text-gray-600">
                      Learn to manage exam time
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <FaTrophy className="text-yellow-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Rank & Leaderboard
                    </p>
                    <p className="text-sm text-gray-600">Compare with peers</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Description Section */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <FaBookOpen className="mr-3 text-blue-600" />
                About This Test Series
              </h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {testSeriesData.description?.long ||
                    testSeriesData.description?.short ||
                    "No description available."}
                </div>
              </div>
            </div>
          </div>

          {/* Test Schedule */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Test Schedule
            </h2>
            <div className="space-y-4">
              {Array.from(
                { length: testSeriesData.noOfTests || 0 },
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Test {index + 1}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Full Length Mock Test
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">3 hours</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                        {index === 0 ? "Start Test" : "Locked"}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div
            data-aos="fade-left"
            className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-xl top-6 ring-1 ring-green-100"
          >
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Best Value
                </div>
                <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ₹{testSeriesData.price || 0}
                </span>
                <p className="text-gray-600 mt-2">Complete access</p>
              </div>

              <div className="space-y-3">
                <EnrollButton
                  type="testseries"
                  itemId={testSeriesData._id || testSeriesData.id}
                  price={testSeriesData.price}
                  title="🎯 Enroll Now"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:cursor-pointer"
                />
                {/* <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                  📋 View Sample Test
                </button> */}
              </div>

              <div className="pt-4 bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FaFileAlt className="w-4 h-4 mr-2 text-green-500" />
                    Total Tests:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {testSeriesData.noOfTests || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FaUsers className="w-4 h-4 mr-2 text-blue-500" />
                    Enrolled:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {testSeriesData.enrolledStudents?.length || 0} students
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-purple-500" />
                    Access:
                  </span>
                  <span className="font-semibold text-gray-800">
                    Until {getFormattedEndDate()}
                  </span>
                </div>
                {testSeriesData.isCourseSpecific && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FaBookOpen className="w-4 h-4 mr-2 text-orange-500" />
                      Type:
                    </span>
                    <span className="font-semibold text-gray-800">
                      Course Specific
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div
            data-aos="fade-left"
            data-aos-delay="100"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg ring-1 ring-blue-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <span className="text-2xl mr-2">🏆</span>
              What You'll Get
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCheckCircle className="text-green-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  {testSeriesData.noOfTests || 0} full-length mock tests
                </span>
              </li>
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaChartLine className="text-blue-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Detailed performance analysis
                </span>
              </li>
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaBookOpen className="text-purple-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Solution explanations
                </span>
              </li>
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaTrophy className="text-yellow-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Time management strategies
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesDetails;
