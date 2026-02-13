"use client";

import React from "react";
import {
  FaStar,
  FaUsers,
  FaClock,
  FaCalendarAlt,
  FaChair,
  FaGraduationCap,
  FaRupeeSign,
} from "react-icons/fa";
import ShareButton from "@/components/Common/ShareButton";
import { useRouter } from "next/navigation";

const CourseHeader = ({ course }) => {
  const router = useRouter();

  const formatDate = (dateString) => {
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

  function calculateWeeksDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffMs = end - start; // difference in milliseconds
    const weeks = diffMs / (1000 * 60 * 60 * 24 * 7); // convert to weeks

    return Math.round(weeks); // rounded to nearest whole week
  }

  const shareText = course?.title
    ? `Explore the course "${course.title}" on Facultypedia.`
    : "Check out this course on Facultypedia.";

  const resolveEducator = (courseObj) => {
    const candidates = [courseObj?.educatorID, courseObj?.educatorId, courseObj?.educator];
    for (const cand of candidates) {
      if (!cand) continue;

      if (typeof cand === "string") {
        const trimmed = cand.trim();
        if (trimmed) return { id: trimmed, name: courseObj?.educatorName || "Instructor" };
      }

      if (typeof cand === "object") {
        const nestedId = cand._id || cand.id || cand.educatorId || cand.educatorID;
        const normalizedId =
          typeof nestedId === "string" ? nestedId : nestedId?._id || nestedId?.id || null;

        const fullName =
          cand.fullName ||
          [cand.firstName, cand.lastName].filter(Boolean).join(" ").trim() ||
          cand.username ||
          cand.name;

        if (normalizedId || fullName) {
          return { id: normalizedId, name: fullName || "Instructor" };
        }
      }
    }
    return { id: null, name: "Instructor" };
  };

  const { id: educatorId, name: educatorName } = resolveEducator(course);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="text-black/80 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Image */}
          <div className="lg:col-span-1">
            <img
              src={
                course.image ||
                course.courseThumbnail ||
                "/images/placeholders/1.svg"
              }
              alt={course.title}
              className="w-full h-64 lg:h-48 object-cover rounded-lg border-2 border-white/20"
            />
          </div>

          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {course.specialization &&
                course.specialization.map((spec, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-200/50 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              {course.class &&
                course.class.map((cls, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-200/50 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cls}
                  </span>
                ))}
              <span className="bg-blue-200/50 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium">
                {course.courseType === "OTA" ? "One to All" : "One to One"}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <ShareButton
                title={course?.title || "Course"}
                text={shareText}
                useCurrentUrl
                size="sm"
                className="lg:ml-auto"
              />
            </div>
            <p className="text-black/90 text-lg mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* Instructor Info */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-sm">
                <span className="text-black/80">Instructor: </span>
                {educatorId ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/profile/educator/${educatorId}`)}
                    className="font-semibold text-blue-600 hover:underline"
                    aria-label="View instructor profile"
                  >
                    {educatorName}
                  </button>
                ) : (
                  <span className="font-semibold">{educatorName}</span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {course.courseDuration || "N/A"}
                </div>
                <div className="text-black/80 text-sm">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {course.liveClass?.length || 0}
                </div>
                <div className="text-black/80 text-sm">Live Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {course.videos?.length || 0}
                </div>
                <div className="text-black/80 text-sm">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {course.maxStudents || 0}
                </div>
                <div className="text-black/80 text-sm">Max Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pricing */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaRupeeSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Course Fee
              </span>
            </div>
            <div className="text-2xl font-bold text-green-800">
              ₹{course.fees?.toLocaleString()}
            </div>
            {course.discount > 0 && (
              <div className="text-sm text-green-600">
                {course.discount}% discount applied
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaCalendarAlt className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Timeline
              </span>
            </div>
            <div className="text-sm text-blue-800">
              <div>Start: {formatDate(course.startDate)}</div>
              <div>End: {formatDate(course.endDate)}</div>
            </div>
          </div>

          {/* Enrollment */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaUsers className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Enrollment
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-800">
              {course.enrolledStudents?.length || 0}/{course.maxStudents || 0}
            </div>
            <div className="text-sm text-purple-600">Students</div>
          </div>

          {/* Subject */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <FaGraduationCap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">
                Subject
              </span>
            </div>
            <div className="text-lg font-bold text-orange-800">
              {Array.isArray(course.subject)
                ? course.subject.join(", ")
                : course.subject}
            </div>
            <div className="text-sm text-orange-600">
              {Array.isArray(course.specialization)
                ? course.specialization.join(", ")
                : course.specialization}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
