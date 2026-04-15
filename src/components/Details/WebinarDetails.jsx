"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaBook,
  FaGraduationCap,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import EnrollButton from "../Common/EnrollButton";
import ShareButton from "@/components/Common/ShareButton";
import { fetchEducatorById } from "@/components/server/webinars.routes";
import { createItemReview } from "../server/reviews.routes";

const deriveEducatorName = (webinar) => {
  const educatorObject =
    (webinar?.educatorID && typeof webinar.educatorID === "object"
      ? webinar.educatorID
      : null) ||
    (webinar?.educatorId && typeof webinar.educatorId === "object"
      ? webinar.educatorId
      : null) ||
    (webinar?.educator && typeof webinar.educator === "object"
      ? webinar.educator
      : null) ||
    (webinar?.creator && typeof webinar.creator === "object"
      ? webinar.creator
      : null);

  const candidate =
    [
      webinar?.educatorName,
      webinar?.educatorFullName,
      educatorObject?.fullName,
      educatorObject?.name,
      [educatorObject?.firstName, educatorObject?.lastName]
        .filter(Boolean)
        .join(" "),
      educatorObject?.username,
      webinar?.creatorName,
    ].find((val) => typeof val === "string" && val.trim()) ||
    (typeof webinar?.educatorID === "string" && webinar.educatorID.trim()
      ? webinar.educatorID.trim()
      : null) ||
    (typeof webinar?.educatorId === "string" && webinar.educatorId.trim()
      ? webinar.educatorId.trim()
      : null);

  return candidate || "Educator";
};

const EDUCATOR_IMAGE_FALLBACK = "/images/placeholders/educatorFallback.svg";

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

const getIntroEmbedUrl = (url) => getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url);

const pickImageUrl = (source) => {
  if (!source) return null;
  if (typeof source === "string" && source.trim()) return source.trim();
  if (typeof source === "object") {
    const candidate = source.url || source.secure_url || source.src;
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return null;
};

const deriveEducatorImage = (webinar) => {
  const educatorObject =
    (webinar?.educatorID && typeof webinar.educatorID === "object"
      ? webinar.educatorID
      : null) ||
    (webinar?.educatorId && typeof webinar.educatorId === "object"
      ? webinar.educatorId
      : null) ||
    (webinar?.educator && typeof webinar.educator === "object"
      ? webinar.educator
      : null) ||
    (webinar?.creator && typeof webinar.creator === "object"
      ? webinar.creator
      : null);

  return (
    pickImageUrl(educatorObject?.profilePicture) ||
    pickImageUrl(educatorObject?.image) ||
    pickImageUrl(educatorObject?.avatar) ||
    pickImageUrl(webinar?.educatorImage) ||
    EDUCATOR_IMAGE_FALLBACK
  );
};

const parseDurationMinutes = (value) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const numericValue = Number(value.replace(/[^\d.]/g, "").trim());
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return numericValue;
    }
  }

  return null;
};

const formatHoursFromMinutes = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "N/A";
  }

  const hours = minutes / 60;
  const rounded = Math.round(hours * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/\.0+$/, "");
};

const WebinarDetails = ({ webinar }) => {
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [educatorName, setEducatorName] = useState(deriveEducatorName(webinar));
  const [educatorImage, setEducatorImage] = useState(deriveEducatorImage(webinar));
  const [studentId, setStudentId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [playIntro, setPlayIntro] = useState(false);
  const introVideoEmbedUrl = getIntroEmbedUrl(webinar?.introVideo);

  useEffect(() => {
    const educatorIdString =
      (typeof webinar?.educatorID === "string" && webinar.educatorID) ||
      (typeof webinar?.educatorId === "string" && webinar.educatorId) ||
      null;

    if (!educatorIdString) return;
    if (educatorName && educatorName !== "Educator") return;

    let isMounted = true;

    const loadEducator = async () => {
      const educator = await fetchEducatorById(educatorIdString);
      if (!educator || !isMounted) return;
      const nameCandidates = [
        educator.fullName,
        [educator.firstName, educator.lastName].filter(Boolean).join(" "),
        educator.username,
      ].filter((val) => typeof val === "string" && val.trim());

      if (nameCandidates.length) {
        setEducatorName(nameCandidates[0]);
      }

      const imageCandidate =
        pickImageUrl(educator.profilePicture) ||
        pickImageUrl(educator.image) ||
        pickImageUrl(educator.avatar);
      if (imageCandidate) {
        setEducatorImage(imageCandidate);
      }
    };

    loadEducator();

    return () => {
      isMounted = false;
    };
  }, [educatorName, webinar?.educatorID, webinar?.educatorId]);

  useEffect(() => {
    try {
      const userData = JSON.parse(
        localStorage.getItem("faculty-pedia-student-data") || "{}"
      );
      const studentId = userData?._id || userData?.id;

      if (studentId) {
        setStudentId(studentId);
      }

      const enrollmentList =
        webinar?.studentEnrolled || webinar?.enrolledStudents || [];

      const normalized = Array.isArray(enrollmentList) ? enrollmentList : [];

      const alreadyEnrolled = normalized.some((entry) => {
        if (!entry) return false;
        const id =
          typeof entry === "string"
            ? entry
            : entry?._id || entry?.id || entry?.studentId;
        return id && studentId && id.toString() === studentId.toString();
      });

      if (studentId && (alreadyEnrolled || webinar?.isEnrolled)) {
        setIsAlreadyEnrolled(true);
      } else {
        setIsAlreadyEnrolled(false);
      }
    } catch (error) {
      console.error("Enrollment state check failed", error);
      setIsAlreadyEnrolled(false);
    }
  }, [webinar]);

  // Handle different response formats and provide fallbacks
  const imageUrl = webinar.image || "https://placehold.co/800x600";
  const title = webinar.title || "Webinar Title";
  const description = webinar.description || "No description available";
  const timing = webinar.timing ? new Date(webinar.timing) : new Date();
  const durationInMinutes = parseDurationMinutes(webinar.duration);
  const durationInHours = formatHoursFromMinutes(durationInMinutes);
  const seatLimit = webinar.seatLimit || 0;
  const fees = webinar.fees || 0;
  const subject = Array.isArray(webinar.subject)
    ? webinar.subject.join(", ")
    : webinar.subject || "General";
  const webinarType = webinar.webinarType || "one-to-all";
  const specialization = Array.isArray(webinar.specialization)
    ? webinar.specialization.join(", ")
    : webinar.specialization || "General";
  const enrolledCount =
    webinar.enrolledCount || webinar.studentEnrolled?.length || 0;
  const seatsAvailable = webinar.seatsAvailable || seatLimit - enrolledCount;
  const shareText = `Join the webinar "${title}" on Facultypedia.`;

  const handleWebinarReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isAlreadyEnrolled) {
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
        itemId: webinar._id || webinar.id,
        itemType: "webinar",
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

  const handleWebinarStarClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left <= rect.width / 2;
    const nextRating = index + (isLeftHalf ? 0.5 : 1);
    setReviewRating(nextRating);
  };

  const formattedDate = timing.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = timing.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const prettyTitle = title
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-28 lg:pb-12">
      {showReviewSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Thanks for your review!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
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

      {/* Hero */}
      <section className="relative w-full bg-slate-900" data-aos="fade-up">
        <div className="relative w-full aspect-video max-h-155 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized
            sizes="100vw"
            className="object-contain object-center"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-8 lg:pb-12">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-white bg-blue-600/90 backdrop-blur-sm rounded-full shadow-sm">
                  <FaBook className="w-3 h-3" />
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-white bg-green-600/90 backdrop-blur-sm rounded-full shadow-sm">
                  {webinarType.replace("-", " ")}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-white bg-orange-500/90 backdrop-blur-sm rounded-full shadow-sm">
                  Live
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight wrap-break-word max-w-3xl drop-shadow">
                {prettyTitle}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full border-2 border-white/70 overflow-hidden bg-white/10 shadow-md">
                    <Image
                      src={educatorImage}
                      alt={educatorName}
                      fill
                      unoptimized
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold leading-none">{educatorName}</p>
                    <p className="text-blue-100 text-xs mt-1">Webinar Instructor</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-white/90 text-sm font-medium">
                  <FaCalendarAlt className="text-blue-200" />
                  <span>{formattedDate} • {formattedTime}</span>
                </div>
                <div className="ml-auto">
                  <ShareButton
                    title={title || "Webinar"}
                    text={shareText}
                    useCurrentUrl
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info strip (glassmorphism) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 md:-mt-10 relative z-20">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl md:rounded-full p-5 md:px-10 md:py-5 grid grid-cols-2 md:flex md:flex-nowrap md:justify-between md:items-center gap-5 md:gap-6 shadow-xl border border-white/60 dark:border-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 shrink-0">
              <FaChalkboardTeacher />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">Educator</p>
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{educatorName}</p>
            </div>
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 shrink-0">
              <FaClock />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">Duration</p>
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                {durationInHours === "N/A" ? "N/A" : `${durationInHours} hrs`}
              </p>
            </div>
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 shrink-0">
              <FaUsers />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">Seats</p>
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{seatsAvailable} available</p>
            </div>
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 shrink-0">
              <FaRupeeSign />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">Price</p>
              <p className="font-bold text-sm text-orange-600">
                {fees > 0 ? `₹${fees}` : "Free"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 lg:mt-14 lg:grid lg:grid-cols-10 lg:gap-10">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-12">
          {/* About */}
          <section data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              About the Webinar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
              {description}
            </p>
          </section>

          {/* Demo Video */}
          {introVideoEmbedUrl && (
            <section className="space-y-4" data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Demo Video
              </h2>
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg bg-black">
                {playIntro ? (
                  <iframe
                    src={`${introVideoEmbedUrl}${
                      introVideoEmbedUrl.includes("?") ? "&" : "?"
                    }autoplay=1`}
                    title={`${title} - Demo`}
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
                    className="absolute inset-0 w-full h-full group"
                    aria-label="Play demo video"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${title} demo preview`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                      <span className="bg-white/90 p-5 rounded-full shadow-2xl group-active:scale-90 transition-transform">
                        <FaPlay className="text-blue-600 text-3xl ml-1" />
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Webinar Information Grid */}
          <section
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <FaGraduationCap className="w-5 h-5 mr-2 text-blue-500" />
              Webinar Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1">Specialization</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{specialization}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1">Subject</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{subject}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1">Type</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{webinarType.replace("-", " ")}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1">Format</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Live Online Webinar</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1">Date</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{formattedDate}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formattedTime}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1">Enrollment</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{enrolledCount} enrolled</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{seatsAvailable} of {seatLimit} seats available</p>
              </div>
            </div>
          </section>

          {/* Educator */}
          <section data-aos="fade-up" data-aos-delay="120">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Meet Your Educator
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-linear-to-br from-blue-500 to-indigo-600">
                <Image
                  src={educatorImage}
                  alt={educatorName}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{educatorName}</h3>
                <p className="text-blue-600 font-semibold mb-4">Webinar Instructor</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your guide for this live session. Join the webinar to interact with {educatorName} directly and get your questions answered in real time.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">{specialization}</span>
                  <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{subject}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Review Form */}
          <section
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8"
            data-aos="fade-up"
            data-aos-delay="130"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Rate this Webinar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share your experience. Only enrolled students can submit a review, and it will show on the educator profile.
            </p>
            <form className="space-y-4" onSubmit={handleWebinarReviewSubmit}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        onClick={(event) => handleWebinarStarClick(index, event)}
                        disabled={!isAlreadyEnrolled || isSubmittingReview}
                        className="p-1 disabled:cursor-not-allowed"
                        aria-label={`Set webinar rating to ${index + 1} star${index === 0 ? "" : "s"}`}
                      >
                        {icon}
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{reviewRating.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="webinar-review-text">
                  Your Review
                </label>
                <textarea
                  id="webinar-review-text"
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Tell others about the content, delivery, and outcomes."
                  disabled={!isAlreadyEnrolled || isSubmittingReview}
                  required
                />
              </div>
              {reviewStatus && (
                <p className="text-sm text-gray-700 dark:text-gray-300">{reviewStatus}</p>
              )}
              <button
                type="submit"
                className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm ${
                  isAlreadyEnrolled
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isAlreadyEnrolled || isSubmittingReview}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
              {!isAlreadyEnrolled && (
                <p className="text-sm text-red-600 font-medium">
                  Enroll in this webinar to submit a review.
                </p>
              )}
            </form>
          </section>

          {/* Assets */}
          {webinar.assetsLink && webinar.assetsLink.length > 0 && (
            <section
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FaBook className="w-5 h-5 mr-2 text-blue-500" />
                Study Materials
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {webinar.assetsLink.map((asset, index) => (
                  <a
                    key={index}
                    href={asset}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FaBook className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Material {index + 1}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Study Resource</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT sticky pricing panel */}
        <aside className="hidden lg:block lg:col-span-3 mt-12 lg:mt-0">
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                  {fees > 0 ? `₹${fees}` : "Free"}
                </span>
                {fees > 0 && (
                  <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">
                    Enroll Now
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">One-time payment</p>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formattedTime} • {durationInHours === "N/A" ? "N/A" : `${durationInHours} hrs`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaUsers className="text-blue-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {seatsAvailable} of {seatLimit} seats available
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaBook className="text-blue-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{subject}</span>
              </div>
            </div>
            <EnrollButton
              type="webinar"
              itemId={webinar._id || webinar.id}
              price={fees}
              className="w-full bg-blue-600 text-white py-3.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 font-bold text-sm"
              title="Enroll & Join"
              initialEnrolled={isAlreadyEnrolled}
              onEnrollmentSuccess={() => {
                if (webinar.webinarLink) {
                  window.location.href = webinar.webinarLink;
                  return true;
                }
                return false;
              }}
            />
            <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 mt-3">
              By enrolling, you agree to our Terms of Service and Privacy Policy.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Includes</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-500">✓</span> Live interactive session
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-500">✓</span> Live Q&amp;A with educator
                </li>
                {webinar.assetsLink && webinar.assetsLink.length > 0 && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500">✓</span> Downloadable study materials
                  </li>
                )}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_-4px_20px_0_rgba(0,0,0,0.08)] border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center px-4 py-3 gap-3">
          <div className="shrink-0">
            <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">Price</p>
            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100 leading-none">
              {fees > 0 ? `₹${fees}` : "Free"}
            </p>
          </div>
          <div className="flex-1 max-w-60">
            <EnrollButton
              type="webinar"
              itemId={webinar._id || webinar.id}
              price={fees}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-sm shadow-lg"
              title="Enroll & Join"
              initialEnrolled={isAlreadyEnrolled}
              onEnrollmentSuccess={() => {
                if (webinar.webinarLink) {
                  window.location.href = webinar.webinarLink;
                  return true;
                }
                return false;
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default WebinarDetails;
