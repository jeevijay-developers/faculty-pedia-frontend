"use client";

import React, { useEffect, useState } from "react";
import { getUpcomingTestSeries } from "@/components/server/student/student.routes";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiFileText,
  FiUsers,
  FiDollarSign,
  FiPlay,
} from "react-icons/fi";
import Image from "next/image";

const TestSeriesTab = ({ studentId }) => {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not available");
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchTestSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getUpcomingTestSeries(studentId);

        if (!mounted) return;

        // Handle different response structures
        const seriesList = Array.isArray(data)
          ? data
          : data.testSeries || data.data || [];
        setTestSeries(seriesList);
      } catch (err) {
        console.error("Failed to load test series:", err);

        if (!mounted) return;

        let errorMessage = "Failed to load test series";

        if (err.response?.status === 404) {
          errorMessage = "No test series found";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied to test series";
        } else if (err.response?.status === 500) {
          errorMessage = "Server error while loading test series";
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

    fetchTestSeries();

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

  const isSeriesActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getSeriesStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { status: "upcoming", color: "blue" };
    if (now > end) return { status: "completed", color: "gray" };
    return { status: "active", color: "green" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading test series...</span>
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

  if (!testSeries.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-600 text-lg">No test series found</div>
        <p className="text-gray-500 mt-2">
          You haven't enrolled in any test series yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testSeries.map((series) => {
          const statusInfo = getSeriesStatus(series.startDate, series.endDate);

          return (
            <div
              key={series._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {getImageUrl(series.image) ? (
                  <Image
                    src={getImageUrl(series.image)}
                    alt={series.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100">
                    <div className="text-gray-500 text-center">
                      <FiFileText className="w-12 h-12 mx-auto mb-2" />
                      <span className="text-sm">Test Series</span>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      statusInfo.color === "green"
                        ? "bg-green-100 text-green-800"
                        : statusInfo.color === "blue"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusInfo.status}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black bg-opacity-70 text-white rounded-full text-xs font-medium">
                    ₹{series.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {series.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {series.description?.short ||
                    series.description?.long ||
                    "No description available"}
                </p>

                {/* Details */}
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatDate(series.startDate)} -{" "}
                      {formatDate(series.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FiFileText className="w-4 h-4 mr-2" />
                    <span>{series.noOfTests} Tests</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium mr-2">Subject:</span>
                    <span className="capitalize">{series.subject}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium mr-2">Level:</span>
                    <span>{series.specialization}</span>
                  </div>

                  {series.enrolledStudents && (
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-2" />
                      <span>{series.enrolledStudents.length} Enrolled</span>
                    </div>
                  )}

                  {series.liveTests && (
                    <div className="flex items-center">
                      <FiPlay className="w-4 h-4 mr-2" />
                      <span>
                        {series.liveTests.length} Live Tests Available
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {isSeriesActive(series.startDate, series.endDate) ? (
                    <button
                      onClick={() => {
                        // Navigate to test series page
                        if (series.slug) {
                          window.location.href = `/test-series/${series.slug}`;
                        } else {
                          window.location.href = `/test-series/${series._id}`;
                        }
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Tests
                    </button>
                  ) : statusInfo.status === "upcoming" ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-not-allowed"
                    >
                      Starts on {formatDate(series.startDate)}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Navigate to results or review page
                        if (series.slug) {
                          window.location.href = `/test-series/${series.slug}/results`;
                        } else {
                          window.location.href = `/test-series/${series._id}/results`;
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View Results
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestSeriesTab;
