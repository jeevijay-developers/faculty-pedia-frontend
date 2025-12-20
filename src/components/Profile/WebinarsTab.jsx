"use client";

import React, { useEffect, useState } from "react";
import { getUpcomingWebinars } from "@/components/server/student/student.routes";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiUsers, FiExternalLink } from "react-icons/fi";
import Image from "next/image";

const WebinarsTab = ({ studentId }) => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not available");
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchWebinars = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getUpcomingWebinars(studentId);
        if (!mounted) return;

        // Handle different response structures
        const webinarsList = Array.isArray(data.upcomingWebinars)
          ? data.upcomingWebinars
          : [];
        setWebinars(webinarsList);
      } catch (err) {
        console.error("Failed to load webinars:", err);

        if (!mounted) return;

        let errorMessage = "Failed to load webinars";

        if (err.response?.status === 404) {
          errorMessage = "No webinars found";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied to webinars";
        } else if (err.response?.status === 500) {
          errorMessage = "Server error while loading webinars";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchWebinars();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    try {
      // Handle different time formats
      if (timeString.includes(":")) {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch (e) {
      return timeString;
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading webinars...</span>
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

  if (!webinars.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-600 text-lg">No upcoming webinars found</div>
        <p className="text-gray-500 mt-2">
          You haven't enrolled in any upcoming webinars yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {webinars.map((webinar) => (
          <div
            key={webinar._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
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
                    <FiUsers className="w-12 h-12 mx-auto mb-2" />
                    <span className="text-sm">Webinar</span>
                  </div>
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    webinar.webinarType === "OTO"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {webinar.webinarType === "OTO" ? "One-to-One" : "One-to-All"}
                </span>
              </div>

              {/* Price Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-black bg-opacity-70 text-white rounded-full text-xs font-medium">
                  {webinar.fees === 0 ? "Free" : `₹${webinar.fees}`}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {webinar.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {webinar.description?.short ||
                  webinar.description?.long ||
                  "No description available"}
              </p>

              {/* Details */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(webinar.date)}</span>
                </div>

                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>
                    {formatTime(webinar.time)} ({webinar.duration} min)
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-2">Subject:</span>
                  <span className="capitalize">{webinar.subject}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-2">Level:</span>
                  <span>{webinar.specialization}</span>
                </div>

                {webinar.seatLimit && (
                  <div className="flex items-center">
                    <FiUsers className="w-4 h-4 mr-2" />
                    <span>
                      Seats: {webinar.enrolledStudents?.length || 0}/
                      {webinar.seatLimit}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => {
                    window.location.href = `/student-webinars/${webinar._id}`;
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join webinar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebinarsTab;
