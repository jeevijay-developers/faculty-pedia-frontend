import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdSchool, MdAccessTime, MdCalendarToday } from "react-icons/md";
import { IoStarSharp } from "react-icons/io5";
import { FaBook } from "react-icons/fa";

const DEFAULT_COURSE_IMAGE = "/images/placeholders/1.svg";
const DEFAULT_EDUCATOR_IMAGE = "/images/placeholders/educator-fallback.svg";
const HEX_OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const sanitizeImageUrl = (value, fallback) => {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  if (trimmed.includes("example.com")) {
    return fallback;
  }

  return trimmed;
};

const CourseCard = ({ course }) => {
  // Format the starting date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const educatorSource =
    (course?.educatorID && typeof course.educatorID === "object"
      ? course.educatorID
      : null) ||
    (course?.educatorId && typeof course.educatorId === "object"
      ? course.educatorId
      : null) ||
    (course?.educator && typeof course.educator === "object"
      ? course.educator
      : null) ||
    (course?.educatorDetails && typeof course.educatorDetails === "object"
      ? course.educatorDetails
      : null);

  const rawCourseImage =
    (typeof course?.image === "object" && course.image?.url) ||
    (typeof course?.courseThumbnail === "object" &&
      course.courseThumbnail?.url) ||
    course?.image ||
    course?.courseThumbnail;

  const rawEducatorAvatar =
    educatorSource?.profilePicture ||
    course?.educatorProfilePicture ||
    course?.educatorPhoto;

  const sanitizedCourseImage = sanitizeImageUrl(
    rawCourseImage,
    DEFAULT_COURSE_IMAGE
  );
  const sanitizedEducatorAvatar = sanitizeImageUrl(
    rawEducatorAvatar,
    DEFAULT_EDUCATOR_IMAGE
  );

  const [heroImageSrc, setHeroImageSrc] = useState(sanitizedCourseImage);
  const [avatarSrc, setAvatarSrc] = useState(sanitizedEducatorAvatar);

  useEffect(() => {
    setHeroImageSrc(sanitizedCourseImage);
  }, [sanitizedCourseImage]);

  useEffect(() => {
    setAvatarSrc(sanitizedEducatorAvatar);
  }, [sanitizedEducatorAvatar]);

  const handleHeroImageError = () => {
    if (heroImageSrc !== DEFAULT_COURSE_IMAGE) {
      setHeroImageSrc(DEFAULT_COURSE_IMAGE);
    }
  };

  const handleAvatarError = () => {
    if (avatarSrc !== DEFAULT_EDUCATOR_IMAGE) {
      setAvatarSrc(DEFAULT_EDUCATOR_IMAGE);
    }
  };

  const educatorNameRaw =
    educatorSource?.fullName ||
    educatorSource?.name ||
    course?.educatorName ||
    course?.educatorFullName ||
    course?.creatorName ||
    (typeof course?.educator === "string" ? course.educator : "") ||
    (typeof course?.educatorId === "string" ? course.educatorId : "") ||
    (typeof course?.educatorID === "string" ? course.educatorID : "") ||
    educatorSource?.username ||
    course?.educatorUsername ||
    "";

  const educatorName = (() => {
    if (typeof educatorNameRaw !== "string") {
      return "";
    }
    const trimmed = educatorNameRaw.trim();
    if (!trimmed) {
      return "";
    }
    if (HEX_OBJECT_ID_REGEX.test(trimmed)) {
      return "";
    }
    return trimmed;
  })();

  const educatorAvatar =
    educatorSource?.profilePicture?.url ||
    educatorSource?.profilePicture ||
    educatorSource?.profilePicture ||
    course?.educatorProfilePicture ||
    "/images/placeholders/square.svg";

  const hasEducator = Boolean(educatorSource || educatorName);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] h-full overflow-hidden">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden rounded-xl mb-4">
        <Image
          src={heroImageSrc}
          alt={course?.title || "Course"}
          fill
          className="object-cover"
          onError={handleHeroImageError}
        />
        {/* Specialization Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {Array.isArray(course?.specialization) ? (
            course.specialization.map((spec, idx) => (
              <span
                key={idx}
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium"
              >
                {spec}
              </span>
            ))
          ) : (
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {course?.specialization}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
          {course.title}
        </h3>

        {hasEducator && (
          <h4 className="text-base font-semibold text-blue-600 mb-4">
            {educatorName || "Instructor"}
          </h4>
        )}

        {/* Subject and Specialization */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaBook className="mr-1 text-blue-700" />
            <span className="capitalize">
              {Array.isArray(course.subject)
                ? course.subject.join(", ")
                : course.subject}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MdSchool className="w-4 h-4 mr-1 text-green-700" />
            <span>
              {Array.isArray(course.specialization)
                ? course.specialization.join(", ")
                : course.specialization}
            </span>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="space-y-3 mb-4">
          {/* Start Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdCalendarToday className="w-4 h-4 mr-2 text-orange-700" />
              <span className="font-medium">Starts:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {formatDate(course.startDate)}
            </span>
          </div>

          {/* Max Students - Only show for one-to-all courses */}
          {course.courseType !== "one-to-one" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <MdAccessTime className="w-4 h-4 mr-2 text-purple-700" />
                <span className="font-medium">Max Students:</span>
              </div>
              <span className="text-sm text-gray-800 font-medium">
                {course.maxStudents || course.seatLimit || "N/A"}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-100 mb-4 mt-auto pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{(course.fees || 0).toLocaleString()}
              </span>
            </div>
            {course.discount > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {course.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/details/course/${course._id || course.id}`}
            className="flex-1 rounded-full bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
