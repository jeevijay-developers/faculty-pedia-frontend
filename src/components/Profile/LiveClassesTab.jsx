"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiBookOpen,
  FiAlertCircle,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";
import { getEnrolledLiveClasses } from "@/components/server/student/student.routes";

const capitalize = (value) =>
  typeof value === "string" && value.length
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value;

const formatList = (value) => {
  if (Array.isArray(value) && value.length) {
    return value.map(capitalize).join(", ");
  }
  if (typeof value === "string" && value.trim().length) {
    return capitalize(value.trim());
  }
  return "—";
};

const formatFee = (fee) => {
  if (fee === 0) return "Free";
  if (typeof fee === "number") return `₹${fee.toLocaleString("en-IN")}`;
  return fee ? `₹${fee}` : "—";
};

const formatDate = (value) => {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "Time not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time not set";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusMeta = (classTiming, durationMinutes) => {
  const start = classTiming ? new Date(classTiming) : null;
  const now = new Date();

  if (!start || Number.isNaN(start.getTime())) {
    return { label: "Scheduled", badgeClass: "bg-gray-100 text-gray-700" };
  }

  const durationMs = (Number(durationMinutes) || 0) * 60000;
  const end = new Date(start.getTime() + durationMs);

  if (now < start) {
    return { label: "Upcoming", badgeClass: "bg-blue-50 text-blue-700" };
  }

  if (durationMs > 0 && now >= start && now <= end) {
    return { label: "Live now", badgeClass: "bg-green-50 text-green-700" };
  }

  if (durationMs === 0 && now >= start) {
    return { label: "Started", badgeClass: "bg-green-50 text-green-700" };
  }

  return { label: "Completed", badgeClass: "bg-gray-100 text-gray-600" };
};

const getMeetingLink = (liveClass) =>
  liveClass?.liveClassLink ||
  liveClass?.classLink ||
  liveClass?.meetingLink ||
  liveClass?.recordingURL;

const LiveClassesTab = ({ studentId }) => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not available");
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { liveClasses: enrolled = [] } = await getEnrolledLiveClasses(
          studentId
        );

        if (!mounted) return;
        setLiveClasses(enrolled);
      } catch (err) {
        console.error("Failed to load live classes:", err);
        if (!mounted) return;

        const message =
          err?.response?.data?.message || err?.message || "Failed to load live classes";
        setError(message);
        toast.error(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  const visibleLiveClasses = useMemo(() => {
    return (liveClasses || []).filter((lc) => !lc?.isCompleted);
  }, [liveClasses]);

  const sortedLiveClasses = useMemo(() => {
    return [...visibleLiveClasses].sort((a, b) => {
      const aTime = Date.parse(a?.classTiming || "");
      const bTime = Date.parse(b?.classTiming || "");
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
      return aTime - bTime;
    });
  }, [visibleLiveClasses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading live classes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 text-lg font-medium">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!sortedLiveClasses.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-600 text-lg">No live classes found</div>
        <p className="text-gray-500 mt-2">
          You have not enrolled in any live classes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedLiveClasses.map((liveClass) => {
          const status = getStatusMeta(liveClass?.classTiming, liveClass?.classDuration);
          const enrolledCount = liveClass?.enrolledStudents?.length || 0;
          const maxSeats = liveClass?.maxStudents;
          const meetingLink = getMeetingLink(liveClass);

          return (
            <div
              key={liveClass?._id || liveClass?.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Live Class
                    </p>
                    <h3 className="font-semibold text-lg text-gray-900 leading-snug line-clamp-2">
                      {liveClass?.liveClassTitle || "Untitled live class"}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${status.badgeClass}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {liveClass?.description || "No description provided."}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{formatDate(liveClass?.classTiming)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-2 text-blue-600" />
                    <span>
                      {formatTime(liveClass?.classTiming)} • {liveClass?.classDuration || 0} mins
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiBookOpen className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="capitalize">{formatList(liveClass?.subject)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiLayers className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{formatList(liveClass?.class)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="w-4 h-4 mr-2 text-blue-600" />
                    <span>
                      Seats: {enrolledCount}
                      {typeof maxSeats === "number" ? `/${maxSeats}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TbCurrencyRupee className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{formatFee(liveClass?.liveClassesFee)}</span>
                  </div>
                </div>

                {liveClass?.isCourseSpecific && liveClass?.assignInCourse && (
                  <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Course specific</span>
                  </div>
                )}

                {liveClass?.isCompleted && (
                  <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Marked as completed</span>
                  </div>
                )}

                {meetingLink ? (
                  <a
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Join Live Class
                  </a>
                ) : (
                  <div className="rounded-md border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500 text-center">
                    Link will appear once provided
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveClassesTab;
