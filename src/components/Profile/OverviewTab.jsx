"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiBookOpen,
  FiTarget,
  FiUsers,
  FiAward,
  FiCalendar,
  FiClock,
  FiVideo,
} from "react-icons/fi";
import { getEnrolledLiveClasses } from "@/components/server/student/student.routes";
import StatCard from "./StatCard";

const OverviewTab = ({
  totalCourses,
  totalResults,
  followingEducatorsLength,
  results = [],
  tests,
  getSeries,
  getSeriesId,
  onTabChange,
  studentId,
}) => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    let mounted = true;
    (async () => {
      try {
        setLiveLoading(true);
        setLiveError(null);
        const { liveClasses: enrolled = [] } = await getEnrolledLiveClasses(
          studentId
        );
        if (!mounted) return;
        setLiveClasses(enrolled || []);
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load upcoming live classes", err);
        setLiveError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load live classes"
        );
      } finally {
        if (mounted) setLiveLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  const upcomingLiveClasses = useMemo(() => {
    const now = Date.now();
    return (liveClasses || [])
      .filter((lc) => {
        const ts = Date.parse(lc?.classTiming || "");
        return !Number.isNaN(ts) && ts >= now && lc?.isCompleted !== true;
      })
      .sort((a, b) => Date.parse(a.classTiming) - Date.parse(b.classTiming))
      .slice(0, 2);
  }, [liveClasses]);

  const nextClass = upcomingLiveClasses[0];

  const formatDateTime = (value, opts) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-IN", opts);
  };

  const getMeetingLink = (liveClass) =>
    liveClass?.liveClassLink ||
    liveClass?.classLink ||
    liveClass?.meetingLink ||
    liveClass?.recordingURL;

  const getInstructor = (liveClass) =>
    liveClass?.educatorName ||
    liveClass?.teacherName ||
    liveClass?.mentorName ||
    liveClass?.instructor ||
    liveClass?.teacher ||
    liveClass?.facultyName ||
    null;

  const getLocation = (liveClass) =>
    liveClass?.location ||
    liveClass?.room ||
    liveClass?.venue ||
    (liveClass?.isOnline ? "Online" : null);

  const normalizedResults = (results || []).map((r) => {
    const testId = r.testId || r.test?._id || r.test || r._id;
    const testTitle = r.testTitle || r.title || r.name;
    const totalScore = r.totalScore ?? r.totalMarks ?? r.total ?? 0;
    const obtainedScore = r.obtainedScore ?? r.obtained ?? r.score ?? 0;
    const totalCorrect = r.totalCorrect ?? r.correct ?? 0;
    const totalIncorrect = r.totalIncorrect ?? r.incorrect ?? 0;
    const percentage = totalScore
      ? Math.round((obtainedScore / totalScore) * 100)
      : 0;
    const submittedAt = r.createdAt || r.submittedAt || r.date || null;

    return {
      raw: r,
      testId,
      testTitle,
      totalScore,
      obtainedScore,
      totalCorrect,
      totalIncorrect,
      percentage,
      submittedAt,
    };
  });

  const recentResults = Array.from(
    normalizedResults
      .reduce((map, entry) => {
        const key = entry.testId || entry.testTitle || `unknown-${map.size}`;
        const entryTime = entry.submittedAt ? Date.parse(entry.submittedAt) : 0;
        if (!map.has(key)) {
          map.set(key, entry);
          return map;
        }
        const current = map.get(key);
        const currentTime = current.submittedAt
          ? Date.parse(current.submittedAt)
          : 0;
        if (entryTime > currentTime) {
          map.set(key, entry);
        }
        return map;
      }, new Map())
      .values()
  )
    .sort((a, b) => {
      const tsA = a.submittedAt ? Date.parse(a.submittedAt) : 0;
      const tsB = b.submittedAt ? Date.parse(b.submittedAt) : 0;
      return tsB - tsA;
    })
    .slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const ts = Date.parse(dateStr);
    if (Number.isNaN(ts)) return "";
    return new Date(ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiBookOpen}
          title="Enrolled Courses"
          value={totalCourses}
          bgColor="bg-blue-50"
          borderColor="border-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={FiTarget}
          title="Tests Taken"
          value={totalResults}
          bgColor="bg-green-50"
          borderColor="border-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={FiUsers}
          title="Following"
          value={followingEducatorsLength}
          bgColor="bg-purple-50"
          borderColor="border-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Tests
              </h3>
              {tests.length > 5 && (
                <button
                  onClick={() => onTabChange("results")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              )}
            </div>
          </div>
          <div className="p-6">
            {recentResults.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-800">
                    Recent Test Performance
                  </p>
                  <button
                    type="button"
                    onClick={() => onTabChange?.("results")}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View detailed results
                  </button>
                </div>
                <div className="space-y-3">
                  {recentResults.map((item, idx) => {
                    const dateLabel =
                      formatDate(item.submittedAt) || `Attempt ${idx + 1}`;
                    return (
                      <div
                        key={item.testId || idx}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p
                            className="text-sm font-semibold text-gray-900 truncate"
                            title={item.testTitle || "Test"}
                          >
                            {item.testTitle || "Test"}
                          </p>
                          <p className="text-xs text-gray-500">{dateLabel}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {item.obtainedScore}/{item.totalScore}
                            </p>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-700">
                              {item.percentage}%
                            </p>
                            <p className="text-xs text-gray-500">Accuracy</p>
                          </div>
                          <div className="hidden sm:flex gap-2 text-xs text-gray-600">
                            <span>✓ {item.totalCorrect}</span>
                            <span>✕ {item.totalIncorrect}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tests.length > 0 ? (
              <div className="space-y-4">
                {tests.slice(0, 5).map((test, index) => {
                  const seriesId = getSeriesId(test);
                  const series = getSeries(seriesId);

                  return (
                    <div
                      key={test._id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                          <FiAward className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          {(() => {
                            const title =
                              series?.title ||
                              `Test Series #${seriesId || "N/A"}`;
                            const slug = series?.slug;
                            return slug ? (
                              <Link
                                href={`/live-test/series/${slug}`}
                                className="text-sm font-semibold text-blue-600 hover:underline"
                                title={title}
                              >
                                {title}
                              </Link>
                            ) : (
                              <p
                                className="text-sm font-semibold text-gray-900"
                                title={title}
                              >
                                {title}
                              </p>
                            );
                          })()}
                          {series && (
                            <div className="mt-1 flex items-center gap-2">
                              {series.subject && (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-medium uppercase tracking-wide">
                                  {series.subject}
                                </span>
                              )}
                              {series.specialization && (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium uppercase tracking-wide">
                                  {series.specialization}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {series?.noOfTests
                            ? `${series.noOfTests} Tests`
                            : "Test Series"}
                        </p>
                        <div className="flex items-center space-x-2 text-xs">
                          {series?.price && (
                            <span className="text-green-600 font-medium">
                              ₹{series.price}
                            </span>
                          )}
                          {test.status && (
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                                test.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : test.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {test.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : recentResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiAward className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No tests enrolled yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Enroll in test series to see them here
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Upcoming Live Class */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Upcoming Live Class
              </h3>
              <p className="text-sm text-gray-500">
                Stay on top of your next session
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange?.("liveclasses")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Go to Live Classes →
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            {liveLoading ? (
              <div className="flex items-center gap-3 text-gray-600">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span>Loading upcoming classes...</span>
              </div>
            ) : liveError ? (
              <div className="text-sm text-red-600 font-medium">
                {liveError}
              </div>
            ) : nextClass ? (
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 w-max">
                  <FiVideo className="h-4 w-4" />
                  Upcoming session
                </div>

                <button
                  type="button"
                  onClick={() => onTabChange?.("liveclasses")}
                  className="text-left"
                >
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
                    <div className="shrink-0 h-14 w-14 rounded-full bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-700">
                      <span className="text-[11px] font-semibold leading-tight uppercase">
                        {formatDateTime(nextClass?.classTiming, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-[10px] font-medium text-blue-500">
                        {formatDateTime(nextClass?.classTiming, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {nextClass?.liveClassTitle || "Untitled live class"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {[
                          getInstructor(nextClass) || "Instructor TBD",
                          getLocation(nextClass) || "Online",
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  </div>
                </button>

                <div className="flex items-center justify-between text-xs text-blue-700">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <FiCalendar className="h-4 w-4" />
                    {formatDateTime(nextClass?.classTiming, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const link = getMeetingLink(nextClass);
                      if (link) {
                        window.open(link, "_blank", "noopener,noreferrer");
                        return;
                      }
                      onTabChange?.("liveclasses");
                    }}
                    className="text-blue-600 font-semibold hover:text-blue-700"
                  >
                    {getMeetingLink(nextClass) ? "Join" : "View all"} →
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <FiCalendar className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-800 font-semibold">No classes today</p>
                <p className="text-sm text-gray-500">
                  You are all caught up. Check your schedule for upcoming
                  sessions.
                </p>
                <button
                  type="button"
                  onClick={() => onTabChange?.("liveclasses")}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Go to Live Classes →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
