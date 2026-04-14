"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ClassCard from "./ClassCard";
import { getTestSeriesByCourse } from "@/components/server/test-series.route";
import {
  FaArrowLeft,
  FaPlay,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronRight,
  FaWhatsapp,
  FaBolt,
  FaShoppingCart,
  FaRupeeSign,
  FaCalendarAlt,
  FaUsers,
  FaBookOpen,
  FaVideo,
  FaFileAlt,
  FaQuestionCircle,
  FaCheckCircle,
  FaUserEdit,
  FaUserCircle,
  FaClock,
  FaChair,
  FaGraduationCap,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { getCourseById } from "../server/course.routes";
import { getEducatorProfile } from "../server/educators.routes";
import CourseLoader from "../others/courseLoader";
import EnrollButton from "../Common/EnrollButton";
import ShareButton from "@/components/Common/ShareButton";
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

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
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
  const [playIntro, setPlayIntro] = useState(false);

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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
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

  const courseTypeValue = (course?.courseType || "").toString().toLowerCase();
  const isOneToOne = courseTypeValue === "one-to-one" || courseTypeValue === "oto";
  const isOneToAll = courseTypeValue === "one-to-all" || courseTypeValue === "ota";
  const courseTypeLabel = isOneToAll ? "One to All" : isOneToOne ? "One to One" : "Course";

  const resolveEducator = () => {
    const candidates = [course?.educatorID, course?.educatorId, course?.educator];
    for (const cand of candidates) {
      if (!cand) continue;
      if (typeof cand === "string") {
        return { id: cand.trim(), name: course?.educatorName || "Instructor" };
      }
      if (typeof cand === "object") {
        const nestedId = cand._id || cand.id;
        const fullName =
          cand.fullName ||
          [cand.firstName, cand.lastName].filter(Boolean).join(" ").trim() ||
          cand.username || cand.name;
        return { id: nestedId || null, name: fullName || "Instructor" };
      }
    }
    return { id: null, name: "Instructor" };
  };

  const { id: educatorId, name: educatorName } = resolveEducator();

  const enrolledCount = course.enrolledStudents?.length || 0;
  const maxStudents = course.maxStudents || 0;
  const enrollPct = maxStudents ? Math.min(100, Math.round((enrolledCount / maxStudents) * 100)) : 0;

  const heroImage =
    course.image || course.courseThumbnail || "/images/placeholders/card-16x9.svg";

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch { return "N/A"; }
  };

  const ratingValue = Number(course.rating || course.averageRating || 0);
  const ratingCount = course.reviewsCount || course.totalReviews || (Array.isArray(course.reviews) ? course.reviews.length : 0);

  const renderStar = (index) => {
    const fillState = reviewRating - index;
    if (fillState >= 1) return <FaStar className="h-6 w-6 text-yellow-400" />;
    if (fillState >= 0.5) return <FaStarHalfAlt className="h-6 w-6 text-yellow-400" />;
    return <FaRegStar className="h-6 w-6 text-gray-300" />;
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen text-[#191c1e]">
      {showReviewSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanks for your review!</h3>
            <p className="text-gray-600 mb-4">
              Your rating has been recorded and will appear on the educator profile.
            </p>
            <button
              type="button"
              onClick={() => setShowReviewSuccess(false)}
              className="inline-flex w-full justify-center rounded-xl bg-[#0050cb] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#003fa4]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile / Small-screen Top App Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-4 h-16">
        <button
          onClick={() => router.back()}
          className="text-blue-700 active:scale-95 transition-transform duration-200 p-2"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="font-semibold tracking-tight text-slate-900">Course Details</h1>
        <ShareButton
          title={course?.title || "Course"}
          text={`Explore the course "${course?.title || ''}" on Facultypedia.`}
          useCurrentUrl
          variant="ghost"
          size="sm"
          className="text-blue-700 p-2!"
        />
      </header>

      <main className="pt-20 pb-36 px-4 space-y-8 max-w-7xl mx-auto lg:pt-8 lg:pb-10 lg:px-8">
        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0050cb] font-semibold hover:underline"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">Course Details</h1>
          <ShareButton
            title={course?.title || "Course"}
            text={`Explore the course "${course?.title || ''}" on Facultypedia.`}
            useCurrentUrl
            size="sm"
          />
        </div>

        {/* Desktop grid wrapper */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          {/* Left / main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl aspect-video shadow-xl group">
              <img
                alt={course.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                src={heroImage}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.specialization?.map((spec, idx) => (
                    <span
                      key={`spec-${idx}`}
                      className="bg-[#0066ff] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                    >
                      {spec}
                    </span>
                  ))}
                  {course.class?.map((cls, idx) => (
                    <span
                      key={`cls-${idx}`}
                      className="bg-[#6bff8f] text-[#007432] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                    >
                      {cls}
                    </span>
                  ))}
                  <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    {courseTypeLabel}
                  </span>
                </div>
                <h2 className="text-white font-bold leading-tight text-2xl lg:text-4xl">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="hidden lg:block text-white/80 text-sm mt-3 line-clamp-2 max-w-3xl">
                    {course.description}
                  </p>
                )}
              </div>
            </section>

            {/* Price / Enrollment */}
            <section className="flex items-end justify-between bg-white p-6 rounded-2xl shadow-sm">
              <div>
                <p className="text-[#424656] text-xs font-semibold mb-1">Total Fee</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0050cb]">
                    ₹{course.fees?.toLocaleString() || "0"}
                  </span>
                  {course.discount > 0 && (
                    <span className="text-[#424656] line-through text-sm">
                      ₹{Math.round((course.fees || 0) / (1 - course.discount / 100)).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {isOneToAll && (
                  <>
                    <div className="w-32 h-2 bg-[#eceef0] rounded-full mb-2 overflow-hidden">
                      <div
                        className="h-full bg-[#006e2f]"
                        style={{ width: `${enrollPct}%` }}
                      />
                    </div>
                    <p className="text-xs font-medium text-[#006e2f]">
                      {enrolledCount}/{maxStudents || 0} students enrolled
                    </p>
                  </>
                )}
                {!isOneToAll && (
                  <p className="text-xs font-medium text-[#006e2f]">
                    {enrolledCount} enrolled
                  </p>
                )}
              </div>
            </section>

            {/* Quick Info Bento */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f2f4f6] p-4 rounded-xl flex flex-col gap-3">
                <FaRupeeSign className="text-[#0050cb] text-xl" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#424656] tracking-wider">Course Fee</p>
                  <p className="font-bold text-sm">₹{course.fees?.toLocaleString() || 0} One-time</p>
                </div>
              </div>
              <div className="bg-[#f2f4f6] p-4 rounded-xl flex flex-col gap-3">
                <FaCalendarAlt className="text-[#954000] text-xl" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#424656] tracking-wider">Timeline</p>
                  <p className="font-bold text-sm">{course.courseDuration || `${formatDate(course.startDate)} - ${formatDate(course.endDate)}`}</p>
                </div>
              </div>
              <div className="bg-[#f2f4f6] p-4 rounded-xl flex flex-col gap-3">
                <FaUsers className="text-[#006e2f] text-xl" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#424656] tracking-wider">Enrollment</p>
                  <p className="font-bold text-sm">{isOneToAll ? `${enrolledCount}/${maxStudents}` : "Open Now"}</p>
                </div>
              </div>
              <div className="bg-[#f2f4f6] p-4 rounded-xl flex flex-col gap-3">
                <FaBookOpen className="text-[#0050cb] text-xl" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#424656] tracking-wider">Subject</p>
                  <p className="font-bold text-sm">
                    {Array.isArray(course.subject) ? course.subject.join(", ") : course.subject || "N/A"}
                  </p>
                </div>
              </div>
            </section>

            {/* Sticky Tabs */}
            <nav className="flex gap-6 overflow-x-auto hide-scrollbar border-b border-[#c2c6d8]/30 sticky top-16 lg:top-0 bg-[#f7f9fb]/80 backdrop-blur-md z-40 py-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${activeTab === "overview" ? "text-[#0050cb] font-bold border-b-2 border-[#0050cb]" : "text-[#424656] font-medium"} text-sm whitespace-nowrap pb-2`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`${activeTab === "features" ? "text-[#0050cb] font-bold border-b-2 border-[#0050cb]" : "text-[#424656] font-medium"} text-sm whitespace-nowrap pb-2`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab("prerequisites")}
                className={`${activeTab === "prerequisites" ? "text-[#0050cb] font-bold border-b-2 border-[#0050cb]" : "text-[#424656] font-medium"} text-sm whitespace-nowrap pb-2`}
              >
                Prerequisites
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`${activeTab === "reviews" ? "text-[#0050cb] font-bold border-b-2 border-[#0050cb]" : "text-[#424656] font-medium"} text-sm whitespace-nowrap pb-2`}
              >
                Reviews
              </button>
              {hasTestSeries && (
                <button
                  onClick={() => setActiveTab("tests")}
                  className={`${activeTab === "tests" ? "text-[#0050cb] font-bold border-b-2 border-[#0050cb]" : "text-[#424656] font-medium"} text-sm whitespace-nowrap pb-2`}
                >
                  Test Series ({courseTests.length})
                </button>
              )}
              {course?.liveClass?.length > 0 && (
                <button
                  onClick={() => setActiveTab("classes")}
                  className={`${activeTab === "classes" ? "text-[#0050cb] font-bold border-b-2 border-[#0050cb]" : "text-[#424656] font-medium"} text-sm whitespace-nowrap pb-2`}
                >
                  Classes
                </button>
              )}
            </nav>

            {/* Tab content */}
            {activeTab === "overview" && (
              <>
                {/* Course Introduction Video */}
                {course.introVideo && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold">Course Introduction</h3>
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg group cursor-pointer bg-black">
                      {playIntro ? (
                        <iframe
                          src={getIntroEmbedUrl(course.introVideo)}
                          title="Course Introduction"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPlayIntro(true)}
                          className="absolute inset-0 w-full h-full"
                        >
                          <img
                            alt="Course intro"
                            className="w-full h-full object-cover"
                            src={heroImage}
                          />
                          <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                            <div className="bg-white/90 p-5 rounded-full shadow-2xl active:scale-90 transition-transform">
                              <FaPlay className="text-[#0050cb] text-3xl ml-1" />
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </section>
                )}

                {/* Demo Video */}
                {course.videos && course.videos.length > 0 && course.videos[0]?.links?.[0] && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold">Demo Video</h3>
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(course.videos[0].links[0])}
                        title={course.videos[0].title || "Course Demo"}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </section>
                )}

                {course.description && (
                  <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                    <h3 className="text-lg font-bold">About this course</h3>
                    <p className="text-sm text-[#424656] leading-relaxed whitespace-pre-line">
                      {course.description}
                    </p>
                  </section>
                )}
              </>
            )}

            {activeTab === "features" && (
              <section className="bg-white rounded-2xl p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold">Core Features</h3>
                {course.courseObjectives && course.courseObjectives.length > 0 ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {course.courseObjectives.map((objective, index) => {
                      const palette = [
                        { bg: "bg-[#006e2f]/10", color: "text-[#006e2f]", Icon: FaVideo },
                        { bg: "bg-[#0050cb]/10", color: "text-[#0050cb]", Icon: FaFileAlt },
                        { bg: "bg-[#954000]/10", color: "text-[#954000]", Icon: FaQuestionCircle },
                      ];
                      const p = palette[index % palette.length];
                      const Icon = p.Icon;
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`${p.bg} p-3 rounded-lg`}>
                            <Icon className={`${p.color} text-base`} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{objective}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#424656]">No features listed yet.</p>
                )}
              </section>
            )}

            {activeTab === "prerequisites" && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Prerequisites</h3>
                {course.prerequisites && course.prerequisites.length > 0 ? (
                  <div className="space-y-3">
                    {course.prerequisites.map((prerequisite, index) => (
                      <div
                        key={index}
                        className="bg-[#bc5200]/5 border-l-4 border-[#954000] p-4 rounded-r-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <FaCheckCircle className="text-[#954000]" />
                          <p className="text-sm font-medium text-[#783200]">
                            {prerequisite}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 text-sm text-[#424656]">
                    No specific prerequisites for this course.
                  </div>
                )}
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Reviews</h3>
                  <div className="flex items-center gap-1 bg-[#006e2f]/10 px-3 py-1 rounded-full">
                    <FaStar className="text-[#006e2f] text-xs" />
                    <span className="text-sm font-bold text-[#006e2f]">
                      {ratingValue ? ratingValue.toFixed(1) : "—"} ({ratingCount})
                    </span>
                  </div>
                </div>

                <form
                  className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
                  onSubmit={handleCourseReviewSubmit}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c2c6d8] flex items-center justify-center">
                      <FaUserCircle className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Write a public review</p>
                      <p className="text-xs text-[#424656]">
                        Reviews are limited to enrolled students.
                      </p>
                    </div>
                    <FaUserEdit className="text-[#424656]" />
                  </div>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(event) => handleCourseStarClick(index, event)}
                        disabled={!isEnrolled || isSubmittingReview}
                        className="p-1 disabled:cursor-not-allowed"
                        aria-label={`Set course rating to ${index + 1}`}
                      >
                        {renderStar(index)}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-[#424656]">{reviewRating.toFixed(1)}</span>
                  </div>

                  <textarea
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-[#c2c6d8] bg-white px-4 py-3 text-sm outline-none focus:border-[#0050cb]"
                    placeholder="Share what you liked and what could improve."
                    disabled={!isEnrolled || isSubmittingReview}
                    required
                  />

                  {reviewStatus && (
                    <p className="text-sm text-[#424656]">{reviewStatus}</p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="submit"
                      className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm ${
                        isEnrolled ? "bg-[#0050cb] hover:bg-[#003fa4]" : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isEnrolled || isSubmittingReview}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                    {!isEnrolled && (
                      <p className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        Enroll to submit a review.
                      </p>
                    )}
                  </div>
                </form>
              </section>
            )}

            {activeTab === "classes" && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Live Classes</h3>
                {course.liveClass && course.liveClass.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {course.liveClass.map((classItem, index) => (
                      <ClassCard key={classItem._id || index} classData={classItem} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 text-center text-[#424656]">
                    No live classes scheduled yet.
                  </div>
                )}
              </section>
            )}

            {activeTab === "tests" && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Test Series</h3>
                {testsLoading && (
                  <div className="bg-white rounded-2xl p-6 text-center text-[#424656]">
                    Loading test series...
                  </div>
                )}
                {!testsLoading && !hasTestSeries && (
                  <div className="bg-white rounded-2xl p-6 text-center text-[#424656]">
                    No test series assigned to this course yet.
                  </div>
                )}
                {hasTestSeries && (
                  <div className="space-y-3">
                    {courseTests.map((test, index) => {
                      const questionCount =
                        test.totalQuestions ||
                        test.noOfQuestions ||
                        test.numberOfQuestions ||
                        (Array.isArray(test.questions) ? test.questions.length : null);
                      return (
                        <div
                          key={test._id || test.id || index}
                          className="bg-white rounded-2xl p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-base font-bold line-clamp-2">
                              {test.title || "Untitled Test Series"}
                            </h4>
                            {questionCount != null && (
                              <span className="text-xs font-semibold text-[#0050cb] bg-[#0050cb]/10 px-3 py-1 rounded-full whitespace-nowrap">
                                {questionCount} Qs
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#424656] line-clamp-3 mt-2">
                            {test.description || "No description provided."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Instructor Card (always visible on overview) */}
            {activeTab === "overview" && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Primary Instructor</h3>
                <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                  <img
                    alt={educatorName}
                    className="w-16 h-16 rounded-xl object-cover bg-[#c2c6d8]"
                    src={
                      educator?.profileImage ||
                      educator?.profilePicture ||
                      educator?.image ||
                      "/images/placeholders/avatar.svg"
                    }
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholders/avatar.svg";
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-base truncate">{educatorName}</h4>
                    <p className="text-xs text-[#424656] mb-1">
                      {(() => {
                        const t = educator?.title;
                        const q = educator?.qualification;
                        const pick = (v) =>
                          typeof v === "string"
                            ? v
                            : v && typeof v === "object"
                            ? v.title || v.name || ""
                            : "";
                        return pick(t) || pick(q) || "Faculty";
                      })()}
                      {educator?.yearsOfExperience ? ` • ${educator.yearsOfExperience}+ Years Exp.` : ""}
                    </p>
                    {educator?.averageRating != null && (
                      <div className="flex items-center gap-1">
                        <FaStar className="text-[#954000] text-xs" />
                        <span className="text-xs font-bold">
                          {Number(educator.averageRating).toFixed(1)}/5 Rating
                        </span>
                      </div>
                    )}
                  </div>
                  {educatorId && (
                    <button
                      onClick={() => router.push(`/profile/educator/${educatorId}`)}
                      className="ml-auto bg-[#0050cb]/5 p-2 rounded-full text-[#0050cb]"
                      aria-label="View instructor"
                    >
                      <FaChevronRight />
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right column — desktop sticky sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-[#424656] text-xs font-semibold mb-1">Total Fee</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-[#0050cb]">
                    ₹{course.fees?.toLocaleString() || "0"}
                  </span>
                  {course.discount > 0 && (
                    <span className="text-xs font-medium text-[#006e2f]">
                      {course.discount}% off
                    </span>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    onClick={handleOpenCoursePanel}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-2xl h-14 shadow-lg font-bold text-sm tracking-wide active:scale-[0.98] transition-all"
                  >
                    <FaBolt />
                    Go to Course
                  </button>
                ) : (
                  <EnrollButton
                    type="course"
                    itemId={course._id || course.id}
                    price={course.fees}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-2xl h-14 shadow-lg font-bold text-sm tracking-wide active:scale-[0.98] transition-all"
                  />
                )}

                <div className="mt-5 pt-5 border-t border-[#c2c6d8]/30 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#424656]">
                      <FaClock /> Duration
                    </span>
                    <span className="font-semibold">{course.courseDuration || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#424656]">
                      <FaCalendarAlt /> Classes / Week
                    </span>
                    <span className="font-semibold">{course.classesPerWeek || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#424656]">
                      <FaClock /> Per Class
                    </span>
                    <span className="font-semibold">
                      {course.classDuration ? `${course.classDuration} min` : "N/A"}
                    </span>
                  </div>
                  {course.classTiming && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[#424656]">
                        <FaClock /> Timing
                      </span>
                      <span className="font-semibold">{course.classTiming}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#424656]">
                      <FaChair /> Enrolled
                    </span>
                    <span className="font-semibold">{enrolledCount}</span>
                  </div>
                  {course.certificateAvailable && (
                    <div className="flex items-center gap-2 text-xs text-[#424656] pt-2 border-t border-[#c2c6d8]/30">
                      <FaGraduationCap /> Certificate on completion
                    </div>
                  )}
                </div>
              </div>

              {!isEnrolled && educator?.whatsappNumber && (
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
                  <p className="text-sm text-[#424656] mb-3 text-center">
                    Worried about buying a course?
                  </p>
                  <a
                    href={`https://wa.me/${educator.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Talk to Educator
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobile WhatsApp CTA */}
        {!isEnrolled && educator?.whatsappNumber && (
          <section className="lg:hidden bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
            <p className="text-sm text-[#424656] mb-3 text-center">
              Worried about buying a course?
            </p>
            <a
              href={`https://wa.me/${educator.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold"
            >
              <FaWhatsapp className="w-5 h-5" />
              Talk to Educator
            </a>
          </section>
        )}
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-12px_40px_rgba(0,80,203,0.06)] flex justify-between items-center px-4 pt-4 pb-6">
        {isEnrolled ? (
          <button
            onClick={handleOpenCoursePanel}
            className="flex-1 flex items-center justify-center gap-2 bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-2xl h-14 mx-2 shadow-lg active:scale-[0.98] transition-all duration-150 font-bold text-sm"
          >
            <FaBolt />
            Go to Course
          </button>
        ) : (
          <>
            {educator?.whatsappNumber ? (
              <a
                href={`https://wa.me/${educator.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 rounded-2xl h-14 mx-2 font-bold text-sm"
              >
                <FaWhatsapp />
                Contact
              </a>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 rounded-2xl h-14 mx-2 font-bold text-sm">
                <FaShoppingCart />
                Save
              </div>
            )}
            <EnrollButton
              type="course"
              itemId={course._id || course.id}
              price={course.fees}
              className="flex-1 flex items-center justify-center gap-2 bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-2xl h-14 mx-2 shadow-lg active:scale-[0.98] transition-all duration-150 font-bold text-sm"
            />
          </>
        )}
      </footer>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CourseDetails;
