"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getWebinarById,
  verifyWebinarAttendance,
} from "@/components/server/student/student.routes";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiUser,
  FiStar,
  FiExternalLink,
  FiFileText,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import EnrollButton from "@/components/Common/EnrollButton";

const StudentWebinarDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [webinar, setWebinar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceVerified, setAttendanceVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [canShowLinks, setCanShowLinks] = useState(false);

  const resolvedDescription = useMemo(() => {
    if (!webinar) return "";
    const desc = webinar.description;
    if (!desc) return "";
    if (typeof desc === "string") return desc;
    return desc.long || desc.short || "";
  }, [webinar]);

  const { displayDate, displayTime } = useMemo(() => {
    if (!webinar) return { displayDate: "", displayTime: "" };

    const timingValue = webinar.timing || webinar.date;
    const timingDate = timingValue ? new Date(timingValue) : null;
    const hasValidTiming = timingDate && !Number.isNaN(timingDate.getTime());

    let dateText = "";
    let timeText = "";

    if (hasValidTiming) {
      dateText = timingDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      timeText = timingDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (webinar.date) {
      const dateOnly = new Date(webinar.date);
      if (!Number.isNaN(dateOnly.getTime())) {
        dateText = dateOnly.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      if (webinar.time) {
        timeText = webinar.time;
      }
    }

    return { displayDate: dateText, displayTime: timeText };
  }, [webinar]);

  useEffect(() => {
    // Get student ID from localStorage
    try {
      const userData = localStorage.getItem("faculty-pedia-student-data");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setStudentId(parsedUserData._id);
      } else {
        setError("Please log in to view webinar details");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Authentication error");
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setError("Invalid webinar ID");
      setLoading(false);
      return;
    }

    const fetchWebinarDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const webinarData = await getWebinarById(id);
        setWebinar(webinarData);
      } catch (err) {
        console.error("Failed to load webinar details:", err);

        let errorMessage = "Failed to load webinar details";

        if (err.response?.status === 404) {
          errorMessage = "Webinar not found";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied";
        } else if (err.response?.status === 500) {
          errorMessage = "Server error while loading webinar";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinarDetails();
  }, [id]);

  useEffect(() => {
    if (webinar && studentId && !attendanceVerified) {
      verifyAttendance();
    }
  }, [webinar, studentId]);

  useEffect(() => {
    if (attendanceVerified && webinar) {
      checkIfCanShowLinks();

      // Set up interval to check time every minute
      const interval = setInterval(() => {
        checkIfCanShowLinks();
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [attendanceVerified, webinar]);

  const verifyAttendance = async () => {
    if (!studentId || !id) return;

    try {
      setVerifying(true);
      const response = await verifyWebinarAttendance(id, studentId);

      // If the API call succeeds, the student is enrolled
      setAttendanceVerified(true);
      checkIfCanShowLinks();
      toast.success("Access verified successfully");
    } catch (err) {
      console.error("Attendance verification failed:", err);
      setAttendanceVerified(false);

      if (err.response?.status === 400) {
        toast.error("Please enroll in the webinar before accessing links");
      } else if (err.response?.status === 404) {
        toast.error("Webinar not found");
      } else {
        toast.error("Failed to verify enrollment");
      }
    } finally {
      setVerifying(false);
    }
  };

  const checkIfCanShowLinks = () => {
    if (!webinar || !attendanceVerified) return;

    const now = new Date();
    const baseDate = webinar.timing
      ? new Date(webinar.timing)
      : webinar.date
        ? new Date(webinar.date)
        : null;

    if (!baseDate || Number.isNaN(baseDate.getTime())) return;

    const webinarTime = webinar.time;

    if (webinarTime && webinarTime.includes(":")) {
      const [hours, minutes] = webinarTime.split(":");
      baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    const timeDifference = Math.abs(now.getTime() - baseDate.getTime());
    const oneHourInMs = 60 * 60 * 1000;

    if (timeDifference <= oneHourInMs || now >= baseDate) {
      setCanShowLinks(true);
    }
  };

  const formatTime = (timeString) => {
    try {
      if (timeString && timeString.includes(":")) {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      return timeString || "";
    } catch (e) {
      return timeString || "";
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;

    if (typeof image === "string") {
      return image.trim() !== "" ? image : null;
    }

    if (typeof image === "object" && image.url) {
      return image.url.trim() !== "" ? image.url : null;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-gray-600">Loading webinar details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Webinar
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">📹</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Webinar Not Found
          </h2>
          <p className="text-gray-600">
            The requested webinar could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Webinar Details
              </h1>
              <p className="text-sm text-gray-600">
                View and access your enrolled webinar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Webinar Image and Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-64 md:h-80 bg-gray-100">
                {getImageUrl(webinar.image) ? (
                  <Image
                    src={getImageUrl(webinar.image)}
                    alt={webinar.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="text-gray-500 text-center">
                      <FiUsers className="w-16 h-16 mx-auto mb-4" />
                      <span className="text-lg">Webinar</span>
                    </div>
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      webinar.webinarType === "OTO"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {webinar.webinarType === "OTO"
                      ? "One-to-One"
                      : "One-to-All"}
                  </span>
                  {attendanceVerified && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                      <FiCheckCircle className="w-4 h-4 mr-1" />
                      Enrolled
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black bg-opacity-70 text-white rounded-full text-sm font-medium">
                    {webinar.fees === 0 ? "Free" : `₹${webinar.fees}`}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {webinar.title}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {displayDate || "Date to be announced"} {displayTime && `• ${displayTime}`}
                    </p>
                  </div>
                  {!attendanceVerified && (
                    <EnrollButton
                      type="webinar"
                      itemId={webinar._id || webinar.id || id}
                      price={webinar.fees || 0}
                      title="Enroll & Join"
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700"
                      onEnrollmentSuccess={() => {
                        if (webinar.webinarLink) {
                          window.open(webinar.webinarLink, "_blank");
                          return true;
                        }
                        return false;
                      }}
                    />
                  )}
                </div>

                <div className="prose max-w-none text-gray-600 mb-6">
                  <p>
                    {resolvedDescription || "No description available"}
                  </p>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {displayDate || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiClock className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">
                        {displayTime || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {webinar.duration} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <TbCurrencyRupee className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Fee</p>
                      <p className="font-medium text-gray-900">
                        {webinar.fees === 0 ? "Free" : `₹${webinar.fees}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Webinar Links Section */}
            {attendanceVerified && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiExternalLink className="w-5 h-5 mr-2" />
                  Webinar Access
                </h2>

                {verifying ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-gray-600">Verifying access...</span>
                  </div>
                ) : canShowLinks ? (
                  <div className="space-y-4">
                    {webinar.webinarLink && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-2 flex items-center">
                          <FiExternalLink className="w-4 h-4 mr-2" />
                          Join Webinar
                        </h3>
                        <a
                          href={webinar.webinarLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4 mr-2" />
                          Join Now
                        </a>
                      </div>
                    )}

                    {webinar.assetsLinks && webinar.assetsLinks.length > 0 && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                          <FiFileText className="w-4 h-4 mr-2" />
                          Study Materials
                        </h3>
                        <div className="space-y-2">
                          {webinar.assetsLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <FiFileText className="w-4 h-4 mr-2" />
                              Material {index + 1}
                              <FiExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-800">
                      <FiAlertCircle className="w-5 h-5 mr-2" />
                      <div>
                        <p className="font-medium">
                          Links will be available at webinar time
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Access will be granted 30 minutes before the scheduled
                          time
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Educator Info */}
            {webinar.educatorId && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Instructor
                </h3>

                <div className="flex items-center space-x-4 mb-4">
                  {getImageUrl(webinar.educatorId.image) ? (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={getImageUrl(webinar.educatorId.image)}
                        alt={`${webinar.educatorId.firstName} ${webinar.educatorId.lastName}`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {webinar.educatorId.firstName}{" "}
                      {webinar.educatorId.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {webinar.educatorId.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Subject:</span>
                    <span>{webinar.educatorId.subject}</span>
                  </div>

                  {webinar.educatorId.rating && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Rating:</span>
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{webinar.educatorId.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Webinar Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {webinar.subject}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium text-gray-900">
                    {webinar.specialization}
                  </span>
                </div>

                {webinar.seatLimit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium text-gray-900">
                      {webinar.enrolledStudents?.length || 0}/
                      {webinar.seatLimit}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">
                    {webinar.webinarType === "OTO"
                      ? "One-to-One"
                      : "One-to-All"}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Registration Status
              </h3>

              {attendanceVerified ? (
                <div className="flex items-center text-green-600">
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Successfully Enrolled</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <FiAlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Not Enrolled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWebinarDetailPage;
