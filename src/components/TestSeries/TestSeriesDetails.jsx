"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";

const TestSeriesDetails = ({ testSeriesData }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [isClient, setIsClient] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("faculty-pedia-student-data")
          : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?._id || parsed?.id;
      if (id) setStudentId(id);
    } catch (err) {
      console.warn("Failed to read student data", err);
    }
  }, []);

  const enrolledStudentIds = useMemo(() => {
    const list = testSeriesData?.enrolledStudents;
    if (!Array.isArray(list)) return [];
    return list
      .map((entry) => {
        if (typeof entry === "string") return entry;
        return (
          entry?.studentId ||
          entry?.studentID ||
          entry?.student?.id ||
          entry?.student?._id ||
          entry?._id ||
          entry?.id
        );
      })
      .filter(Boolean)
      .map((v) => v.toString());
  }, [testSeriesData?.enrolledStudents]);

  useEffect(() => {
    if (!studentId) return;
    setIsEnrolled(enrolledStudentIds.includes(studentId.toString()));
  }, [studentId, enrolledStudentIds]);

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

  const descriptionText = useMemo(() => {
    const desc = testSeriesData?.description;
    if (!desc) return "";
    if (typeof desc === "string") return desc;
    return desc.long || desc.short || "";
  }, [testSeriesData?.description]);

  // Get actual tests from the test series
  const actualTests = useMemo(() => {
    const series = testSeriesData?.testSeries || testSeriesData;
    if (Array.isArray(series?.tests) && series.tests.length > 0) {
      return series.tests;
    }
    if (Array.isArray(series?.liveTests) && series.liveTests.length > 0) {
      return series.liveTests;
    }
    return [];
  }, [testSeriesData]);

  const testsCount = useMemo(() => {
    const series = testSeriesData?.testSeries || testSeriesData;

    // Prefer actual array length when available
    if (Array.isArray(series?.tests) && series.tests.length > 0) {
      return series.tests.length;
    }
    if (Array.isArray(series?.liveTests) && series.liveTests.length > 0) {
      return series.liveTests.length;
    }

    // Fall back to numeric fields
    if (typeof series?.numberOfTests === "number") return series.numberOfTests;
    if (typeof series?.noOfTests === "number") return series.noOfTests;

    return 0;
  }, [testSeriesData?.testSeries, testSeriesData?.tests, testSeriesData?.liveTests, testSeriesData?.numberOfTests, testSeriesData?.noOfTests]);

  // Format validity date properly
  const formatValidity = (validity) => {
    if (!validity) return "12 Months";
    
    // If it's a number, assume it's months
    if (typeof validity === "number") {
      return `${validity} Months`;
    }
    
    // If it's a date string, calculate remaining time
    try {
      const validityDate = new Date(validity);
      const now = new Date();
      
      if (validityDate <= now) {
        return "Expired";
      }
      
      const diffTime = validityDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 365) {
        const years = Math.floor(diffDays / 365);
        return `${years}+ Year${years > 1 ? 's' : ''}`;
      } else if (diffDays > 30) {
        const months = Math.floor(diffDays / 30);
        return `${months} Month${months > 1 ? 's' : ''}`;
      } else {
        return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
      }
    } catch {
      return "12 Months";
    }
  };

  const handleEnrollmentSuccess = useCallback(
    async ({ alreadyEnrolled }) => {
      // Redirect only for independent test series
      if (testSeriesData?.courseId || testSeriesData?.isCourseSpecific) {
        return false;
      }

      const targetStudentId = studentId;
      const fallbackProfile = "/profile?tab=testseries";
      const profileUrl = targetStudentId
        ? `/profile/student/${targetStudentId}?tab=testseries`
        : fallbackProfile;

      // Ensure enrolled students see their dashboard tab
      router.push(profileUrl);
      return true; // Prevent default redirect in EnrollButton
    },
    [router, studentId, testSeriesData?.courseId, testSeriesData?.isCourseSpecific]
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a className="text-[#4e7597] text-sm font-medium hover:text-[#1E88E5] transition-colors" href="/">
          Home
        </a>
        <span className="text-[#4e7597] text-sm">/</span>
        <a className="text-[#4e7597] text-sm font-medium hover:text-[#1E88E5] transition-colors" href="/test-series">
          Test Series
        </a>
        <span className="text-[#4e7597] text-sm">/</span>
        <span className="text-[#1E88E5] text-sm font-medium">{testSeriesData.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-md h-80 mb-8 border border-[#e7eef3]">
            <div className="absolute inset-0 bg-linear-to-br from-[#1E88E5]/10 to-[#1E88E5]/5"></div>
            <div className="relative z-10 p-8 flex flex-col justify-center h-full">
              <div className="flex gap-2 mb-6">
                {testSeriesData.specialization && (
                  <span className="bg-[#1E88E5]/10 text-[#1E88E5] border border-[#1E88E5]/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {Array.isArray(testSeriesData.specialization) 
                      ? testSeriesData.specialization[0] 
                      : testSeriesData.specialization}
                  </span>
                )}
                {testSeriesData.subject && (
                  <span className="bg-[#1E88E5]/10 text-[#1E88E5] border border-[#1E88E5]/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {Array.isArray(testSeriesData.subject) 
                      ? testSeriesData.subject[0] 
                      : testSeriesData.subject}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 max-w-2xl text-[#0e151b]">
                {testSeriesData.title || "Test Series Title"}
              </h1>
              <p className="text-lg text-[#4e7597] max-w-xl">
                {descriptionText || "Master your exam preparation with comprehensive mock tests designed by expert faculty."}
              </p>
            </div>
            <div className="absolute -right-5 -bottom-5 opacity-[0.03]">
              <FaBookOpen className="text-[240px] text-[#0e151b]" />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* About Section */}
            <section>
              <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#1E88E5] rounded-full"></span>
                About this Test Series
              </h3>
              <p className="text-[#4e7597] leading-relaxed mb-6 text-lg whitespace-pre-line">
                {descriptionText || "No detailed description available."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-md shadow-sm border border-[#e7eef3]">
                  <FaFileAlt className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-[#4e7597] uppercase font-bold tracking-tight">Total Tests</p>
                  <p className="text-lg font-bold">{testsCount} Full Length</p>
                </div>
                <div className="bg-white p-5 rounded-md shadow-sm border border-[#e7eef3]">
                  <FaChartLine className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-[#4e7597] uppercase font-bold tracking-tight">Analytics</p>
                  <p className="text-lg font-bold">Detailed</p>
                </div>
                <div className="bg-white p-5 rounded-md shadow-sm border border-[#e7eef3]">
                  <FaClock className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-[#4e7597] uppercase font-bold tracking-tight">Validity</p>
                  <p className="text-lg font-bold">{formatValidity(testSeriesData.validity)}</p>
                </div>
                <div className="bg-white p-5 rounded-md shadow-sm border border-[#e7eef3]">
                  <FaTrophy className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-[#4e7597] uppercase font-bold tracking-tight">Ranking</p>
                  <p className="text-lg font-bold">All India</p>
                </div>
              </div>
            </section>

            {/* Tests Included Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#1E88E5] rounded-full"></span>
                  Tests Included
                </h3>
                <span className="text-sm font-bold text-[#1E88E5] px-3 py-1 bg-[#1E88E5]/5 rounded-md">
                  {testsCount} Modules
                </span>
              </div>
              <div className="space-y-3">
                {/* Render actual tests from backend */}
                {actualTests.length > 0 ? (
                  actualTests.map((test, index) => {
                    const testId = test?._id || test?.id || test;
                    const testTitle = test?.title || `Mock Test ${String(index + 1).padStart(2, '0')}`;
                    const testDuration = test?.duration || 180;
                    const testMarks = test?.overallMarks || test?.totalMarks || 300;
                    const isFirstTest = index === 0;
                    
                    return (
                      <div 
                        key={testId}
                        className={`bg-white p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-[#e7eef3] group hover:border-[#1E88E5]/30 transition-colors gap-4 ${!isEnrolled && !isFirstTest ? 'opacity-80' : ''}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`size-11 rounded-md flex items-center justify-center shrink-0 ${
                            isEnrolled || isFirstTest 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isEnrolled || isFirstTest ? (
                              <FaCheckCircle className="text-xl" />
                            ) : (
                              <FaFileAlt className="text-xl" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold group-hover:text-[#1E88E5] transition-colors">
                              {testTitle}
                            </h4>
                            <p className="text-sm text-[#4e7597]">
                              {testDuration} Mins • {testMarks} Marks
                              {isFirstTest && !isEnrolled && (
                                <span className="text-green-600 font-medium"> • Free Demo</span>
                              )}
                              {test?.negativeMarking && (
                                <span className="text-orange-500 font-medium"> • Negative Marking</span>
                              )}
                            </p>
                          </div>
                        </div>
                        {isEnrolled ? (
                          <button 
                            onClick={() => router.push(`/tests/${testId}`)}
                            className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-[#1565C0] transition-all w-full sm:w-auto"
                          >
                            Start Test
                          </button>
                        ) : isFirstTest ? (
                          <button 
                            className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-[#1565C0] transition-all w-full sm:w-auto"
                          >
                            Enroll to Access
                          </button>
                        ) : (
                          <button className="border-2 border-[#1E88E5] text-[#1E88E5] px-6 py-2 rounded-md text-sm font-bold hover:bg-[#1E88E5] hover:text-white transition-all w-full sm:w-auto">
                            Unlock Now
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Fallback placeholder tests when no actual tests are populated */
                  <>
                    <div className="bg-white p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-[#e7eef3] group hover:border-[#1E88E5]/30 transition-colors gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="size-11 rounded-md bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <FaCheckCircle className="text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold group-hover:text-[#1E88E5] transition-colors">
                            Mock Test 01: Complete Syllabus
                          </h4>
                          <p className="text-sm text-[#4e7597]">
                            180 Mins • 300 Marks • <span className="text-green-600 font-medium">Free Demo</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-[#1565C0] transition-all w-full sm:w-auto"
                        disabled={!isEnrolled}
                      >
                        {isEnrolled ? "Start Test" : "Enroll to Access"}
                      </button>
                    </div>

                    {testsCount > 1 && (
                      <>
                        {Array.from({ length: Math.min(testsCount - 1, 2) }).map((_, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-[#e7eef3] gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="size-11 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <FaFileAlt className="text-xl" />
                              </div>
                              <div>
                                <h4 className="font-bold">Mock Test {String(idx + 2).padStart(2, '0')}</h4>
                                <p className="text-sm text-[#4e7597]">180 Mins • 300 Marks</p>
                              </div>
                            </div>
                            {!isEnrolled ? (
                              <button className="border-2 border-[#1E88E5] text-[#1E88E5] px-6 py-2 rounded-md text-sm font-bold hover:bg-[#1E88E5] hover:text-white transition-all w-full sm:w-auto">
                                Unlock Now
                              </button>
                            ) : (
                              <button className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-[#1565C0] transition-all w-full sm:w-auto">
                                Start Test
                              </button>
                            )}
                          </div>
                        ))}

                        {testsCount > 3 && (
                          <div className="bg-white p-4 rounded-md flex items-center justify-between shadow-sm border border-[#e7eef3] opacity-60">
                            <div className="flex items-center gap-4">
                              <div className="size-11 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                                <FaFileAlt className="text-xl" />
                              </div>
                              <div>
                                <h4 className="font-bold">+{testsCount - 3} More Tests</h4>
                                <p className="text-sm text-[#4e7597]">Enroll to view all</p>
                              </div>
                            </div>
                            <span className="text-slate-400">•••</span>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Pricing Card */}
          <div
            data-aos="fade-left"
            className="bg-white rounded-md shadow-md overflow-hidden border border-[#e7eef3]"
          >
            <div 
              className="h-44 bg-center bg-cover bg-no-repeat" 
              style={{
                backgroundImage: testSeriesData.image?.url 
                  ? `url("${testSeriesData.image.url}")` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            ></div>
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-[#0e151b]">
                  ₹{testSeriesData.price?.toLocaleString() || 0}
                </span>
                {testSeriesData.originalPrice && testSeriesData.originalPrice > testSeriesData.price && (
                  <>
                    <span className="text-lg text-[#4e7597] line-through">
                      ₹{testSeriesData.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                      {Math.round(((testSeriesData.originalPrice - testSeriesData.price) / testSeriesData.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              {testSeriesData.endDate && (
                <p className="text-sm text-red-500 font-bold mb-6 flex items-center gap-1">
                  <FaClock className="text-sm" /> Valid till {formatDate(testSeriesData.endDate)}
                </p>
              )}

              <div className="space-y-3">
                <EnrollButton
                  type="testseries"
                  itemId={testSeriesData._id || testSeriesData.id}
                  price={testSeriesData.price}
                  title="Enroll Now"
                  joinLabel="Join Test Series"
                  initialEnrolled={isEnrolled}
                  onEnrollmentSuccess={handleEnrollmentSuccess}
                  className="w-full bg-[#1E88E5] text-white font-bold py-4 rounded-md shadow-md shadow-[#1E88E5]/20 hover:bg-[#1565C0] transition-all flex items-center justify-center gap-2"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-[#e7eef3]">
                <div className="flex items-center gap-2 text-sm text-[#4e7597]">
                  <FaUsers className="text-base" />
                  <span className="font-medium">
                    {testSeriesData.enrolledStudents?.length?.toLocaleString() || 0} Students enrolled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Educator Card */}
          {(testSeriesData.educator || testSeriesData.educatorId) && (
            <div
              data-aos="fade-left"
              data-aos-delay="100"
              className="bg-white p-6 rounded-md shadow-sm border border-[#e7eef3]"
            >
              {(() => {
                // Support both populated educator object and educatorId reference
                const educator = testSeriesData.educator || testSeriesData.educatorId;
                if (!educator || typeof educator === 'string') return null;
                
                // Handle image - check multiple possible field names
                const educatorImage = educator.image?.url || educator.profilePicture || educator.image || null;
                // Handle name - prefer fullName, fallback to firstName + lastName
                const educatorName = educator.fullName || `${educator.firstName || ''} ${educator.lastName || ''}`.trim() || educator.name || 'Expert Educator';
                // Handle qualification - could be array of objects or strings
                const educatorQualification = (Array.isArray(educator.qualification) && educator.qualification.length > 0)
                  ? (educator.qualification[0]?.title || educator.qualification[0])
                  : (Array.isArray(educator.specialization) && educator.specialization.length > 0)
                    ? educator.specialization[0]
                    : 'Expert Educator';
                const educatorBio = educator.bio || educator.description || "Experienced educator dedicated to helping students achieve their goals.";
                const educatorId = educator._id || educator.id;
                
                return (
                  <>
                    <h4 className="font-bold mb-5 text-[#0e151b] border-b border-[#e7eef3] pb-3">
                      Meet your Mentor
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="size-16 rounded-md bg-cover bg-center border border-[#e7eef3]"
                        style={{
                          backgroundImage: educatorImage 
                            ? `url("${educatorImage}")` 
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      ></div>
                      <div>
                        <p className="font-bold text-lg leading-tight">
                          {educatorName}
                        </p>
                        <p className="text-xs text-[#1E88E5] font-bold mt-1 uppercase tracking-tight">
                          {educatorQualification}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#4e7597] leading-relaxed mb-6 line-clamp-3">
                      {educatorBio}
                    </p>
                    {educatorId && (
                      <button 
                        onClick={() => router.push(`/educators/${educatorId}`)}
                        className="w-full border-2 border-[#e7eef3] py-2.5 rounded-md text-sm font-bold hover:bg-slate-50 transition-colors text-[#0e151b]"
                      >
                        View Profile
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Reviews Card */}
          <div
            data-aos="fade-left"
            data-aos-delay="150"
            className="bg-white p-6 rounded-md shadow-sm border border-[#e7eef3]"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-[#0e151b]">Student Reviews</h4>
              <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                <FaTrophy className="text-base mr-1" />
                <span className="text-sm font-bold">
                  {testSeriesData.rating ? Number(testSeriesData.rating).toFixed(1) : '5.0'}/5
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {/* Dynamic rating bars based on actual rating */}
              {(() => {
                const rating = Number(testSeriesData.rating) || 5;
                const ratingCount = testSeriesData.ratingCount || testSeriesData.enrolledStudents?.length || 0;
                
                // Generate approximate distribution based on average rating
                const getBarWidth = (star) => {
                  if (ratingCount === 0) return star === 5 ? 100 : 0;
                  const diff = Math.abs(star - rating);
                  if (diff < 0.5) return 85;
                  if (diff < 1) return 10;
                  if (diff < 1.5) return 3;
                  return 2;
                };
                
                return [5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-4">{star}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-yellow-500 h-full rounded-full transition-all" 
                        style={{ width: `${getBarWidth(star)}%` }}
                      ></div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div className="mt-6 pt-4 border-t border-[#e7eef3] text-center">
              <p className="text-[11px] text-[#4e7597] font-bold uppercase tracking-wider">
                Based on {testSeriesData.ratingCount || testSeriesData.enrolledStudents?.length || 0} verified reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesDetails;
