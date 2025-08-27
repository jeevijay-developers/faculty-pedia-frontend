"use client";

import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTestBySlug } from '@/Data/Tests/test.data';

const TestSeriesDetailPage = ({ params }) => {
  const resolvedParams = React.use(params);
  const testSeries = getTestBySlug(resolvedParams.slug);

  if (!testSeries) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Side - Educator Info */}
            <div className="lg:w-1/3">
              {/* Educator Photo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600">
                  <Image
                    src={testSeries.educatorPhoto}
                    alt={testSeries.educatorName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Educator Intro Video */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Meet Your Educator</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={testSeries.introVideo}
                    title="Educator Introduction"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Side - Test Series Info */}
            <div className="lg:w-2/3">
              {/* Test Series Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {testSeries.title}
              </h1>

              {/* About Test Series Video */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Test Series</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={testSeries.aboutVideo}
                    title="About Test Series"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Educator Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Educator</h4>
                  <p className="text-xl font-semibold text-blue-600">{testSeries.educatorName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Qualification</h4>
                  <p className="text-lg text-gray-900">{testSeries.qualification}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Experience</h4>
                  <p className="text-lg text-gray-900">{testSeries.workExperience} experience</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Subject</h4>
                  <p className="text-lg text-gray-900">{testSeries.subject}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Series Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Syllabus */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Syllabus</h2>
              <ul className="space-y-3">
                {testSeries.syllabus.map((topic, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-lg">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Series Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Total Tests:</span>
                  <span className="text-lg font-semibold text-gray-900">{testSeries.noOfTests}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Specialization:</span>
                  <span className="text-lg font-semibold text-blue-600">{testSeries.specialization}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Starting Date:</span>
                  <span className="text-lg font-semibold text-gray-900">{testSeries.startingDate}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Validity:</span>
                  <span className="text-lg font-semibold text-gray-900">{testSeries.validity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{testSeries.fee.toLocaleString()}
                </div>
                <p className="text-gray-600">Complete Test Series</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tests Included:</span>
                  <span className="font-semibold text-gray-900">{testSeries.noOfTests}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Validity:</span>
                  <span className="font-semibold text-gray-900">{testSeries.validity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Access:</span>
                  <span className="font-semibold text-gray-900">Unlimited</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 mb-4">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesDetailPage;