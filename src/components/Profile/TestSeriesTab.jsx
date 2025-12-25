"use client";

import React, { useEffect, useState } from "react";
import { getUpcomingTestSeries } from "@/components/server/student/student.routes";
import { getTestsBySeries, getTestById } from "@/components/server/test.route";
import toast from "react-hot-toast";
import { FiFileText, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";

const TestSeriesTab = ({ studentId }) => {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSeriesId, setExpandedSeriesId] = useState(null);
  const [testsBySeries, setTestsBySeries] = useState({});
  const [testsLoading, setTestsLoading] = useState({});
  const router = useRouter();

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

        const enrolledSeries = seriesList.filter((series) => {
          const list = series?.enrolledStudents;
          if (!Array.isArray(list)) return false;
          return list.some((entry) => {
            if (!studentId) return false;
            const sid = studentId.toString();
            if (typeof entry === "string" || typeof entry === "number") {
              return entry.toString() === sid;
            }
            const candidate =
              entry?.studentId ||
              entry?.studentID ||
              entry?.student?.id ||
              entry?.student?._id ||
              entry?._id ||
              entry?.id;
            return candidate ? candidate.toString() === sid : false;
          });
        });

        setTestSeries(enrolledSeries);
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

  const isSeriesActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getTestsCount = (series) => {
    if (Array.isArray(series?.tests) && series.tests.length > 0) return series.tests.length;
    if (Array.isArray(series?.liveTests) && series.liveTests.length > 0) return series.liveTests.length;
    if (typeof series?.numberOfTests === "number") return series.numberOfTests;
    if (typeof series?.noOfTests === "number") return series.noOfTests;
    return 0;
  };

  const getSeriesStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { status: "upcoming", color: "blue" };
    if (now > end) return { status: "completed", color: "gray" };
    return { status: "active", color: "green" };
  };

  const handleStartTest = (series) => {
    const seriesId = series?._id || series?.id;
    if (!seriesId) {
      toast.error("Series id unavailable right now");
      return;
    }

    const nextExpanded = expandedSeriesId === seriesId ? null : seriesId;
    setExpandedSeriesId(nextExpanded);

    if (!nextExpanded) return;

    // If tests are already on the series payload, seed them and skip API
    if (!testsBySeries[seriesId]) {
      const embedded = Array.isArray(series?.tests)
        ? series.tests
        : Array.isArray(series?.liveTests)
        ? series.liveTests
        : null;

      if (embedded && embedded.length > 0) {
        hydrateTests(seriesId, embedded);
        return;
      }

      setTestsLoading((prev) => ({ ...prev, [seriesId]: true }));
      getTestsBySeries(seriesId, { limit: 50 })
        .then((res) => {
          const tests = res?.tests || res?.data?.tests || res?.data || [];
          hydrateTests(seriesId, tests);
        })
        .catch((err) => {
          console.error("Failed to load tests for series", err);
          toast.error("Could not load tests for this series");
          setTestsBySeries((prev) => ({ ...prev, [seriesId]: [] }));
        })
        .finally(() => {
          // hydrateTests toggles loading, so only clear here if hydration did not run
          setTestsLoading((prev) => ({ ...prev, [seriesId]: false }));
        });
    }
  };

  const handleJoinTest = (test) => {
    const targetSlug = test?.slug || test?._id || test?.id;
    if (!targetSlug) {
      toast.error("Test link unavailable right now");
      return;
    }
    router.push(`/test-panel/${targetSlug}`);
  };

  const hydrateTests = async (seriesId, tests) => {
    // If tests already include titles/descriptions and slug/id, keep them
    const needsHydration = tests.some(
      (t) => !t || !t.title || !t.description || (!t.slug && !t._id && !t.id)
    );

    if (!needsHydration) {
      setTestsBySeries((prev) => ({ ...prev, [seriesId]: tests }));
      return;
    }

    try {
      setTestsLoading((prev) => ({ ...prev, [seriesId]: true }));
      const enriched = await Promise.all(
        tests.map(async (t) => {
          // If the item is just an id or lacks essential fields, fetch details
          const id = t?._id || t?.id || t;
          const alreadyHas = t && t.title && (t.slug || t._id || t.id);
          if (!id || alreadyHas) return t;
          try {
            const detail = await getTestById(id);
            return detail?.data || detail || t;
          } catch (err) {
            console.error("Failed to hydrate test", id, err);
            return t;
          }
        })
      );
      setTestsBySeries((prev) => ({ ...prev, [seriesId]: enriched }));
    } finally {
      setTestsLoading((prev) => ({ ...prev, [seriesId]: false }));
    }
  };

  const statusBadgeClass = (color) => {
    if (color === "green") return "bg-green-100 text-green-800";
    if (color === "blue") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
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
        <div className="text-gray-600 text-lg">No enrolled test series</div>
        <p className="text-gray-500 mt-2">
          You haven't enrolled in any test series yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {testSeries.map((series) => {
          const statusInfo = getSeriesStatus(series.startDate, series.endDate);
          const descriptionText =
            series.description?.short ||
            series.description?.long ||
            "Comprehensive test series to boost your preparation";
          const seriesId = series?._id || series?.id;
          const testsCount = testsBySeries[seriesId]?.length ?? getTestsCount(series);
          const isExpanded = expandedSeriesId === seriesId;

          return (
            <div
              key={series._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 leading-snug">
                    {series.title || "Test Series"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {descriptionText}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiFileText className="w-4 h-4" />
                    <span>{testsCount} tests</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => handleStartTest(series)}
                    aria-label={isExpanded ? "Hide tests" : "Show tests"}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-700 transition-transform duration-200 shadow-sm"
                  >
                    <FiChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border border-gray-100 rounded-lg bg-gray-50 p-3 space-y-3">
                  {testsLoading[seriesId] ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Loading tests...</span>
                    </div>
                  ) : testsBySeries[seriesId] && testsBySeries[seriesId].length > 0 ? (
                    testsBySeries[seriesId].map((test) => (
                      <div
                        key={test._id || test.id || test.slug}
                        className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {test.title || "Test"}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {test.description || "No description provided."}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center justify-end w-full sm:w-auto">
                          <button
                            onClick={() => handleJoinTest(test)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            Start Test
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tests available for this series.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestSeriesTab;
