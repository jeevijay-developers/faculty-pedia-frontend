"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiChevronDown, FiFileText, FiCheck } from "react-icons/fi";
import { getCourseById } from "@/components/server/course.routes";
import {
  getTestSeriesByCourse,
  getTestSeriesById,
} from "@/components/server/test-series.route";
import { getTestsBySeries, getTestById } from "@/components/server/test.route";
import { getVideos } from "@/components/server/video.routes";
import { getStudyMaterialsByCourse } from "@/components/server/study-material.routes";
import {
  getCourseProgress,
  toggleVideoComplete,
} from "@/components/server/progress.routes";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const trimmed = url.trim();
  if (/vimeo\.com\/\d+/.test(trimmed) && trimmed.includes("player.vimeo.com")) {
    return trimmed;
  }
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  const watchId = trimmed.includes("watch?v=")
    ? trimmed.split("v=")[1].split("&")[0]
    : null;
  const shortId = trimmed.includes("youtu.be/")
    ? trimmed.split("youtu.be/")[1].split("?")[0]
    : null;
  const videoId = watchId || shortId;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
};

const CoursePanelPage = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("courseId") || null;
  const [courseData, setCourseData] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseTests, setCourseTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [expandedSeriesId, setExpandedSeriesId] = useState(null);
  const [testsBySeries, setTestsBySeries] = useState({});
  const [seriesTestsLoading, setSeriesTestsLoading] = useState({});
  const [courseVideos, setCourseVideos] = useState([]);
  const [courseVideosLoading, setCourseVideosLoading] = useState(false);
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [courseMaterialsLoading, setCourseMaterialsLoading] = useState(false);
  const [completedVideos, setCompletedVideos] = useState({});
  const [studentId, setStudentId] = useState(null);
  const [togglingVideoId, setTogglingVideoId] = useState(null);

  // Get student ID from localStorage on mount
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("faculty-pedia-student-data")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setStudentId(parsed?._id || parsed?.id || null);
      }
    } catch (err) {
      console.warn("Failed to get student id", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!courseId) {
        setError("Missing courseId. Open this page via a course link.");
        setCourseTests([]);
        setCourseData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        let data = null;

        try {
          data = await getCourseById(courseId);
        } catch (err) {
          const status = err?.response?.status;
          if (status === 404) {
            // Fallback: treat identifier as slug even if it looked like an ObjectId
            data = await getCourseById(courseId, true);
          } else {
            throw err;
          }
        }

        if (data) {
          setCourseData(data);
          const first = data?.videos?.[0];
          setSelectedVideoId(first?.link || first?.url || null);
        } else {
          setCourseData(null);
          setSelectedVideoId(null);
          setError("Course not found");
        }
      } catch (err) {
        setCourseData(null);
        setSelectedVideoId(null);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  useEffect(() => {
    const resolvedCourseId = courseData?._id || courseData?.id || courseId;
    if (!resolvedCourseId) return;

    const initialSeries = Array.isArray(courseData?.testSeries)
      ? courseData.testSeries
      : [];

    if (initialSeries.length > 0) {
      setCourseTests(initialSeries);
      return;
    }

    let cancelled = false;
    const fetchTests = async () => {
      setTestsLoading(true);
      try {
        const res = await getTestSeriesByCourse(resolvedCourseId);
        const candidates = [
          res?.testSeries,
          res?.data?.testSeries,
          res?.data?.data?.testSeries,
          res?.data,
          res,
        ];
        const list = candidates.find(Array.isArray) || [];
        if (!cancelled) setCourseTests(list);
      } catch (err) {
        console.error("Failed to fetch course test series", err);
        if (!cancelled) setCourseTests([]);
      } finally {
        if (!cancelled) setTestsLoading(false);
      }
    };

    fetchTests();
    return () => {
      cancelled = true;
    };
  }, [courseData?._id, courseData?.id, courseData?.testSeries, courseId]);

  useEffect(() => {
    const resolvedCourseId = courseData?._id || courseData?.id || courseId;
    if (!resolvedCourseId) {
      setCourseVideos([]);
      return;
    }

    let cancelled = false;
    const loadVideos = async () => {
      try {
        setCourseVideosLoading(true);
        const videos = await getVideos({
          courseId: resolvedCourseId,
          isCourseSpecific: true,
          limit: 200,
        });
        if (!cancelled) setCourseVideos(Array.isArray(videos) ? videos : []);
      } catch (err) {
        console.error("Failed to load course videos", err);
        if (!cancelled) setCourseVideos([]);
      } finally {
        if (!cancelled) setCourseVideosLoading(false);
      }
    };

    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [courseData?._id, courseData?.id, courseId]);

  useEffect(() => {
    const resolvedCourseId = courseData?._id || courseData?.id || courseId;
    if (!resolvedCourseId) {
      setCourseMaterials([]);
      return;
    }

    let cancelled = false;
    const loadMaterials = async () => {
      try {
        setCourseMaterialsLoading(true);
        const materials = await getStudyMaterialsByCourse(resolvedCourseId, {
          limit: 200,
        });
        if (!cancelled) setCourseMaterials(Array.isArray(materials) ? materials : []);
      } catch (err) {
        console.error("Failed to load course study materials", err);
        if (!cancelled) setCourseMaterials([]);
      } finally {
        if (!cancelled) setCourseMaterialsLoading(false);
      }
    };

    loadMaterials();
    return () => {
      cancelled = true;
    };
  }, [courseData?._id, courseData?.id, courseId]);

  // Fetch video progress for this course and student
  useEffect(() => {
    const resolvedCourseId = courseData?._id || courseData?.id || courseId;
    if (!resolvedCourseId || !studentId) {
      setCompletedVideos({});
      return;
    }

    let cancelled = false;
    const loadProgress = async () => {
      try {
        const response = await getCourseProgress(resolvedCourseId, studentId);
        if (!cancelled && response?.success && response?.data?.completedVideos) {
          setCompletedVideos(response.data.completedVideos);
        }
      } catch (err) {
        console.error("Failed to load video progress", err);
        if (!cancelled) setCompletedVideos({});
      }
    };

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [courseData?._id, courseData?.id, courseId, studentId]);

  const allVideos = useMemo(() => {
    const embedded = Array.isArray(courseData?.videos)
      ? courseData.videos
      : [];
    const assigned = Array.isArray(courseVideos) ? courseVideos : [];

    const normalizeEntry = (video, index) => {
      if (!video) return null;
      const links = Array.isArray(video.links)
        ? video.links
        : video.link
        ? [video.link]
        : video.url
        ? [video.url]
        : [];
      const primaryUrl = links[0];
      const id =
        video._id ||
        video.id ||
        primaryUrl ||
        video.link ||
        video.url ||
        `video-${index}`;
      if (!primaryUrl || !id) return null;
      return {
        id,
        title: video.title || video.name || `Video ${index + 1}`,
        url: primaryUrl,
        description: video.description,
        duration: video.duration,
        topic: video.topic || video.subject,
        level: video.level,
      };
    };

    const combined = [...embedded, ...assigned]
      .map(normalizeEntry)
      .filter(Boolean);

    // Deduplicate by id/url to avoid showing the same video twice
    const unique = [];
    const seen = new Set();
    combined.forEach((v) => {
      const key = v.id || v.url;
      if (!key || seen.has(key)) return;
      seen.add(key);
      unique.push(v);
    });

    return unique;
  }, [courseData, courseVideos]);

  const assets = useMemo(() => {
    const embedded = Array.isArray(courseData?.studyMaterials)
      ? courseData.studyMaterials
      : [];
    const assigned = Array.isArray(courseMaterials) ? courseMaterials : [];

    const normalizeFromMaterial = (material, index) => {
      if (!material) return [];
      const materialTitle = material.title || `Asset ${index + 1}`;
      const docs = Array.isArray(material.docs) ? material.docs : [];
      // If material itself has link/url fallback
      const topLevelLink = material.link || material.url;
      const topLevelEntry = topLevelLink
        ? [{
            title: materialTitle,
            type: material.fileType || material.type || "PDF",
            size: material.size || material.sizeInBytes || "",
            url: topLevelLink,
            description: material.description || "",
          }]
        : [];

      const docEntries = docs.map((doc, docIdx) => {
        if (!doc?.url) return null;
        return {
          title:
            doc.originalName ||
            doc.name ||
            `${materialTitle} (${docIdx + 1})`,
          type: doc.fileType || doc.mimeType || "FILE",
          size: doc.sizeInBytes || "",
          url: doc.url,
          description: material.description || "",
        };
      }).filter(Boolean);

      return [...topLevelEntry, ...docEntries];
    };

    const combined = [...embedded, ...assigned]
      .flatMap(normalizeFromMaterial)
      .filter(Boolean);

    const unique = [];
    const seen = new Set();
    combined.forEach((a) => {
      const key = `${a.url}`;
      if (seen.has(key)) return;
      seen.add(key);
      unique.push(a);
    });

    return unique;
  }, [courseData, courseMaterials]);

  useEffect(() => {
    if (!allVideos || allVideos.length === 0) return;
    if (!selectedVideoId) {
      setSelectedVideoId(allVideos[0].id);
      return;
    }
    const stillExists = allVideos.some((v) => v.id === selectedVideoId);
    if (!stillExists) {
      setSelectedVideoId(allVideos[0].id);
    }
  }, [allVideos, selectedVideoId]);

  useEffect(() => {
    setShowVideoDropdown(false);
  }, [activeTab]);

  const currentVideo = useMemo(() => {
    if (!allVideos || allVideos.length === 0) return null;
    const found = allVideos.find((v) => v.id === selectedVideoId);
    return found || allVideos[0];
  }, [allVideos, selectedVideoId]);

  // Compute completed count from allVideos and completedVideos state
  const completedCount = useMemo(() => {
    if (!allVideos || allVideos.length === 0) return 0;
    return allVideos.filter((v) => completedVideos[v.id]?.isCompleted).length;
  }, [allVideos, completedVideos]);

  // Handle toggling video completion via checkbox
  const handleToggleVideoComplete = useCallback(
    async (e, videoId) => {
      e.stopPropagation(); // Prevent video selection when clicking checkbox
      const resolvedCourseId = courseData?._id || courseData?.id || courseId;

      if (!studentId || !resolvedCourseId || !videoId) return;

      const currentStatus = completedVideos[videoId]?.isCompleted || false;
      const newStatus = !currentStatus;

      // Optimistic update
      setCompletedVideos((prev) => ({
        ...prev,
        [videoId]: {
          isCompleted: newStatus,
          completedAt: newStatus ? new Date().toISOString() : null,
        },
      }));

      setTogglingVideoId(videoId);

      try {
        const response = await toggleVideoComplete(
          studentId,
          resolvedCourseId,
          videoId,
          newStatus
        );

        // Update with server response if different
        if (response?.success && response?.data) {
          setCompletedVideos((prev) => ({
            ...prev,
            [videoId]: {
              isCompleted: response.data.isCompleted,
              completedAt: response.data.completedAt,
            },
          }));
        }
      } catch (err) {
        console.error("Failed to toggle video completion", err);
        // Revert optimistic update on error
        setCompletedVideos((prev) => ({
          ...prev,
          [videoId]: {
            isCompleted: currentStatus,
            completedAt: currentStatus ? prev[videoId]?.completedAt : null,
          },
        }));
      } finally {
        setTogglingVideoId(null);
      }
    },
    [studentId, courseData, courseId, completedVideos]
  );

  const hasCourseTests = useMemo(
    () => Array.isArray(courseTests) && courseTests.length > 0,
    [courseTests]
  );

  const getTestsCount = (series) => {
    if (Array.isArray(series?.tests) && series.tests.length > 0)
      return series.tests.length;
    if (Array.isArray(series?.liveTests) && series.liveTests.length > 0)
      return series.liveTests.length;
    if (typeof series?.numberOfTests === "number") return series.numberOfTests;
    if (typeof series?.noOfTests === "number") return series.noOfTests;
    return 0;
  };

  const hydrateTests = async (seriesId, tests) => {
    const needsHydration = tests.some(
      (t) => !t || !t.title || !t.description || (!t.slug && !t._id && !t.id)
    );

    if (!needsHydration) {
      setTestsBySeries((prev) => ({ ...prev, [seriesId]: tests }));
      return;
    }

    try {
      setSeriesTestsLoading((prev) => ({ ...prev, [seriesId]: true }));
      const enriched = await Promise.all(
        tests.map(async (t) => {
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
      setSeriesTestsLoading((prev) => ({ ...prev, [seriesId]: false }));
    }
  };

  const fetchSeriesTests = async (series) => {
    const seriesId = series?._id || series?.id || null;
    const stateKey = seriesId || series?.slug;
    if (!stateKey || testsBySeries[stateKey]) return;

    const embedded = Array.isArray(series?.tests)
      ? series.tests
      : Array.isArray(series?.liveTests)
      ? series.liveTests
      : null;

    if (embedded && embedded.length > 0) {
      hydrateTests(stateKey, embedded);
      return;
    }

    if (!seriesId) {
      setTestsBySeries((prev) => ({ ...prev, [stateKey]: [] }));
      return;
    }

    setSeriesTestsLoading((prev) => ({ ...prev, [stateKey]: true }));

    try {
      const detail = await getTestSeriesById(seriesId);
      const detailSeries =
        detail?.testSeries ||
        detail?.data?.testSeries ||
        detail?.data ||
        detail;
      const fromDetail =
        (Array.isArray(detailSeries?.tests) && detailSeries.tests) ||
        (Array.isArray(detailSeries?.liveTests) && detailSeries.liveTests) ||
        [];
      if (fromDetail.length > 0) {
        hydrateTests(stateKey, fromDetail);
        return;
      }

      const res = await getTestsBySeries(seriesId, { limit: 50 });
      const tests = res?.tests || res?.data?.tests || res?.data || [];
      hydrateTests(stateKey, tests);
    } catch (err) {
      console.error("Failed to load tests for series", err);
      setTestsBySeries((prev) => ({ ...prev, [stateKey]: [] }));
    } finally {
      setSeriesTestsLoading((prev) => ({ ...prev, [stateKey]: false }));
    }
  };

  const handleToggleSeries = (series) => {
    const seriesId = series?._id || series?.id || null;
    const stateKey = seriesId || series?.slug;
    if (!stateKey) return;

    const nextExpanded = expandedSeriesId === stateKey ? null : stateKey;
    setExpandedSeriesId(nextExpanded);

    if (!nextExpanded) return;

    if (testsBySeries[stateKey]) return;

    fetchSeriesTests(series);
  };

  useEffect(() => {
    // Only redirect if tests loading is complete AND no tests exist
    if (!testsLoading && !hasCourseTests && activeTab === "tests") {
      setActiveTab("videos");
    }
  }, [hasCourseTests, activeTab, testsLoading]);

  // Preload tests/counts for all series so course-specific sets are hydrated without manual toggle
  useEffect(() => {
    if (!Array.isArray(courseTests) || courseTests.length === 0) return;
    courseTests.forEach((series) => {
      const key = series?._id || series?.id || series?.slug;
      if (!key || testsBySeries[key]) return;
      fetchSeriesTests(series);
    });
  }, [courseTests, testsBySeries]);

  const renderTests = () => {
    if (testsLoading && courseTests.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center text-slate-500">
          Loading test series...
        </div>
      );
    }

    if (!hasCourseTests) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center text-slate-500">
          No test series assigned to this course yet.
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Test Series</h2>
          <p className="text-sm text-slate-600">
            Course-specific tests and assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courseTests.map((ts, index) => {
            const seriesKey = ts._id || ts.id || ts.slug;
            const seriesTests = testsBySeries[seriesKey];
            const testsCount = seriesTests?.length ?? getTestsCount(ts);
            const isExpanded = expandedSeriesId === seriesKey;

            return (
              <div
                key={ts._id || ts.id || index}
                className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
                      {ts.title || "Untitled Test Series"}
                    </h3>
                    <p className="text-sm text-slate-600 whitespace-pre-line line-clamp-3">
                      {ts.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                        <FiFileText className="w-4 h-4" />
                      </span>
                      <span className="font-medium">{testsCount} tests</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSeries(ts)}
                    aria-label={isExpanded ? "Hide tests" : "Show tests"}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700 transition-transform duration-200 shadow-sm"
                  >
                    <FiChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <div className="border border-slate-100 rounded-lg bg-slate-50 p-3 space-y-3">
                    {seriesTestsLoading[seriesKey] ? (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        <span>Loading tests...</span>
                      </div>
                    ) : seriesTests && seriesTests.length > 0 ? (
                      seriesTests.map((test) => {
                        const targetSlug = test?.slug || test?._id || test?.id;
                        const href = targetSlug
                          ? `/test-panel/${encodeURIComponent(targetSlug)}`
                          : "#";
                        return (
                          <div
                            key={test._id || test.id || test.slug}
                            className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                                {test.title || "Test"}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {test.description || "No description provided."}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center justify-end w-full sm:w-auto">
                              <Link
                                href={href}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                              >
                                Start Test
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-500">
                        No tests available for this series.
                      </p>
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

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center text-text-secondary">
        Loading course...
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center text-text-secondary px-4">
        {error || "No course data available."}
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main dark:text-white">
      <div className="max-w-350 mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        {/* Breadcrumbs and Header */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link 
              href="/profile/student"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <Link 
              href={studentId ? `/profile/student/${studentId}?tab=my-courses` : "/profile/student"}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              My Courses
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-blue-600 font-medium line-clamp-1">
              {courseData?.title || "Course"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {courseData?.subject && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
                    {Array.isArray(courseData.subject)
                      ? courseData.subject.join(", ")
                      : courseData.subject}
                  </span>
                )}
                {courseData?.specialization && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
                    {Array.isArray(courseData.specialization)
                      ? courseData.specialization.join(", ")
                      : courseData.specialization}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                  In Progress
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {courseData?.title || "Course"}
              </h1>
              <p className="text-text-secondary text-lg max-w-3xl">
                {courseData?.subtitle || courseData?.description || ""}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary items-center pt-1">
                {courseData?.language && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">
                      language
                    </span>
                    <span>{courseData.language}</span>
                  </div>
                )}
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_today
                  </span>
                  <span>
                    {courseData?.startDate
                      ? new Date(courseData.startDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "Start date TBD"}
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                {courseData?.courseClass && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">
                      school
                    </span>
                    <span>Class {courseData.courseClass}</span>
                  </div>
                )}
              </div>
            </div>

          
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-12 flex flex-col gap-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-8">
                {[
                  { id: "videos", label: "Videos" },
                  { id: "assets", label: "Study Material" },
                  { id: "liveClasses", label: "Live Classes" },
                  { id: "tests", label: "Tests" },
                ].map((tab) => {
                  const active =
                    activeTab === tab.id ||
                    (!hasCourseTests && tab.id === "tests" && false);
                  return (
                    <button
                      key={tab.id}
                      className={`pb-4 px-2 border-b-2 transition-all text-lg ${
                        active
                          ? "text-blue-600 border-blue-600 font-bold"
                          : "text-text-secondary hover:text-blue-600 border-transparent hover:border-blue-300 font-medium"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Videos tab */}
            {activeTab === "videos" && (
              <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg group">
                    {currentVideo ? (
                      <iframe
                        src={getEmbedUrl(currentVideo.url)}
                        title={currentVideo.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : courseVideosLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        Loading videos...
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        No video selected
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        {/* <div className="flex gap-2 mb-2 text-xs text-text-secondary">
                          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-medium">
                            {activeTab === "videos" ? "Lesson" : ""}{" "}
                            {allVideos.findIndex(
                              (v) => v.id === currentVideo?.id
                            ) + 1 || 1}
                          </span>
                          {currentVideo?.duration && (
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-medium">
                              {currentVideo.duration}
                            </span>
                          )}
                        </div> */}
                        <h2 className="text-2xl font-bold leading-tight">
                          {currentVideo?.title || "Select a lesson"}
                        </h2>
                      </div>
                      {/* <div className="flex gap-2">
                        <button
                          className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          title="Previous Lesson"
                        >
                          <span className="material-symbols-outlined">
                            skip_previous
                          </span>
                        </button>
                        <button
                          className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          title="Next Lesson"
                        >
                          <span className="material-symbols-outlined">
                            skip_next
                          </span>
                        </button>
                      </div> */}
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                      {courseData?.description ||
                        "In this lecture, we dive into the selected topic. Download the attached worksheet for practice problems."}
                    </p>
                  </div>
                </div>

                <div className="w-full xl:w-90 flex flex-col gap-4">
                  <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-150">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 rounded-t-2xl">
                      <h3 className="font-bold text-blue-900 dark:text-blue-200">Course Content</h3>
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                        {completedCount}/{allVideos.length} Completed
                      </span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1 no-scrollbar">
                      {courseVideosLoading && allVideos.length === 0 && (
                        <div className="p-4 text-sm text-text-secondary">
                          Loading videos...
                        </div>
                      )}
                      {allVideos.map((video, idx) => {
                        const isActive = video.id === currentVideo?.id;
                        const isVideoCompleted = completedVideos[video.id]?.isCompleted || false;
                        const isToggling = togglingVideoId === video.id;
                        return (
                          <div
                            key={video.id}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                              isActive
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                                : "hover:bg-gray-50 dark:hover:bg-white/5"
                            }`}
                          >
                            {/* Checkbox for marking completion */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleVideoComplete(e, video.id)}
                              disabled={isToggling || !studentId}
                              className={`mt-0.5 size-5 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                                isVideoCompleted
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 dark:border-gray-600 hover:border-blue-600"
                              } ${isToggling ? "opacity-50 cursor-wait" : ""} ${
                                !studentId ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                              }`}
                              title={
                                !studentId
                                  ? "Login to track progress"
                                  : isVideoCompleted
                                  ? "Mark as incomplete"
                                  : "Mark as completed"
                              }
                            >
                              {isVideoCompleted && <FiCheck className="size-3" />}
                            </button>
                            {/* Video title - clickable to select */}
                            <button
                              type="button"
                              onClick={() => setSelectedVideoId(video.id)}
                              className="flex-1 min-w-0 text-left"
                            >
                              <div
                                className={`text-sm font-medium line-clamp-2 ${
                                  isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : isVideoCompleted
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-text-main dark:text-white"
                                }`}
                              >
                                {video.title}
                              </div>
                              <div
                                className={`text-xs mt-0.5 ${
                                  isActive
                                    ? "text-blue-600/70 dark:text-blue-400/70"
                                    : "text-text-secondary"
                                }`}
                              >
                                {video.duration || "—"}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                      {allVideos.length === 0 && (
                        <div className="p-4 text-sm text-text-secondary">
                          No videos available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assets tab */}
            {activeTab === "assets" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Course Assets</h3>
                  <span className="text-sm font-bold text-blue-600">
                    View All
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseMaterialsLoading && assets.length === 0 && (
                    <div className="col-span-3 text-sm text-text-secondary">
                      Loading study materials...
                    </div>
                  )}
                  {assets.map((asset, index) => (
                    <a
                      key={`${asset.title}-${index}`}
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:-translate-y-1 hover:shadow-md hover:border-blue-300 transition-all duration-300"
                    >
                      <div className="size-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">
                          description
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">{asset.title}</h4>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                          {asset.description || "Resource"}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          {asset.size || ""}
                        </p>
                      </div>
                    </a>
                  ))}
                  {assets.length === 0 && (
                    <div className="col-span-3 text-sm text-text-secondary">
                      No assets available.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Classes tab */}
            {activeTab === "liveClasses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Live Classes</h3>
                  {courseData?.liveClass?.length > 0 && (
                    <span className="text-sm font-medium text-text-secondary">
                      {courseData.liveClass.length} {courseData.liveClass.length === 1 ? 'class' : 'classes'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData?.liveClass?.map((liveClass, index) => {
                    const classDate = liveClass?.classTiming ? new Date(liveClass.classTiming) : null;
                    const now = new Date();
                    const isPast = classDate && classDate < now;
                    const isUpcoming = classDate && classDate > now;
                    const isToday = classDate && classDate.toDateString() === now.toDateString();
                    
                    return (
                      <div
                        key={liveClass._id || liveClass.id || index}
                        className="bg-white dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-3">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                isPast
                                  ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                  : isToday
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {isPast ? "Completed" : isToday ? "Today" : "Upcoming"}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-lg font-bold text-text-main dark:text-white line-clamp-2">
                            {liveClass.liveClassTitle || "Live Class"}
                          </h4>

                          {/* Date and Time */}
                          {classDate && (
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <span className="material-symbols-outlined text-[18px]">
                                calendar_today
                              </span>
                              <span>
                                {classDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="material-symbols-outlined text-[18px]">
                                schedule
                              </span>
                              <span>
                                {classDate.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          )}

                          {/* Duration */}
                          {liveClass.classDuration && (
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <span className="material-symbols-outlined text-[18px]">
                                timer
                              </span>
                              <span>{liveClass.classDuration} minutes</span>
                            </div>
                          )}

                          {/* Fee (only for non-course-specific classes) */}
                          {!liveClass.isCourseSpecific && liveClass.liveClassesFee > 0 && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                              <span className="material-symbols-outlined text-[18px]">
                                currency_rupee
                              </span>
                              <span>₹{liveClass.liveClassesFee}</span>
                            </div>
                          )}

                          {/* Join Button */}
                          <div className="pt-2">
                            {isPast && liveClass.recordingURL ? (
                              <a
                                href={liveClass.recordingURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  play_circle
                                </span>
                                Watch Recording
                              </a>
                            ) : liveClass.liveClassLink && !isPast ? (
                              <a
                                href={liveClass.liveClassLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  videocam
                                </span>
                                {isToday ? "Join Now" : "Join Class"}
                              </a>
                            ) : (
                              <button
                                className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                  isPast
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
                                    : "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
                                }`}
                                disabled={true}
                              >
                                {isPast ? "Class Completed" : "Link Not Available"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(!courseData?.liveClass || courseData.liveClass.length === 0) && (
                    <div className="col-span-2 text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <span className="material-symbols-outlined text-gray-400 text-3xl">
                          video_call
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">
                        No live classes scheduled for this course yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tests tab */}
            {activeTab === "tests" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Assessments</h3>
                  <span className="text-sm font-bold text-blue-600">
                    View All
                  </span>
                </div>
                {renderTests()}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CoursePanelPage;
