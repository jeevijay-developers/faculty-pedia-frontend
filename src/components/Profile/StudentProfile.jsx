"use client";

import { useState, useEffect } from "react";
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
  FiTarget,
  FiStar,
} from "react-icons/fi";
import { getCoursesByIds } from "../server/course.routes";
import { getTestSeriesById } from "../server/test-series.route"; // Individual test series helper
import { getResultById } from "../server/result.routes"; // Individual result helper
import { updateStudentProfile } from "../server/student/student.routes"; // For profile updates
import EditProfileModal from "./EditProfileModal";

const StudentProfile = ({
  studentData,
  loading = false,
  error = null,
  onRefresh,
  isOwnProfile = false,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Normalize student object early (prevents TDZ when referenced inside hooks)
  const student = studentData?.student || studentData;
  const {
    name,
    email,
    mobileNumber,
    profileImage,
    courses = [],
    followingEducators = [],
    tests = [], // expected to include testSeriesId | seriesId
    results = [], // expected to include seriesId referencing test series
  } = student || {};

  // Courses state
  const [resolvedCourses, setResolvedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // Test series enrichment state
  const [resolvedSeriesMap, setResolvedSeriesMap] = useState({}); // { [seriesId]: seriesObject }
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesError, setSeriesError] = useState(null);

  // Results enrichment state
  const [resolvedResultsMap, setResolvedResultsMap] = useState({}); // { [resultId]: resultObject }
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // Handle profile save
  const handleProfileSave = async (formData) => {
    try {
      const studentId = student?._id;
      if (!studentId) {
        throw new Error("Student ID not found");
      }

      const result = await updateStudentProfile(studentId, formData);
      
      // Update localStorage with new student data (same as login)
      if (result && result.student) {
        localStorage.setItem(
          "faculty-pedia-student-data",
          JSON.stringify(result.student)
        );
      }
      
      // Trigger refresh to get updated data
      if (onRefresh) {
        await onRefresh();
      }
      
      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    // If courses are strings/ObjectIds (not populated objects), fetch them.
    // Otherwise just mirror them into resolvedCourses.
    const needFetch = Array.isArray(courses) && courses.some(c => typeof c === 'string' || (c && !c.title));
    if (!needFetch) {
      setResolvedCourses(Array.isArray(courses) ? courses : []);
      return;
    }
    let isCancelled = false;
    (async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const ids = courses.map(c => typeof c === 'string' ? c : c._id).filter(Boolean);
        const fetched = await getCoursesByIds(ids);
        if (!isCancelled) {
          setResolvedCourses(fetched);
        }
      } catch (err) {
        if (!isCancelled) setCoursesError('Failed to load course details');
      } finally {
        if (!isCancelled) setCoursesLoading(false);
      }
    })();
    return () => { isCancelled = true; };
  }, [JSON.stringify(courses)]);

  // Helper: resolve a series object from map by id, gracefully handling absent IDs.
  const getSeries = (id) => {
    // If id is already a populated object with title, return it directly
    if (id && typeof id === 'object' && id.title) {
      return id;
    }
    
    // Handle both string IDs and object references
    const seriesId = typeof id === 'string' ? id : id?._id || id;
    return (seriesId && resolvedSeriesMap[seriesId]) ? resolvedSeriesMap[seriesId] : null;
  };

  // Helper: get series ID from test object
  const getSeriesId = (test) => {
    const seriesId = typeof test?.testSeriesId === 'string' 
      ? test.testSeriesId 
      : test?.testSeriesId?._id || test?.testSeriesId;
    return seriesId;
  };

  // Helper: resolve a result object from map by id, gracefully handling absent IDs.
  const getResult = (id) => {
    // Handle both string IDs and object references
    const resultId = typeof id === 'string' ? id : id?._id || id;
    return (resultId && resolvedResultsMap[resultId]) ? resolvedResultsMap[resultId] : null;
  };

  // Helper: get result ID from result object or string
  const getResultId = (result) => {
    const resultId = typeof result === 'string' 
      ? result 
      : result?._id || result?.id;
    return resultId;
  };

  // Resolve test series metadata by fetching each testSeriesId from tests array individually.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setSeriesLoading(true);
        setSeriesError(null);
        
        // Extract testSeriesId from tests array - each test has { testSeriesId: mongoDbId, ... }
        const seriesIds = new Set();
        tests.forEach(test => {
          const seriesId = typeof test?.testSeriesId === 'string' 
            ? test.testSeriesId 
            : test?.testSeriesId?._id || test?.testSeriesId;
          if (seriesId && !resolvedSeriesMap[seriesId]) {
            seriesIds.add(seriesId);
          }
        });
        
        // Also check results array for any additional series references
        results.forEach(result => {
          // Handle both populated objects and IDs
          const seriesRef = result?.seriesId || result?.testSeriesId;
          const seriesId = typeof seriesRef === 'string' 
            ? seriesRef 
            : seriesRef?._id;
          
          if (seriesId && !resolvedSeriesMap[seriesId]) {
            seriesIds.add(seriesId);
          }
        });

        if (seriesIds.size === 0) {
          setSeriesLoading(false);
          return;
        }

        // Fetch each series individually using getTestSeriesById
        const fetchedPairs = await Promise.all(Array.from(seriesIds).map(async seriesId => {
          try {
            const data = await getTestSeriesById(seriesId);
            const seriesObj = data?.testSeries || data?.data || data;
            return [seriesObj?._id || seriesId, seriesObj];
          } catch (e) {
            console.warn(`Failed to fetch test series ${seriesId}:`, e);
            return [seriesId, { _id: seriesId, title: 'Series unavailable', error: true }];
          }
        }));
        
        if (!cancelled) {
          setResolvedSeriesMap(prev => {
            const next = { ...prev };
            fetchedPairs.forEach(([id, obj]) => { if (id) next[id] = obj; });
            return next;
          });
        }
      } catch (e) {
        if (!cancelled) setSeriesError('Failed to resolve test series');
      } finally {
        if (!cancelled) setSeriesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [JSON.stringify(tests), JSON.stringify(results)]);

  // Resolve result details by fetching each result ID from results array individually.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setResultsLoading(true);
        setResultsError(null);
        
        // Extract result IDs from results array - each result can be string ID or object with _id
        const resultIds = new Set();
        results.forEach(result => {
          const resultId = getResultId(result);
          if (resultId && !resolvedResultsMap[resultId]) {
            resultIds.add(resultId);
          }
        });

        if (resultIds.size === 0) {
          setResultsLoading(false);
          return;
        }

        // Fetch each result individually using getResultById
        const fetchedPairs = await Promise.all(Array.from(resultIds).map(async resultId => {
          try {
            const data = await getResultById(resultId);
            const resultObj = data?.result || data?.data || data;
            return [resultObj?._id || resultId, resultObj];
          } catch (e) {
            console.warn(`Failed to fetch result ${resultId}:`, e);
            return [resultId, { _id: resultId, error: true }];
          }
        }));
        
        if (!cancelled) {
          setResolvedResultsMap(prev => {
            const next = { ...prev };
            fetchedPairs.forEach(([id, obj]) => { if (id) next[id] = obj; });
            return next;
          });
        }
      } catch (e) {
        if (!cancelled) setResultsError('Failed to resolve test results');
      } finally {
        if (!cancelled) setResultsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [JSON.stringify(results)]);

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

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "courses", label: "Courses", icon: FiBookOpen },
    { id: "results", label: "Test Results", icon: FiAward },
    { id: "educators", label: "Following", icon: FiUsers },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Recent Tests
            </h3>
            {tests.length > 5 && (
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
          {tests.length > 0 ? (
            <div className="space-y-4">
              {tests.slice(0, 5).map((test, index) => {
                const seriesId = getSeriesId(test);
                const series = getSeries(seriesId);
                
                return (
                  <div
                    key={test._id || index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                        <FiAward className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        {(() => {
                          const title = series?.title || `Test Series #${seriesId || "N/A"}`;
                          const slug = series?.slug;
                          return slug ? (
                            <Link href={`/live-test/series/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline" title={title}>
                              {title}
                            </Link>
                          ) : (
                            <p className="text-sm font-semibold text-gray-900" title={title}>{title}</p>
                          );
                        })()}
                        {series && (
                          <div className="mt-1 flex items-center gap-2">
                            {series.subject && <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-medium uppercase tracking-wide">{series.subject}</span>}
                            {series.specialization && <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium uppercase tracking-wide">{series.specialization}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {series?.noOfTests ? `${series.noOfTests} Tests` : "Test Series"}
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        {series?.price && (
                          <span className="text-green-600 font-medium">
                            ₹{series.price}
                          </span>
                        )}
                        {test.status && (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            test.status === 'completed' ? 'bg-green-100 text-green-700' :
                            test.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {test.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiAward className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No tests enrolled yet</p>
              <p className="text-sm text-gray-400 mt-1">Enroll in test series to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Enrolled Courses
        </h3>
        {coursesLoading && <span className="text-xs text-gray-500 animate-pulse">Loading...</span>}
      </div>
      <div className="p-6">
        {coursesError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {coursesError}
          </div>
        )}
        {resolvedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolvedCourses.map((course, index) => (
              <div
                key={course?._id || index}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
              >
                {course?.image?.url && (
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
                  <h4 className="font-semibold text-gray-900 text-lg leading-tight truncate" title={course?.title}>
                    {course?.title || "Course Title"}
                  </h4>
                  <div className="flex items-center flex-wrap gap-2 text-sm">
                    {course?.specialization && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {course.specialization}
                      </span>
                    )}
                    {course?.courseClass && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                        Class {course.courseClass}
                      </span>
                    )}
                  </div>
                  {course?.subject && (
                    <p className="text-sm text-gray-600 capitalize">
                      {course.subject}
                    </p>
                  )}
                  {course?.slug && (
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
          !coursesLoading && (
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
          )
        )}
        {coursesLoading && resolvedCourses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 animate-pulse space-y-4">
                <div className="w-full h-40 bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Test Results</h3>
        <div className="flex items-center gap-4">
          {seriesLoading && <span className="text-xs text-gray-500 animate-pulse">Loading series...</span>}
          {resultsLoading && <span className="text-xs text-gray-500 animate-pulse">Loading results...</span>}
        </div>
      </div>
      {(seriesError || resultsError) && (
        <div className="mx-6 mt-4 mb-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-700">
          {seriesError && <div>Series: {seriesError}</div>}
          {resultsError && <div>Results: {resultsError}</div>}
        </div>
      )}
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
                  // Get the enriched result data
                  const resultId = getResultId(result);
                  const resolvedResult = getResult(resultId) || result;
                  const percentage = resolvedResult.totalScore ? 
                    ((resolvedResult.obtainedScore / resolvedResult.totalScore) * 100).toFixed(1) : 0;
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
                              {resolvedResult.testId?.title || resolvedResult.testTitle || `Test #${resolvedResult.testId?._id || resolvedResult.testId || index + 1}`}
                            </p>
                            {(() => {
                              const series = getSeries(resolvedResult.seriesId);
                              const title = series?.title || resolvedResult.seriesId?.title || `Series #${resolvedResult.seriesId?._id || resolvedResult.seriesId || "N/A"}`;
                              const slug = series?.slug || resolvedResult.seriesId?.slug;
                              return slug ? (
                                <Link href={`/live-test/series/${slug}`} className="text-xs text-blue-600 hover:underline" title={title}>
                                  {title}
                                </Link>
                              ) : (
                                <p className="text-xs text-gray-500" title={title}>{title}</p>
                              );
                            })()}
                            {(() => {
                              const series = getSeries(resolvedResult.seriesId);
                              if (!series) return null;
                              return (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {series.subject && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">{series.subject}</span>}
                                  {series.specialization && <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium">{series.specialization}</span>}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {resolvedResult.obtainedScore || 0}/{resolvedResult.totalScore || 0}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage}% scored
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {resolvedResult.totalCorrect || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {resolvedResult.totalIncorrect || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(resolvedResult.createdAt || resolvedResult.date || Date.now()).toLocaleDateString('en-US', {
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
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentData={student}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default StudentProfile;
