"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiPlayCircle,
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiWifi,
} from "react-icons/fi";
import { getCourseById } from "../server/course.routes";
import { getVideos } from "../server/video.routes";
import { getTestSeriesByCourse } from "../server/test-series.route";

const DEFAULT_IMAGE = "/images/placeholders/1.svg";

const isLikelyObjectId = (value) =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value.trim());

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
    course?.educatorFullName ||
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

const toCount = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getVideosCount = (course, meta) => {
  const candidates = [
    course?.totalVideos,
    course?.videoCount,
    course?.videosCount,
    course?.numberOfVideos,
    course?.noOfVideos,
    course?.mediaCounts?.videos,
    course?.contentCount?.videos,
    course?.statistics?.videoCount,
    course?.stats?.videoCount,
    course?.courseStatistics?.videoCount,
    Array.isArray(course?.videos) ? course.videos.length : null,
    meta?.videos,
  ];

  const first = candidates.find((val) => toCount(val) !== null);
  return toCount(first) ?? 0;
};

const getTestsFromSeries = (testSeries) => {
  if (!Array.isArray(testSeries)) return null;

  const total = testSeries.reduce((sum, series) => {
    const count =
      toCount(series?.numberOfTests) ??
      toCount(series?.testCount) ??
      (Array.isArray(series?.tests) ? series.tests.length : 0);
    return sum + (count || 0);
  }, 0);

  if (total > 0) return total;
  return testSeries.length || null;
};

const getTestsFromCourseSeries = (payload) => {
  const seriesList =
    payload?.testSeries ||
    payload?.data?.testSeries ||
    payload?.data?.data?.testSeries ||
    payload?.data ||
    [];

  if (!Array.isArray(seriesList)) return null;

  return seriesList.reduce((sum, series) => {
    const count =
      toCount(series?.tests?.length) ??
      toCount(series?.numberOfTests) ??
      0;
    return sum + (count || 0);
  }, 0);
};

const getTestsCount = (course, meta) => {
  const primaryCandidates = [
    course?.totalTests,
    course?.testCount,
    course?.numberOfTests,
    course?.noOfTests,
    course?.testsCount,
    course?.mediaCounts?.tests,
    course?.statistics?.testCount,
    course?.stats?.testCount,
    course?.courseStatistics?.testCount,
    Array.isArray(course?.tests) ? course.tests.length : null,
  ];

  const base = primaryCandidates.find((val) => toCount(val) !== null);
  const baseVal = toCount(base);
  const metaTests = toCount(meta?.tests);
  const seriesVal =
    toCount(course?.testSeriesCount) ??
    toCount(getTestsFromSeries(course?.testSeries));

  if (baseVal !== null && baseVal > 0) return baseVal;
  if (seriesVal !== null && seriesVal > 0) return seriesVal;
  if (metaTests !== null && metaTests > 0) return metaTests;

  return (
    baseVal ??
    seriesVal ??
    metaTests ??
    0
  );
};

const getStartDate = (course, meta) =>
  meta?.startDate ||
  course?.startDate ||
  course?.startsAt ||
  course?.beginDate ||
  course?.validDate ||
  course?.enrollmentMeta?.enrolledAt ||
  null;

const CourseCard = ({ course, meta }) => {
  if (!course) return null;
  const [hydratedCourse, setHydratedCourse] = useState(null);
  const [remoteCounts, setRemoteCounts] = useState({
    videos: null,
    tests: null,
  });

  const baseCourseId = course?._id || course?.id || course?.slug;
  const courseId = hydratedCourse?._id || hydratedCourse?.id || hydratedCourse?.slug || baseCourseId;
  const courseHref = courseId ? `/course-panel?courseId=${courseId}` : null;
  const courseObjectId =
    [hydratedCourse?._id, course?._id, course?.id, courseId].find((val) =>
      isLikelyObjectId(val)
    ) || null;

  const shouldHydrate = () => {
    const current = hydratedCourse || course;
    const videos = getVideosCount(current, meta);
    const tests = getTestsCount(current, meta);
    const educator = getEducatorName(current);
    const hasEducator = educator && educator !== "Instructor";
    return !hasEducator || videos === 0 || tests === 0;
  };

  useEffect(() => {
    if (!courseId) return;
    if (!shouldHydrate()) {
      setHydratedCourse(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getCourseById(courseId);
        const fetched = res?.course || res;
        if (!cancelled && fetched) {
          setHydratedCourse(fetched);
        }
      } catch (err) {
        console.warn("Failed to hydrate course", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;

    const fetchCounts = async () => {
      try {
        const seriesPromise = courseObjectId
          ? getTestSeriesByCourse(courseObjectId, { limit: 200 })
          : Promise.resolve(null);

        const [videosRes, seriesRes] = await Promise.allSettled([
          getVideos({ courseId, isCourseSpecific: true, limit: 200 }),
          seriesPromise,
        ]);

        const nextCounts = { videos: null, tests: null };

        if (videosRes.status === "fulfilled") {
          const list = Array.isArray(videosRes.value) ? videosRes.value : [];
          nextCounts.videos = toCount(list.length) ?? null;
        }

        if (seriesRes.status === "fulfilled" && seriesRes.value) {
          const testTotal = getTestsFromCourseSeries(seriesRes.value);
          nextCounts.tests = toCount(testTotal) ?? null;
        }

        if (!cancelled && (nextCounts.videos !== null || nextCounts.tests !== null)) {
          setRemoteCounts((prev) => ({
            videos: nextCounts.videos ?? prev.videos,
            tests: nextCounts.tests ?? prev.tests,
          }));
        }
      } catch (err) {
        console.warn("Failed to fetch course media counts", err);
      }
    };

    fetchCounts();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const courseSource = hydratedCourse || course;

  const progress = clampPercent(
    meta?.progress ??
      courseSource?.enrollmentMeta?.progressPercentage ??
      courseSource?.progressPercentage ??
      courseSource?.progress ??
      0
  );

  const baseLessons =
    meta?.lessons ??
    courseSource?.totalLessons ??
    courseSource?.lessonCount ??
    (Array.isArray(courseSource?.lessons) ? courseSource.lessons.length : 0);
  const baseVideos = getVideosCount(courseSource, meta);
  const baseTests = getTestsCount(courseSource, meta);

  const displayVideos = remoteCounts.videos ?? baseVideos;
  const displayTests = remoteCounts.tests ?? baseTests;
  const displayLessons = baseLessons || displayVideos || 0;
  const liveClasses =
    meta?.liveClasses ??
    courseSource?.liveClassesCount ??
    courseSource?.liveClassCount ??
    (Array.isArray(courseSource?.liveClass) ? courseSource.liveClass.length : 0);
  const status = meta?.status || "ongoing";
  const startDate = formatDate(getStartDate(courseSource, meta));

  const heroImage = getHeroImage(courseSource);
  const educatorName = getEducatorName(courseSource);

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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <FiPlayCircle className="text-blue-600" />
            <span>{displayVideos || displayLessons || 0} Videos</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-amber-600" />
            <span>{displayTests ?? 0} Tests</span>
          </div>
          
         
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" />
            <span>{startDate || "Started"}</span>
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{progress}% Completed</span>
            <span>{displayLessons || displayVideos || 0} Lessons</span>
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
