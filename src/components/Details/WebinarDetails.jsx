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
import Banner from "../Common/Banner";
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

const WebinarDetails = ({ webinar }) => {
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [educatorName, setEducatorName] = useState(deriveEducatorName(webinar));
  const [studentId, setStudentId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

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
  const duration = webinar.duration || 1; // duration in hours
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

  return (
    <div>
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
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          data-aos="fade-up"
        >
          <div className="relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              unoptimized
              className="object-cover"
            />
            {/* Subject and Type badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                <FaBook className="w-3 h-3 inline mr-1" />
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </span>
              <span className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full capitalize">
                {webinarType.replace("-", " ")}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {title
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h1>
              <p className="text-sm text-gray-600">By {educatorName}</p>
              <ShareButton
                title={title || "Webinar"}
                text={shareText}
                useCurrentUrl
                size="sm"
              />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center text-gray-700">
                <FaChalkboardTeacher className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Educator</p>
                  <p className="font-semibold">{educatorName}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-semibold">
                    {timing.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {timing.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaClock className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-semibold">{duration} hours</p>
                  <p className="text-sm text-gray-500">
                    {duration * 60} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaUsers className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Seats</p>
                  <p className="font-semibold">{seatsAvailable} available</p>
                  <p className="text-sm text-gray-500">
                    {enrolledCount} enrolled
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaRupeeSign className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="font-semibold">₹{fees}</p>
                  {fees === 0 && <p className="text-sm text-green-600">Free</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div
          className="grid md:grid-cols-2 gap-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaBook className="w-5 h-5 mr-2 text-blue-500" />
            Topics Covered
          </h2>
          <ul className="space-y-3">
            {webinar.topics &&
              webinar.topics.map((topic, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2" />
                  <span>{topic}</span>
                </li>
              ))}
          </ul>
        </div> */}

          {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-blue-500" />
            What You'll Learn
          </h2>
          <ul className="space-y-3">
            {webinar.learningOutcomes.map((outcome, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div> */}
        </div>

        {/* Additional Information */}
        <div
          className="bg-white rounded-xl shadow-lg p-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-blue-500" />
            Webinar Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Specialization
              </h3>
              <p className="text-gray-600">{specialization}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Subject</h3>
              <p className="text-gray-600 capitalize">{subject}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Type</h3>
              <p className="text-gray-600 capitalize">
                {webinarType.replace("-", " ")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Format</h3>
              <p className="text-gray-600">Live Online Webinar</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl shadow-lg p-6"
          data-aos="fade-up"
          data-aos-delay="130"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Give Review and rate this Webinar
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Share your experience. Only enrolled students can submit a review, and it will show on the educator profile.
          </p>
          <form className="space-y-4" onSubmit={handleWebinarReviewSubmit}>
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
                      onClick={(event) => handleWebinarStarClick(index, event)}
                      disabled={!isAlreadyEnrolled || isSubmittingReview}
                      className="p-1 disabled:cursor-not-allowed"
                      aria-label={`Set webinar rating to ${index + 1} star${index === 0 ? "" : "s"}`}
                    >
                      {icon}
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-gray-700">{reviewRating.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="webinar-review-text">
                Your Review
              </label>
              <textarea
                id="webinar-review-text"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Tell others about the content, delivery, and outcomes."
                disabled={!isAlreadyEnrolled || isSubmittingReview}
                required
              />
            </div>
            {reviewStatus && (
              <p className="text-sm text-gray-700">{reviewStatus}</p>
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
        </div>

        {/* Assets Section */}
        {webinar.assetsLink && webinar.assetsLink.length > 0 && (
          <div
            className="bg-white rounded-xl shadow-lg p-6"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
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
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaBook className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Material {index + 1}
                    </p>
                    <p className="text-sm text-gray-500">Study Resource</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Educator Section */}
        {/* <div
        className="bg-white rounded-xl shadow-lg p-6"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaChalkboardTeacher className="w-5 h-5 mr-2 text-blue-500" />
          About the Educator
        </h2>
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden">
            <Image
              src={webinar.educator.image.url}
              alt={webinar.educator.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{webinar.educator.name}</h3>
            <p className="text-gray-600">{webinar.educator.qualification}</p>
            <p className="text-gray-600 mt-2">{webinar.educator.bio}</p>
          </div>
        </div>
      </div> */}

        {/* CTA Buttons */}
        <div
          className="flex justify-center gap-4 pb-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <EnrollButton
            type="webinar"
            itemId={webinar._id || webinar.id}
            price={fees}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            title="Enroll & Join"
            initialEnrolled={isAlreadyEnrolled}
            onEnrollmentSuccess={() => {
              if (webinar.webinarLink) {
                window.location.href = webinar.webinarLink;
                return true; // handled, skip default redirect
              }
              return false; // fallback to default redirect
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WebinarDetails;
