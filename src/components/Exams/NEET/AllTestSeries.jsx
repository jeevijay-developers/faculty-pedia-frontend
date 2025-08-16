'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaBookOpen, FaGraduationCap, FaUser, FaRupeeSign } from 'react-icons/fa';
import { MdDateRange, MdQuiz } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';
import { getTestSeriesBySubject, getAllSubjects, formatDate, formatCurrency } from '../../../Data/TestSeries/testseries.data';

const AllTestSeries = () => {
  const [activeTab, setActiveTab] = useState('Physics');
  const [filteredTestSeries, setFilteredTestSeries] = useState([]);
  const [subjects] = useState(getAllSubjects());

  useEffect(() => {
    const filtered = getTestSeriesBySubject(activeTab);
    setFilteredTestSeries(filtered);
  }, [activeTab]);

  const TestSeriesCard = ({ testSeries }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
      <div className="flex items-start space-x-4">
        {/* Educator Photo */}
        <div className="flex-shrink-0">
          <Image
            src={testSeries.educator.photo}
            alt={testSeries.educator.name}
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-blue-100"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Price Row */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {testSeries.title}
            </h3>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(testSeries.fee)}
              </div>
              <div className="text-sm text-gray-500">Course Fee</div>
            </div>
          </div>

          {/* Educator Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900 font-medium">{testSeries.educator.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{testSeries.educator.qualification}</span>
            </div>
          </div>

          {/* Experience */}
          <div className="mb-4">
            <span className="text-gray-700">{testSeries.educator.experience}</span>
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <FaBookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Syllabus</div>
                <div className="text-sm font-medium text-gray-900">{testSeries.syllabus}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MdQuiz className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Tests</div>
                <div className="text-sm font-medium text-gray-900">{testSeries.totalTests} tests</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MdDateRange className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Starting Date</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(testSeries.startingDate)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <BsShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Validity</div>
                <div className="text-sm font-medium text-gray-900">{testSeries.validity}</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">
              View More
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Tabs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === subject
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab} Test Series ({filteredTestSeries.length} available)
          </h2>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Sort by: Popularity</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
              <option>Sort by: Rating</option>
              <option>Sort by: Latest</option>
            </select>
          </div>
        </div>

        {/* Test Series Grid */}
        {filteredTestSeries.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTestSeries.map((testSeries) => (
              <TestSeriesCard key={testSeries.id} testSeries={testSeries} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MdQuiz className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No test series found</h3>
            <p className="text-gray-600">
              We're working on adding more {activeTab} test series. Check back soon!
            </p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Why Choose Our Test Series?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <MdQuiz className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Expert Crafted Questions</h4>
              <p className="text-sm text-gray-600">Questions designed by experienced NEET educators</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCalendarAlt className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Regular Updates</h4>
              <p className="text-sm text-gray-600">Fresh content updated according to latest patterns</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaBookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Detailed Solutions</h4>
              <p className="text-sm text-gray-600">Comprehensive explanations for every question</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BsShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Performance Analytics</h4>
              <p className="text-sm text-gray-600">Track your progress with detailed analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTestSeries;
