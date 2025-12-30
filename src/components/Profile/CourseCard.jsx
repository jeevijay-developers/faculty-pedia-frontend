"use client";

import React from "react";
import Link from "next/link";
import {
  FiPlayCircle,
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiWifi,
} from "react-icons/fi";

const DEFAULT_IMAGE = "/images/placeholders/1.svg";

const clampPercent = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
};

const getHeroImage = (course) =>
  (typeof course?.image === "object" && course.image?.url) ||
  course?.image ||
  (typeof course?.courseThumbnail === "object" &&
    course.courseThumbnail?.url) ||
  course?.courseThumbnail ||
  DEFAULT_IMAGE;

const getEducatorName = (course) => {
  const educator =
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

  const candidate =
    educator?.fullName ||
    educator?.name ||
    course?.educatorName ||
    course?.creatorName ||
    course?.educatorUsername ||
    "";

  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : "Instructor";
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const CourseCard = ({ course, meta }) => {
  if (!course) return null;

  const courseId = course?._id || course?.id || course?.slug;
  const courseHref = courseId ? `/course-panel?courseId=${courseId}` : null;

  const progress = clampPercent(
    meta?.progress ??
      course?.enrollmentMeta?.progressPercentage ??
      course?.progressPercentage ??
      course?.progress ??
      0
  );

  const lessons = meta?.lessons ?? course?.totalLessons ?? 0;
  const videos = meta?.videos ?? course?.totalVideos ?? 0;
  const liveClasses = meta?.liveClasses ?? course?.liveClassesCount ?? 0;
  const tests = meta?.tests ?? course?.totalTests ?? 0;
  const status = meta?.status || "ongoing";
  const startDate = formatDate(meta?.startDate || course?.startDate);

  const heroImage = getHeroImage(course);
  const educatorName = getEducatorName(course);

  const statusStyles = {
    ongoing: "bg-white/90 text-blue-700 border border-blue-200",
    upcoming: "bg-orange-100 text-orange-700 border border-orange-200",
    completed: "bg-green-100 text-green-700 border border-green-200",
  };

  const ctaLabel =
    status === "completed"
      ? "Review Course"
      : status === "upcoming"
      ? "View Details"
      : "Continue Learning";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${
              statusStyles[status] || statusStyles.ongoing
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
          {course?.courseClass && (
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              Class {course.courseClass}
            </span>
          )}
          {course?.subject && (
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 capitalize">
              {Array.isArray(course.subject)
                ? course.subject.join(", ")
                : course.subject}
            </span>
          )}
          {course?.specialization && (
            <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
              {Array.isArray(course.specialization)
                ? course.specialization.join(", ")
                : course.specialization}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
            {course?.title || "Course Title"}
          </h3>
          <p className="text-sm text-gray-500">By {educatorName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <FiPlayCircle className="text-blue-600" />
            <span>{videos || lessons || 0} Videos</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-amber-600" />
            <span>{tests} Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <FiWifi className="text-emerald-600" />
            <span>{liveClasses} Live</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" />
            <span>{startDate || "Started"}</span>
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{progress}% Completed</span>
            <span>{lessons || videos || 0} Lessons</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          {courseHref && (
            <Link
              href={courseHref}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              {ctaLabel}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
