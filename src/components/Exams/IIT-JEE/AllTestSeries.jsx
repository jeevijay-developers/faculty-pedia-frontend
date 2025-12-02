'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGraduationCap } from 'react-icons/fa';
import { MdDateRange, MdQuiz } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';
import { getTestSeriesByExamAndSubject, getAllSubjectsByExam, formatDate, formatCurrency, calculateValidity } from '../../../Data/TestSeries/testseries.data';
import EnrollButton from '../../Common/EnrollButton';

const AllTestSeries = ({ exam = 'IIT-JEE' }) => {
  const initialSubjects = getAllSubjectsByExam(exam);
  const [activeTab, setActiveTab] = useState(initialSubjects[0] || 'Physics');
  const [filteredTestSeries, setFilteredTestSeries] = useState([]);
  const [subjects, setSubjects] = useState(initialSubjects);

  useEffect(() => {
    // When exam changes, refresh subjects and active tab
    const subs = getAllSubjectsByExam(exam);
    setSubjects(subs);
    if (subs.length && !subs.includes(activeTab)) {
      setActiveTab(subs[0]);
    }
  }, [exam]);

  useEffect(() => {
    const filtered = getTestSeriesByExamAndSubject(exam, activeTab);
    setFilteredTestSeries(filtered);
  }, [exam, activeTab]);

  const TestSeriesCard = ({ testSeries }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 overflow-hidden">
      {/* Header Section */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Educator Photo */}
            <div className="flex-shrink-0">
              <Image
                src={testSeries.teacher.profileImage}
                alt={testSeries.teacher.name}
                width={60}
                height={60}
                className="rounded-full object-cover border-2 border-blue-100"
              />
            </div>
            
            {/* Educator Info */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{testSeries.teacher.name}</span>
              </div>
              <div className="flex flex-wrap items-center mt-1">
                <div className="flex items-center space-x-1 mr-3">
                  <FaGraduationCap className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{testSeries.teacher.qualification}</span>
                </div>
                <span className="text-xs text-gray-600">{testSeries.teacher.experience}</span>
              </div>
            </div>
          </div>
          
          {/* Price Tag */}
          <div className="bg-blue-50 px-3 py-2 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(testSeries.price)}
            </div>
            <div className="text-xs text-gray-500 text-right">Course Fee</div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight capitalize mb-3">
          {testSeries.title}
        </h3>
        
        {/* Description - More Prominent */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Description</div>
          <p className="text-gray-700 leading-snug line-clamp-2">
            {testSeries.description.short}
          </p>
        </div>
        
        {/* Course Details Grid */}
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <MdQuiz className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Tests</div>
            <div className="text-sm font-bold text-gray-900">{testSeries.noOfTests} tests</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <MdDateRange className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Starting Date</div>
            <div className="text-sm font-bold text-gray-900">{formatDate(testSeries.startDate).split(' ').slice(0, 2).join(' ')}</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <BsShieldCheck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Validity</div>
            <div className="text-sm font-bold text-gray-900">{calculateValidity(testSeries.startDate, testSeries.endDate)}</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 float-end mb-3 pt-2 border-t border-gray-100">
          <Link href={`/exams/${exam.toLowerCase()}/test-series/${testSeries._id}`}>
            <button className="text-blue-600 border border-blue-600 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
              View Details
            </button>
          </Link>
          <EnrollButton
            type="testseries"
            itemId={testSeries._id}
            price={testSeries.price}
            title="Enroll Now"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-102 shadow-sm hover:shadow-md cursor-pointer"
          />
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
            {activeTab} Test Series
          </h2>
        </div>

        {/* Test Series Grid */}
        {filteredTestSeries.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTestSeries.map((testSeries, i) => (
              <TestSeriesCard key={i} testSeries={testSeries} />
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
      </div>
    </div>
  );
};

export default AllTestSeries;
