"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CourseHeader from "./CourseHeader";
import ClassCard from "./ClassCard";
// import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import { getTestSeriesByCourse } from "@/components/server/test-series.route";
import {
  FaUsers,
  FaClock,
  FaCalendarAlt,
  FaChair,
  FaGraduationCap,
  FaWhatsapp,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { getCourseById } from "../server/course.routes";
import { getEducatorProfile } from "../server/educators.routes";
import CourseLoader from "../others/courseLoader";
import EnrollButton from "../Common/EnrollButton";
import { createItemReview } from "../server/reviews.routes";

const CourseDetails = ({ id }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCoursePanel, setShowCoursePanel] = useState(false);
  const [panelTab, setPanelTab] = useState("videos");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const coursePanelRef = useRef(null);

  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    let videoId = null;

    // youtu.be format
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    // youtube.com/watch format
    else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }
    // youtube.com/embed format (already correct)
    else if (url.includes("youtube.com/embed/")) {
      return url;
    }

    const embedUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : null;
    return embedUrl;
  };

  const getVimeoEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("player.vimeo.com/video/")) return url;
    const match = url.match(/vimeo\.com\/(?:video\/|manage\/videos\/)?([0-9]+)/);
    const id = match?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  };

  const getIntroEmbedUrl = (url) => {
    const yt = getYouTubeEmbedUrl(url);
    if (yt) return yt;
    return getVimeoEmbedUrl(url);
  };

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [courseTests, setCourseTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [educator, setEducator] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  const resolveAssetUrl = (asset) => {
    if (!asset) return null;
    const direct =
      asset.link || asset.url || asset.secure_url || asset.path || asset.fileUrl;
    if (direct) return direct;

    const publicId = asset.publicId || asset.public_id;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (publicId && cloudName) {
      const resourceType =
        (asset.resourceType || asset.resource_type || "raw").toLowerCase();
      const resTypePath = ["raw", "image", "video"].includes(resourceType)
        ? resourceType
        : "raw";
      const hasExtension = publicId.includes(".");
      const normalizedType = (asset.fileType || "pdf").toString().toLowerCase();
      const typeToExt = {
        pdf: "pdf",
        doc: "doc",
        docx: "docx",
        ppt: "ppt",
        pptx: "pptx",
        excel: "xlsx",
        xls: "xls",
        xlsx: "xlsx",
      };
      const extension = hasExtension
        ? ""
        : `.${typeToExt[normalizedType] || normalizedType}`;
      const normalizedId = publicId.startsWith("/")
        ? publicId.slice(1)
        : publicId;
      return `https://res.cloudinary.com/${cloudName}/${resTypePath}/upload/${normalizedId}${extension}`;
    }

    return null;
  };

  const groupedVideos = useMemo(() => {
    const groups = {};
    if (course?.videos && Array.isArray(course.videos)) {
      course.videos.forEach((video) => {
        const topic =
          (video?.topic || video?.subject || "General").trim() || "General";
        if (!groups[topic]) {
          groups[topic] = [];
        }
        groups[topic].push(video);
      });
    }
    return groups;
  }, [course?.videos]);

  const topics = useMemo(() => Object.keys(groupedVideos), [groupedVideos]);

  const hasTestSeries = useMemo(
    () => Array.isArray(courseTests) && courseTests.length > 0,
    [courseTests]
  );

  useEffect(() => {
    // Extract current student id from localStorage (browser only)
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("faculty-pedia-student-data");
        const parsed = raw ? JSON.parse(raw) : {};
        const idFromStorage = parsed?._id || parsed?.id;
        setStudentId(idFromStorage || null);
      } catch (err) {
        console.error("Error parsing student data from storage", err);
      }
    }

    setLoading(true);
    setError(null);

    const fetchCourseDetails = async () => {
      try {
        const data = await getCourseById(id);

        if (data) {
          setCourse(data);
          
          // Fetch educator details if educatorID exists
          if (data.educatorID) {
            try {
              const educatorId = typeof data.educatorID === 'object' ? data.educatorID._id : data.educatorID;
              const educatorResponse = await getEducatorProfile(educatorId);
              const educatorData = educatorResponse?.data?.educator || educatorResponse?.educator || educatorResponse;
              setEducator(educatorData);
            } catch (educatorError) {
              console.error("Error fetching educator:", educatorError);
            }
          }
        } else {
          setError("Course not found");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message || "Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!course || !studentId) {
      setIsEnrolled(false);
      return;
    }

    const matchesId = (val) => {
      if (!val) return false;
      const v = val.studentId || val._id || val.id || val;
      return v?.toString() === studentId?.toString();
    };

    const enrolledInCourse =
      (Array.isArray(course.enrolledStudents) &&
        course.enrolledStudents.some(matchesId)) ||
      (Array.isArray(course.purchase) && course.purchase.some(matchesId));

    setIsEnrolled(Boolean(enrolledInCourse));
  }, [course, studentId]);

  useEffect(() => {
    if (topics.length === 0) {
      if (selectedTopic !== "" || selectedVideo !== null) {
        setSelectedTopic("");
        setSelectedVideo(null);
      }
      return;
    }

    const nextTopic = topics.includes(selectedTopic)
      ? selectedTopic
      : topics[0];
    const nextVideo = groupedVideos[nextTopic]?.[0] || null;

    if (nextTopic !== selectedTopic) {
      setSelectedTopic(nextTopic);
    }
    if (nextVideo !== selectedVideo) {
      setSelectedVideo(nextVideo || null);
    }
  }, [topics, groupedVideos]);

  useEffect(() => {
    if (activeTab === "tests" && !hasTestSeries) {
      setActiveTab("overview");
    }
  }, [activeTab, hasTestSeries]);

  useEffect(() => {
    const courseId = course?._id || course?.id || id;
    if (!courseId) return;

    const initialSeries = Array.isArray(course?.testSeries)
      ? course.testSeries
      : [];

    if (initialSeries.length > 0) {
      setCourseTests(initialSeries);
      return;
    }

    let cancelled = false;
    const fetchCourseTests = async () => {
      setTestsLoading(true);
      try {
        const response = await getTestSeriesByCourse(courseId);
        const list =
          response?.testSeries || response?.data?.testSeries || response || [];
        if (!cancelled) {
          setCourseTests(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Error fetching course test series:", err);
        if (!cancelled) setCourseTests([]);
      } finally {
        if (!cancelled) setTestsLoading(false);
      }
    };

    fetchCourseTests();

    return () => {
      cancelled = true;
    };
  }, [course?.testSeries, course?._id, course?.id, id]);

  const assets = useMemo(() => {
    if (
      Array.isArray(course?.studyMaterials) &&
      course.studyMaterials.length > 0
    ) {
      return course.studyMaterials;
    }
    if (Array.isArray(course?.assetsLinks) && course.assetsLinks.length > 0) {
      return course.assetsLinks;
    }
    return [];
  }, [course?.studyMaterials, course?.assetsLinks]);

  if (loading) {
    return <CourseLoader />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Course not found.</p>
        </div>
      </div>
    );
  }

  const handleCourseReviewSubmit = async (event) => {
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
        itemId: course._id || course.id,
        itemType: "course",
        rating: Number(reviewRating),
        reviewText,
      });
      setReviewStatus("Review submitted successfully.");
      setReviewText("");
      setShowReviewSuccess(true);
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

  const handleCourseStarClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left <= rect.width / 2;
    const nextRating = index + (isLeftHalf ? 0.5 : 1);
    setReviewRating(nextRating);
  };

  const handleOpenCoursePanel = () => {
    const targetId = course?._id || course?.id || id;
    const query = targetId ? `?courseId=${targetId}` : "";
    router.push(`/course-panel${query}`);
  };

  const handleTopicChange = (value) => {
    setSelectedTopic(value);
    const firstVideo = groupedVideos[value]?.[0] || null;
    setSelectedVideo(firstVideo);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  // Determine course type
  const courseTypeValue = (course?.courseType || "").toString().toLowerCase();
  const isOneToOne = courseTypeValue === "one-to-one" || courseTypeValue === "oto";

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showReviewSuccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanks for your review!</h3>
            <p className="text-gray-600 mb-4">
              Your rating has been recorded and will appear on the educator profile.
            </p>
            <button
              type="button"
              onClick={() => setShowReviewSuccess(false)}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <CourseHeader course={course} />

      <div className="mt-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Overview
            </button>
            {/* <button
              onClick={() => setActiveTab("classes")}
              className={`${
                activeTab === "classes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Classes
            </button> */}
            {hasTestSeries && (
              <button
                onClick={() => setActiveTab("tests")}
                className={`${
                  activeTab === "tests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Test Series ({courseTests.length || 0})
              </button>
            )}
          </nav>
        </div>

        {/* Main Content with Sidebar */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Course Videos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Intro Video */}
                  {course.introVideo && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Course Introduction
                      </h3>
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                          src={getIntroEmbedUrl(course.introVideo)}
                          title="Course Introduction"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Demo Videos */}
                  {course.videos && course.videos.length > 0 && course.videos[0]?.links?.[0] && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Demo Video
                      </h3>
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                          src={getYouTubeEmbedUrl(course.videos[0].links[0])}
                          title={course.videos[0].title || "Course Demo"}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>

              
                {/* Course Objectives */}
                {course.courseObjectives &&
                  course.courseObjectives.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Course Feature
                      </h3>
                      <ul className="list-disc list-inside space-y-2">
                        {course.courseObjectives.map((objective, index) => (
                          <li key={index} className="text-gray-700">
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Prerequisites
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="text-gray-700">
                          {prerequisite}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Give Review and rate this Course
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Reviews are limited to enrolled students. Your feedback appears on the educator profile.
                  </p>
                  <form className="space-y-4" onSubmit={handleCourseReviewSubmit}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-sm font-medium text-gray-700">
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
                              onClick={(event) => handleCourseStarClick(index, event)}
                              disabled={!isEnrolled || isSubmittingReview}
                              className="p-1 disabled:cursor-not-allowed"
                              aria-label={`Set course rating to ${index + 1} star${index === 0 ? "" : "s"}`}
                            >
                              {icon}
                            </button>
                          );
                        })}
                        <span className="ml-2 text-sm text-gray-700">{reviewRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700" htmlFor="course-review-text">
                        Your Review
                      </label>
                      <textarea
                        id="course-review-text"
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        rows={4}
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Share what you liked and what could improve."
                        disabled={!isEnrolled || isSubmittingReview}
                        required
                      />
                    </div>
                    {reviewStatus && (
                      <p className="text-sm text-gray-700">{reviewStatus}</p>
                    )}
                    <button
                      type="submit"
                      className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm ${
                        isEnrolled
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isEnrolled || isSubmittingReview}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                    {!isEnrolled && (
                      <p className="text-sm text-red-600 font-medium">
                        Enroll in this course to submit a review.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            )}

            {activeTab === "classes" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Live Classes
                  </h3>
                  <p className="text-gray-600">
                    All scheduled live classes for this course
                  </p>
                </div>
                {course.liveClass && course.liveClass.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {course.liveClass.map((classItem, index) => (
                      <ClassCard
                        key={classItem._id || index}
                        classData={classItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No live classes scheduled yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tests" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Test Series
                  </h3>
                  <p className="text-gray-600">
                    Practice tests and assessments for this course
                  </p>
                </div>
                {!hasTestSeries && !testsLoading && (
                  <div className="text-center py-8 text-gray-500">
                    No test series assigned to this course yet.
                  </div>
                )}
                {testsLoading && (
                  <div className="text-center py-8 text-gray-500">
                    Loading test series...
                  </div>
                )}
                {hasTestSeries && (
                  <div className="space-y-4">
                    {courseTests.map((test, index) => {
                      const questionCount =
                        test.totalQuestions ||
                        test.noOfQuestions ||
                        test.numberOfQuestions ||
                        (Array.isArray(test.questions)
                          ? test.questions.length
                          : null);

                      return (
                        <div
                          key={test._id || test.id || index}
                          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {test.title || "Untitled Test Series"}
                              </h4>
                              {questionCount != null && (
                                <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                                  {questionCount} questions
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3">
                              {test.description || "No description provided."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {/* Course Price and Enroll */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    ₹{course.fees?.toLocaleString()}
                  </div>
                  {isEnrolled ? (
                    <button
                      onClick={handleOpenCoursePanel}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
                    >
                      Go to Course
                    </button>
                  ) : (
                    <EnrollButton
                      type="course"
                      itemId={course._id || course.id}
                      price={course.fees}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                    />
                  )}

                  {/* Course Stats */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm">
                      <span className="flex items-center mr-1 text-gray-600">
                        <FaClock className="w-4 h-4 mr-2" />  
                        <span>{course.courseDuration || "N/A"}</span>
                      </span>
                      <span className="text-gray-500">Course Duration</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="flex items-center mr-1 text-gray-600">
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        <span>{course.classesPerWeek || "N/A"}</span>
                      </span>
                      <span className="text-gray-500">Classes / Week</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="flex items-center mr-1 text-gray-600">
                        <FaClock className="w-4 h-4 mr-2" />
                        <span>{course.classDuration ? `${course.classDuration} min` : "N/A"}</span>
                      </span>
                      <span className="text-gray-500">Per Class Duration</span>
                    </div>
                    {course.classTiming && (
                      <div className="flex items-center text-sm">
                        <span className="flex items-center mr-1 text-gray-600">
                          <FaClock className="w-4 h-4 mr-2" />
                          <span>{course.classTiming}</span>
                        </span>
                        <span className="text-gray-500">Class Timing</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <span className="flex items-center  mr-1 text-gray-600">
                        <FaChair className="w-4 h-4 mr-2" />
                        <span>{course.enrolledStudents?.length || 0}</span>
                      </span>
                      <span className="text-gray-500">Enrolled</span>
                    </div>
                  </div>

                  {course.certificateAvailable && (
                    <div className="text-sm text-gray-600 mt-4 pt-3 border-t border-gray-200">
                      🎓 Certificate available upon completion
                    </div>
                  )}
                </div>
              </div>

              {/* Talk to Educator WhatsApp Button - now visible for both 'One to One' and 'One to All' course types */}
              {!isEnrolled && educator?.whatsappNumber && (
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-5 shadow-sm">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Worried about buying a course?
                    </p>
                    <a
                      href={`https://wa.me/${educator.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Talk to Educator
                    </a>
                    <p className="text-xs text-gray-500 mt-3">
                      Connect directly with the educator to clarify your doubts
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCoursePanel && isEnrolled && (
        <div
          ref={coursePanelRef}
          className="mt-10 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="border-b md:border-b-0 md:border-r bg-gray-50">
              <div className="flex md:flex-col">
                <button
                  onClick={() => setPanelTab("videos")}
                  className={`flex-1 px-4 py-3 text-left text-sm font-medium border-b md:border-b-0 md:border-b-transparent md:border-l-4 transition-colors ${
                    panelTab === "videos"
                      ? "bg-white text-blue-700 md:border-blue-600"
                      : "text-gray-600 hover:text-gray-900 md:border-transparent"
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setPanelTab("assets")}
                  className={`flex-1 px-4 py-3 text-left text-sm font-medium border-b md:border-b-0 md:border-l-4 transition-colors ${
                    panelTab === "assets"
                      ? "bg-white text-blue-700 md:border-blue-600"
                      : "text-gray-600 hover:text-gray-900 md:border-transparent"
                  }`}
                >
                  Assets
                </button>
              </div>
            </div>

            <div className="md:col-span-3 p-6 space-y-4">
              {panelTab === "videos" ? (
                topics.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No course videos available.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Course Videos
                        </h3>
                        <p className="text-sm text-gray-600">
                          Select a topic to browse its videos.
                        </p>
                      </div>
                      <select
                        value={selectedTopic}
                        onChange={(e) => handleTopicChange(e.target.value)}
                        className="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        {topics.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      <div className="lg:col-span-3">
                        {selectedVideo ? (
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                            <iframe
                              src={getYouTubeEmbedUrl(
                                selectedVideo.link || selectedVideo.url
                              )}
                              title={
                                selectedVideo.title ||
                                selectedVideo.name ||
                                "Course Video"
                              }
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="h-full min-h-60 flex items-center justify-center text-gray-500 border rounded-lg">
                            Select a video to start watching.
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-2 space-y-3">
                        <p className="text-sm font-semibold text-gray-800">
                          Videos in this topic
                        </p>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                          {groupedVideos[selectedTopic]?.map((video, idx) => {
                            const videoTitle =
                              video.title || video.name || `Video ${idx + 1}`;
                            return (
                              <button
                                key={`${selectedTopic}-${idx}-${videoTitle}`}
                                onClick={() => handleVideoSelect(video)}
                                className={`w-full text-left p-3 rounded-md border transition-colors ${
                                  selectedVideo === video
                                    ? "border-blue-200 bg-blue-50 text-blue-800"
                                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/60"
                                }`}
                              >
                                <p className="text-sm font-medium line-clamp-1">
                                  {videoTitle}
                                </p>
                                {video.topic && (
                                  <p className="text-xs text-gray-500 line-clamp-1">
                                    {video.topic}
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : assets.length === 0 ? (
                <div className="text-center text-gray-500">
                  No assets shared for this course yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Course Assets
                    </h3>
                    <p className="text-sm text-gray-600">
                      Downloadable resources shared by the instructor.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assets.map((asset, index) => {
                      const assetUrl = resolveAssetUrl(asset);
                      return (
                        <a
                          key={`${asset.title || asset.name || "asset"}-${index}`}
                          href={assetUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                            assetUrl
                              ? "border-gray-200 hover:border-blue-200 hover:bg-blue-50/60"
                              : "border-red-200 bg-red-50/50 text-red-600 cursor-not-allowed"
                          }`}
                          onClick={(e) => {
                            if (!assetUrl) e.preventDefault();
                          }}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {asset.title || asset.name || `Asset ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {asset.fileType || asset.type || asset.mimeType || "Resource"}
                            </p>
                            {!assetUrl && (
                              <p className="text-xs text-red-500 mt-1">
                                Missing file link. Please re-upload.
                              </p>
                            )}
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 10l5 5m0 0l5-5m-5 5V3"
                            />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
