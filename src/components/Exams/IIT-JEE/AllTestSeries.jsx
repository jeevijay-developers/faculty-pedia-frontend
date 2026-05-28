'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdQuiz } from 'react-icons/md';
import { fetchTestSeriesBySpecialization } from '@/components/server/exams/iit-jee/routes';
import EnrollButton from '@/components/Common/EnrollButton';

const AllTestSeries = ({ exam = 'IIT-JEE' }) => {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchTestSeriesBySpecialization(exam, { limit: 100 });
        const list = response?.testSeries || response?.data?.testSeries || [];
        setTestSeries(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Error fetching test series:', err);
        setTestSeries([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [exam]);

  const subjects = useMemo(() => {
    const set = new Set();
    testSeries.forEach((ts) => {
      const sub = ts.subject;
      if (Array.isArray(sub)) sub.forEach((s) => s && set.add(s));
      else if (sub) set.add(sub);
    });
    return ['All', ...Array.from(set)];
  }, [testSeries]);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return testSeries;
    return testSeries.filter((ts) =>
      Array.isArray(ts.subject) ? ts.subject.includes(activeTab) : ts.subject === activeTab
    );
  }, [testSeries, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Subject Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-1">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`shrink-0 py-3 px-5 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === subject
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {activeTab === 'All' ? `${exam} Test Series` : `${activeTab} Test Series`}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} series found
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((ts) => (
              <TestSeriesCard key={ts._id || ts.id} testSeries={ts} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MdQuiz className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No test series found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No {activeTab !== 'All' ? activeTab : ''} test series available for {exam} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TestSeriesCard = ({ testSeries, exam }) => {
  const educatorName =
    testSeries.educatorId?.fullName ||
    testSeries.educatorId?.username ||
    testSeries.educatorName ||
    'Educator';

  const educatorImage =
    testSeries.educatorId?.profilePicture ||
    testSeries.educatorId?.image?.url ||
    '/images/placeholders/educatorFallback.svg';

  const testsCount = Array.isArray(testSeries.tests)
    ? testSeries.tests.length
    : testSeries.numberOfTests || testSeries.noOfTests || 0;

  const description =
    testSeries.description?.short ||
    testSeries.description?.long ||
    (typeof testSeries.description === 'string' ? testSeries.description : '') ||
    'Comprehensive test series for your exam preparation.';

  const validity = testSeries.validity
    ? new Date(testSeries.validity).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : testSeries.endDate
    ? new Date(testSeries.endDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const detailSlug = testSeries.slug || testSeries._id || testSeries.id;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden">
      {/* Educator header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={educatorImage}
            alt={educatorName}
            width={48}
            height={48}
            className="rounded-full object-cover border-2 border-blue-100"
            onError={(e) => { e.currentTarget.src = '/images/placeholders/educatorFallback.svg'; }}
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{educatorName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Array.isArray(testSeries.subject) ? testSeries.subject.join(', ') : testSeries.subject || ''}
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg text-right">
          <p className="text-lg font-bold text-blue-600">
            {testSeries.price === 0 ? 'Free' : `₹${(testSeries.price || 0).toLocaleString('en-IN')}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Course Fee</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {testSeries.title}
        </h3>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tests</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{testsCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {Array.isArray(testSeries.enrolledStudents) ? testSeries.enrolledStudents.length : 0}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
            <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{validity}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Link
            href={`/exams/${exam.toLowerCase()}/test-series/${detailSlug}`}
            className="flex-1 text-center text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            View Details
          </Link>
          <EnrollButton
            type="testseries"
            itemId={testSeries._id || testSeries.id}
            price={testSeries.price || 0}
            title="Enroll Now"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default AllTestSeries;
