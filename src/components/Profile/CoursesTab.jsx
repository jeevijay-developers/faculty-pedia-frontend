"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiBookOpen,
  FiSearch,
  FiLayers,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import CourseCard from "./CourseCard";

const clampPercent = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
};

const getProgress = (course) =>
  clampPercent(
    course?.enrollmentMeta?.progressPercentage ??
      course?.progressPercentage ??
      course?.progress ??
      course?.completionPercentage ??
      0
  );

const getLessonsCount = (course) =>
  course?.totalLessons ??
  course?.lessonCount ??
  (Array.isArray(course?.lessons) ? course.lessons.length : null) ??
  (Array.isArray(course?.videos) ? course.videos.length : null) ??
  0;

const getVideosCount = (course) =>
  course?.totalVideos ??
  course?.videoCount ??
  (Array.isArray(course?.videos) ? course.videos.length : null) ??
  0;

const getLiveCount = (course) =>
  course?.liveClassesCount ??
  course?.liveClassCount ??
  (Array.isArray(course?.liveClasses) ? course.liveClasses.length : null) ??
  0;

const getTestsCount = (course) =>
  course?.totalTests ??
  course?.testCount ??
  (Array.isArray(course?.tests) ? course.tests.length : null) ??
  0;

const getStartDate = (course) =>
  course?.startDate || course?.startsAt || course?.beginDate || null;

const getStatus = (course) => {
  const progress = getProgress(course);
  const completionStatus = (
    course?.completionStatus ||
    course?.status ||
    ""
  ).toLowerCase();
  if (progress >= 95 || completionStatus.includes("complete"))
    return "completed";

  const start = getStartDate(course);
  if (start) {
    const ts = Date.parse(start);
    if (!Number.isNaN(ts) && ts > Date.now()) return "upcoming";
  }

  return "ongoing";
};

const CoursesTab = ({ resolvedCourses = [], coursesLoading, coursesError }) => {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const isCourseActive = (course) => {
    if (!course) return false;
    const status = (course.status || "").toLowerCase();
    const explicitInactive =
      course.isActive === false || course.active === false;
    const flaggedDeleted =
      course.isDeleted || course.deletedAt || course.deleted === true;
    return (
      !explicitInactive &&
      !flaggedDeleted &&
      status !== "deleted" &&
      status !== "inactive"
    );
  };

  const enrichedCourses = useMemo(() => {
    const active = Array.isArray(resolvedCourses)
      ? resolvedCourses.filter(isCourseActive)
      : [];

    return active.map((course) => {
      const progress = getProgress(course);
      const status = getStatus(course);
      return {
        course,
        meta: {
          progress,
          status,
          lessons: getLessonsCount(course),
          videos: getVideosCount(course),
          liveClasses: getLiveCount(course),
          tests: getTestsCount(course),
          startDate: getStartDate(course),
        },
      };
    });
  }, [resolvedCourses]);

  const stats = useMemo(() => {
    const base = { total: 0, ongoing: 0, completed: 0, upcoming: 0 };
    return enrichedCourses.reduce((acc, item) => {
      acc.total += 1;
      acc[item.meta.status] = (acc[item.meta.status] || 0) + 1;
      return acc;
    }, base);
  }, [enrichedCourses]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrichedCourses.filter(({ course, meta }) => {
      const statusMatch = filter === "all" || meta.status === filter;
      if (!statusMatch) return false;
      if (!q) return true;
      const haystack = `${course?.title || ""} ${course?.subject || ""} ${
        course?.specialization || ""
      } ${course?.educatorName || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [enrichedCourses, filter, query]);

  const showEmpty = !coursesLoading && filteredCourses.length === 0;

  const filterOptions = [
    { id: "all", label: "All Courses" },
    { id: "ongoing", label: "Ongoing" },
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900">
            My Learning Journey
          </h3>
          <p className="text-gray-600">
            Welcome back! Pick up where you left off.
          </p>
        </div>
        <div className="w-full md:w-80">
          <label className="relative block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your courses..."
              className="w-full rounded-full border border-gray-200 bg-white px-10 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Enrolled</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm font-medium text-blue-700">Ongoing</p>
          <p className="text-3xl font-bold text-gray-900">{stats.ongoing}</p>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
          <p className="text-sm font-medium text-green-700">Completed</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
          <p className="text-sm font-medium text-orange-600">Upcoming</p>
          <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                isActive
                  ? "bg-blue-600 text-white shadow-blue-200"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {coursesError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {coursesError}
        </div>
      )}

      {coursesLoading && resolvedCourses.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-gray-200 bg-white p-5 animate-pulse space-y-4"
            >
              <div className="h-48 w-full rounded-2xl bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
              <div className="h-2 w-full rounded bg-gray-200" />
              <div className="h-10 w-full rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      ) : showEmpty ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <FiBookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No courses found
          </h4>
          <p className="text-gray-600 mb-6">
            Try adjusting filters or searching for a different course.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(({ course, meta }, idx) => (
            <CourseCard
              key={course?._id || course?.id || idx}
              course={course}
              meta={meta}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
