"use client";

import React, { useEffect, useState } from "react";
import { fetchLiveClassById } from "@/components/server/exams/iit-jee/routes";
import Loading from "@/components/Common/Loading";
import {
  FaBook,
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaGraduationCap,
  FaVideo,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import EnrollButton from "@/components/Common/EnrollButton";
import ShareButton from "@/components/Common/ShareButton";
import { isAuthenticated } from "@/utils/auth";

const LiveClassDetailsPage = ({ params }) => {
  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    // Resolve student ID from localStorage if available
    try {
      const userData = JSON.parse(
        typeof window !== "undefined"
          ? localStorage.getItem("faculty-pedia-student-data") || "{}"
          : "{}"
      );
      const resolvedId = userData?._id || userData?.id;
      if (resolvedId) setStudentId(resolvedId);
    } catch (e) {
      console.warn("Unable to parse student data", e);
    }
  }, []);

  useEffect(() => {
    const fetchLiveClassDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching live class with ID:", id);
        const response = await fetchLiveClassById(id);
        console.log("Live Class API Response:", response);

        // Handle response structure
        let classData = null;
        if (response?.data?.liveClass) {
          classData = response.data.liveClass;
        } else if (response?.liveClass) {
          classData = response.liveClass;
        } else if (response?.data) {
          classData = response.data;
        } else {
          classData = response;
        }

        console.log("Live Class Data:", classData);
        setLiveClass(classData);
      } catch (error) {
        console.error("Error fetching live class:", error);
        setError(error.message || "Failed to load live class details");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClassDetails();
  }, [id]);

  useEffect(() => {
    if (!liveClass || !studentId) return;

    const enrolled = Array.isArray(liveClass.enrolledStudents)
      ? liveClass.enrolledStudents.some((entry) => {
          const entryId =
            typeof entry === "string"
              ? entry
              : entry?.studentId ||
                entry?.studentID ||
                entry?.userId ||
                entry?.user ||
                entry?._id ||
                entry?.id ||
                entry?.student?._id;
          return entryId && entryId.toString() === studentId.toString();
        })
      : false;

    setIsEnrolled(enrolled);
  }, [liveClass, studentId]);

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const seatsFilled = liveClass?.enrolledStudents?.length || 0;
  const seatLimit = liveClass?.maxStudents || 0;
  const seatFillPercent = seatLimit
    ? Math.min(100, Math.round((seatsFilled / seatLimit) * 100))
    : 0;

  const subjectsLabel = Array.isArray(liveClass?.subject)
    ? liveClass.subject.join(", ")
    : liveClass?.subject || "Subject";
  const classTags = Array.isArray(liveClass?.class) ? liveClass.class : [];
  const specTags = Array.isArray(liveClass?.liveClassSpecification)
    ? liveClass.liveClassSpecification
    : [];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!liveClass) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Live class not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Header Card */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {specTags.map((spec, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-600"
                >
                  {spec}
                </span>
              ))}
              {classTags.map((cls, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-purple-600"
                >
                  {cls}
                </span>
              ))}
            </div>

            <ShareButton
              title={liveClass.liveClassTitle || "Live Class"}
              text={`Join the live class "${liveClass.liveClassTitle}" on Faculty Pedia.`}
              useCurrentUrl
              size="sm"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            {liveClass.liveClassTitle}
          </h1>

          {liveClass.educatorID && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <IoPersonSharp className="w-5 h-5" />
              </div>
              <p className="text-slate-600 font-medium">
                Instructor:{" "}
                <span className="text-slate-900">
                  {liveClass.educatorID?.fullName ||
                    liveClass.educatorID?.username ||
                    "Instructor"}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* Stats Bar */}
        <section className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                <FaClock />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {liveClass.classDuration || "-"}
                </div>
                <div className="text-sm text-slate-500">Minutes</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                <FaUsers />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {liveClass.maxStudents || 0}
                </div>
                <div className="text-sm text-slate-500">Max Students</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                <FaGraduationCap />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {seatsFilled}
                </div>
                <div className="text-sm text-slate-500">Enrolled</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                <FaBook />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {subjectsLabel}
                </div>
                <div className="text-sm text-slate-500">Subjects</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <article className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Description
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {liveClass.description ||
                  "Interactive live class session with expert instructor."}
              </p>
            </article>

            {liveClass.classTiming && (
              <article className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex items-center gap-3 md:w-48 shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                    <FaCalendarAlt />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Schedule</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-8 text-slate-700 text-sm md:text-base w-full">
                  <div>
                    Date:{" "}
                    <span className="font-medium">
                      {formatDate(liveClass.classTiming)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-slate-400" />
                    <span>Time: {formatTime(liveClass.classTiming)}</span>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100">
              <div className="text-center mb-2">
                <span className="text-4xl font-bold text-blue-600">
                  ₹{(liveClass.liveClassesFee || 0).toLocaleString()}
                </span>
              </div>
              <div className="text-center text-sm text-slate-600 mb-3 font-medium">
                {seatsFilled} / {seatLimit || 0} seats filled
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 mb-6 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${seatFillPercent}%` }}
                />
              </div>

              <EnrollButton
                type="liveClass"
                itemId={liveClass._id || liveClass.id}
                price={liveClass.liveClassesFee}
                joinLabel="Enroll Now"
                initialEnrolled={isEnrolled}
                onEnrollmentSuccess={({ alreadyEnrolled }) => {
                  const link =
                    liveClass?.liveClassLink ||
                    liveClass?.classLink ||
                    liveClass?.meetingLink ||
                    liveClass?.recordingURL;

                  if (link) {
                    window.open(link, "_blank", "noopener,noreferrer");
                  }

                  const target = studentId
                    ? `/profile/student/${studentId}?tab=liveclasses`
                    : "/profile?tab=liveclasses";

                  window.location.href = target;
                  return true;
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              />

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">
                  This class includes:
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-slate-900">✓</span>
                    <span>{liveClass.classDuration} minutes live session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-slate-900">✓</span>
                    <span>One-on-one interaction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-slate-900">✓</span>
                    <span>Q&amp;A session</span>
                  </li>
                  {liveClass.recordingURL && (
                    <li className="flex items-start gap-3">
                      <span className="text-slate-900">✓</span>
                      <span>Recording available</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LiveClassDetailsPage;
