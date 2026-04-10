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
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import EnrollButton from "../Common/EnrollButton";
import { useRouter } from "next/navigation";
import { createItemReview, getItemReviews } from "../server/reviews.routes";

const TestSeriesDetails = ({ testSeriesData }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [isClient, setIsClient] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [itemReviews, setItemReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [hasTouchedReviewInput, setHasTouchedReviewInput] = useState(false);
  const router = useRouter();

  // Check if testSeriesData exists
  if (!testSeriesData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No test series data available</p>
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

  const resolveTestPanelPath = (testItem) => {
    const toSegment = (value) => {
      if (value === null || value === undefined) return null;

      let raw = String(value).trim();
      if (!raw) return null;

      // If backend sends a full url/path template, normalize to the last segment.
      if (/^https?:\/\//i.test(raw)) {
        try {
          raw = new URL(raw).pathname;
        } catch {
          // keep raw as-is
        }
      }

      raw = raw.replace(/^[#/]+|[/?#]+$/g, "");
      if (!raw) return null;

      const parts = raw.split("/").filter(Boolean);
      const segment = parts[parts.length - 1];

      if (!segment || segment.startsWith(":")) return null;
      if (segment.toLowerCase() === "tests" || segment.toLowerCase() === "test") {
        return null;
      }

      return segment;
    };

    const candidates = [
      testItem?.slug,
      testItem?.testSlug,
      testItem?.path,
      testItem?.url,
      testItem?._id,
      testItem?.id,
      testItem?.testId,
      testItem,
    ];

    for (const candidate of candidates) {
      const segment = toSegment(candidate);
      if (segment) {
        return `/test-panel/${encodeURIComponent(segment)}`;
      }
    }

    return null;
  };

  const handleTestSeriesReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isEnrolled) {
      setReviewStatus("Only enrolled students can submit a review.");
      return;
    }
    if (!studentId) {
      setReviewStatus("Please sign in to submit your review.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      setReviewStatus("");
      await createItemReview({
        studentId,
        itemId: testSeriesData?._id || testSeriesData?.id,
        itemType: "testSeries",
        rating: Number(reviewRating),
        reviewText,
      });
      setReviewStatus("Review submitted successfully.");
      setHasTouchedReviewInput(false);
      setShowReviewSuccess(true);

      // Pull latest reviews immediately so both form and sidebar stay in sync.
      if (itemId) {
        const response = await getItemReviews("testSeries", itemId, { limit: 100 });
        const latestReviews = Array.isArray(response?.data?.reviews)
          ? response.data.reviews
          : [];
        setItemReviews(latestReviews);
        setReviewsLoaded(true);
      }
    } catch (submitError) {
      const message =
        submitError?.response?.data?.message ||
        submitError?.message ||
        "Failed to submit review. Please try again.";
      setReviewStatus(message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleTestSeriesStarClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left <= rect.width / 2;
    const nextRating = index + (isLeftHalf ? 0.5 : 1);
    setHasTouchedReviewInput(true);
    setReviewRating(nextRating);
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

  const itemId = useMemo(
    () => testSeriesData?._id || testSeriesData?.id || null,
    [testSeriesData?._id, testSeriesData?.id]
  );

  const fetchItemReviewFeed = useCallback(async () => {
    if (!itemId) return;
    try {
      const response = await getItemReviews("testSeries", itemId, { limit: 100 });
      const latestReviews = Array.isArray(response?.data?.reviews)
        ? response.data.reviews
        : [];
      setItemReviews(latestReviews);
      setReviewsLoaded(true);
    } catch (error) {
      console.warn("Failed to fetch item reviews:", error);
    }
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;

    fetchItemReviewFeed();

    const intervalId = window.setInterval(() => {
      if (document.hidden) return;
      fetchItemReviewFeed();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [itemId, fetchItemReviewFeed]);

  useEffect(() => {
    if (!studentId || hasTouchedReviewInput) return;

    const reviewSource = reviewsLoaded
      ? itemReviews
      : Array.isArray(testSeriesData?.reviews)
      ? testSeriesData.reviews
      : [];

    const ownReview = reviewSource.find((review) => {
      const reviewStudentId =
        review?.student?._id ||
        review?.student?.id ||
        review?.student ||
        review?.studentId ||
        review?.studentID ||
        null;

      return reviewStudentId && String(reviewStudentId) === String(studentId);
    });

    if (!ownReview) return;

    const ownRating = Number(ownReview.rating);
    if (Number.isFinite(ownRating) && ownRating >= 0 && ownRating <= 5) {
      setReviewRating(ownRating);
    }

    if (typeof ownReview.reviewText === "string") {
      setReviewText(ownReview.reviewText);
    }
  }, [
    studentId,
    hasTouchedReviewInput,
    reviewsLoaded,
    itemReviews,
    testSeriesData?.reviews,
  ]);

  const reviewSummary = useMemo(() => {
    if (reviewsLoaded) {
      const count = itemReviews.length;
      const average = count
        ? itemReviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) / count
        : 0;

      return {
        average,
        count,
      };
    }

    const parsedRating = Number(testSeriesData?.rating);
    const hasValidRating = Number.isFinite(parsedRating) && parsedRating > 0;

    const parsedRatingCount = Number(testSeriesData?.ratingCount);
    let count = Number.isFinite(parsedRatingCount) && parsedRatingCount >= 0
      ? parsedRatingCount
      : null;

    if (count === null && Array.isArray(testSeriesData?.reviews)) {
      count = testSeriesData.reviews.length;
    }

    if (count === null) {
      count = hasValidRating ? 1 : 0;
    }

    const average = count > 0 && hasValidRating
      ? Math.min(5, Math.max(0, parsedRating))
      : 0;

    return {
      average,
      count,
    };
  }, [
    reviewsLoaded,
    itemReviews,
    testSeriesData?.rating,
    testSeriesData?.ratingCount,
    testSeriesData?.reviews,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 text-gray-900 dark:text-gray-100">
      {showReviewSuccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Thanks for your review!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your rating has been recorded and will appear on the educator profile.
            </p>
            <button
              type="button"
              onClick={() => setShowReviewSuccess(false)}
              className="inline-flex w-full justify-center rounded-md bg-[#1E88E5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1565C0]"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-[#1E88E5] transition-colors" href="/">
          Home
        </a>
        <span className="text-gray-600 dark:text-gray-300 text-sm">/</span>
        <a className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-[#1E88E5] transition-colors" href="/test-series">
          Test Series
        </a>
        <span className="text-gray-600 dark:text-gray-300 text-sm">/</span>
        <span className="text-[#1E88E5] text-sm font-medium">{testSeriesData.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-md h-80 mb-8 border border-gray-200 dark:border-gray-700">
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
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 max-w-2xl text-gray-900 dark:text-gray-100">
                {testSeriesData.title || "Test Series Title"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                {descriptionText || "Master your exam preparation with comprehensive mock tests designed by expert faculty."}
              </p>
            </div>
            <div className="absolute -right-5 -bottom-5 opacity-[0.03]">
              <FaBookOpen className="text-[240px] text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* About Section */}
            <section>
              <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#1E88E5] rounded-full"></span>
                About this Test Series
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg whitespace-pre-line">
                {descriptionText || "No detailed description available."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <FaFileAlt className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 uppercase font-bold tracking-tight">Total Tests</p>
                  <p className="text-lg font-bold">{testsCount} Full Length</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <FaChartLine className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 uppercase font-bold tracking-tight">Analytics</p>
                  <p className="text-lg font-bold">Detailed</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <FaClock className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 uppercase font-bold tracking-tight">Validity</p>
                  <p className="text-lg font-bold">{formatValidity(testSeriesData.validity)}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <FaTrophy className="text-[#1E88E5] mb-3 text-2xl" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 uppercase font-bold tracking-tight">Ranking</p>
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
                  {testsCount} Tests included
                </span>
              </div>
              <div className="space-y-3">
                {/* Render actual tests from backend */}
                {actualTests.length > 0 ? (
                  actualTests.map((test, index) => {
                    const testId = test?._id || test?.id || test;
                    const testPanelPath = resolveTestPanelPath(test);
                    const testTitle = test?.title || `Mock Test ${String(index + 1).padStart(2, '0')}`;
                    const testDuration = test?.duration || 180;
                    const testMarks = test?.overallMarks || test?.totalMarks || 300;
                    const isFirstTest = index === 0;
                    
                    return (
                      <div 
                        key={testId}
                        className={`bg-white dark:bg-gray-900 p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700 group hover:border-[#1E88E5]/30 transition-colors gap-4 ${!isEnrolled && !isFirstTest ? 'opacity-80' : ''}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`size-11 rounded-md flex items-center justify-center shrink-0 ${
                            isEnrolled || isFirstTest 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-slate-100 dark:bg-gray-800 text-slate-400'
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
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {testDuration} Mins | {testMarks} Marks
                              {isFirstTest && !isEnrolled && (
                                <span className="text-green-600 font-medium"> | Free Demo</span>
                              )}
                              {test?.negativeMarking && (
                                <span className="text-orange-500 font-medium"> | Negative Marking</span>
                              )}
                            </p>
                          </div>
                        </div>
                        {isEnrolled ? (
                          <button 
                            onClick={() => {
                              if (testPanelPath) {
                                router.push(testPanelPath);
                              }
                            }}
                            disabled={!testPanelPath}
                            className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-[#1565C0] disabled:opacity-60 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
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
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700 group hover:border-[#1E88E5]/30 transition-colors gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="size-11 rounded-md bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <FaCheckCircle className="text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold group-hover:text-[#1E88E5] transition-colors">
                            Mock Test 01: Complete Syllabus
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            180 Mins | 300 Marks | <span className="text-green-600 font-medium">Free Demo</span>
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
                          <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700 gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="size-11 rounded-md bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-400 shrink-0">
                                <FaFileAlt className="text-xl" />
                              </div>
                              <div>
                                <h4 className="font-bold">Mock Test {String(idx + 2).padStart(2, '0')}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">180 Mins | 300 Marks</p>
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
                          <div className="bg-white dark:bg-gray-900 p-4 rounded-md flex items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700 opacity-60">
                            <div className="flex items-center gap-4">
                              <div className="size-11 rounded-md bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-400">
                                <FaFileAlt className="text-xl" />
                              </div>
                              <div>
                                <h4 className="font-bold">+{testsCount - 3} More Tests</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Enroll to view all</p>
                              </div>
                            </div>
                            <span className="text-slate-400">...</span>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Give Review and rate this Test Series
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Reviews are limited to enrolled students and will appear on the educator profile.
              </p>
              <form className="space-y-4" onSubmit={handleTestSeriesReviewSubmit}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Tap to rate (half stars supported)
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const fillState = reviewRating - index;
                      const icon = fillState >= 1 ? (
                        <FaStar className="h-6 w-6 text-yellow-400" />
                      ) : fillState >= 0.5 ? (
                        <FaStarHalfAlt className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <FaStar className="h-6 w-6 text-gray-300" />
                      );
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={(event) => handleTestSeriesStarClick(index, event)}
                          disabled={!isEnrolled || isSubmittingReview}
                          className="p-1 disabled:cursor-not-allowed"
                          aria-label={`Set test series rating to ${index + 1} star${index === 0 ? "" : "s"}`}
                        >
                          {icon}
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{reviewRating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor="testseries-review-text">
                    Your Review
                  </label>
                  <textarea
                    id="testseries-review-text"
                    value={reviewText}
                    onChange={(event) => {
                      setHasTouchedReviewInput(true);
                      setReviewText(event.target.value);
                    }}
                    rows={4}
                    className="mt-2 w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm"
                    placeholder="Share your experience with this test series."
                    disabled={!isEnrolled || isSubmittingReview}
                    required
                  />
                </div>
                {reviewStatus && (
                  <p className="text-sm text-gray-900 dark:text-gray-100">{reviewStatus}</p>
                )}
                <button
                  type="submit"
                  className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm ${
                    isEnrolled
                      ? "bg-[#1E88E5] hover:bg-[#1565C0]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isEnrolled || isSubmittingReview}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
                {!isEnrolled && (
                  <p className="text-sm font-medium text-red-600">
                    Enroll in this test series to submit a review.
                  </p>
                )}
              </form>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Pricing Card */}
          <div
            data-aos="fade-left"
            className="bg-white dark:bg-gray-900 rounded-md shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
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
                <span className="text-3xl font-black text-gray-900 dark:text-gray-100">
                  &#8377;{testSeriesData.price?.toLocaleString() || 0}
                </span>
                {testSeriesData.originalPrice && testSeriesData.originalPrice > testSeriesData.price && (
                  <>
                    <span className="text-lg text-gray-600 dark:text-gray-300 line-through">
                      &#8377;{testSeriesData.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md">
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

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
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
              className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
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
                    <h4 className="font-bold mb-5 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                      Meet your Mentor
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="size-16 rounded-md bg-cover bg-center border border-gray-200 dark:border-gray-700"
                        style={{
                          backgroundImage: educatorImage 
                            ? `url("${educatorImage}")` 
                            : 'url("/images/educator/educatorFallback.svg")'
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
                      {educatorBio}
                    </p>
                    {educatorId && (
                      <button 
                        onClick={() => router.push(`/profile/educator/${educatorId}`)}
                        className="w-full border-2 border-gray-200 dark:border-gray-700 py-2.5 rounded-md text-sm font-bold hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
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
            className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Student Reviews</h4>
              <div className="flex items-center text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                <FaTrophy className="text-base mr-1" />
                <span className="text-sm font-bold">
                  {reviewSummary.average.toFixed(1)}/5
                </span>
              </div>
            </div>
            {reviewSummary.count === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  No reviews yet
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Be the first enrolled student to rate this test series.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Dynamic rating bars based on actual rating */}
                {(() => {
                  const rating = reviewSummary.average;

                  // Generate approximate distribution based on average rating
                  const getBarWidth = (star) => {
                    const diff = Math.abs(star - rating);
                    if (diff < 0.5) return 85;
                    if (diff < 1) return 10;
                    if (diff < 1.5) return 3;
                    return 0;
                  };

                  return [5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-4">{star}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full transition-all"
                          style={{ width: `${getBarWidth(star)}%` }}
                        ></div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-[11px] text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">
                Based on {reviewSummary.count} verified reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesDetails;

