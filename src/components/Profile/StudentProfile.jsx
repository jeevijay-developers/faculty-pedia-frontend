"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSkeleton from "./ProfileSkeleton";
import OverviewTab from "./OverviewTab";
import CoursesTab from "./CoursesTab";
import ResultsTab from "./ResultsTab";
import EducatorsTab from "./EducatorsTab";
import WebinarsTab from "./WebinarsTab";
import TestSeriesTab from "./TestSeriesTab";
import MessagesTab from "./MessagesTab";
import EditProfileModal from "./EditProfileModal";
import LiveClassesTab from "./LiveClassesTab";
import { getCoursesByIds } from "../server/course.routes";
import { getTestSeriesById } from "../server/test-series.route";
import { getResultById } from "../server/result.routes";
import { updateStudentProfile } from "../server/student/student.routes";
import {
  getStudentNotifications,
  markNotificationAsRead,
} from "../server/student/student.routes";
import { confirmAlert } from "@/components/CustomAlert";
import toast from "react-hot-toast";
import { Bell, Loader2, RefreshCcw } from "lucide-react";

const CLASS_LABELS = {
  "class-6th": "Class 6th",
  "class-7th": "Class 7th",
  "class-8th": "Class 8th",
  "class-9th": "Class 9th",
  "class-10th": "Class 10th",
  "class-11th": "Class 11th",
  "class-12th": "Class 12th",
  dropper: "Dropper",
};

const TAB_IDS = [
  "overview",
  "courses",
  "results",
  "liveclasses",
  "webinars",
  "testseries",
  "messages",
  "educators",
];

const INITIAL_NOTIFICATION_STATE = {
  items: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const StudentDashboard = ({
  studentData,
  loading = false,
  error = null,
  isOwnProfile = false,
  onProfileUpdate, // Optional callback for parent component
  onRefresh,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const [notificationState, setNotificationState] = useState(
    INITIAL_NOTIFICATION_STATE
  );

  const handleLogout = async () => {
    const confirmed = await confirmAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      type: "error",
      confirmText: "Yes, logout",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    localStorage.removeItem("faculty-pedia-student-data");
    localStorage.removeItem("faculty-pedia-auth-token");
    setStudentState(null);
    setActiveTab("overview");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("student-data-updated"));
    }
    toast.success("Logged out successfully");
    router.push("/");
  };

  const normalizedStudent = studentData?.student || studentData;
  const [studentState, setStudentState] = useState(normalizedStudent);
  const [localResults, setLocalResults] = useState([]);
  const student = studentState || normalizedStudent;
  const studentId = student?._id;

  // Keep offline results scoped per student so new logins don't inherit old data
  useEffect(() => {
    if (typeof window === "undefined") return;
    const studentId = studentState?._id || normalizedStudent?._id;
    if (!studentId) {
      setLocalResults([]);
      return;
    }

    const perStudentKey = `faculty-pedia-offline-results-${studentId}`;
    const legacyKey = "faculty-pedia-offline-results";

    try {
      // Clean up legacy key to avoid leaking data across accounts
      if (window.localStorage.getItem(legacyKey)) {
        window.localStorage.removeItem(legacyKey);
      }

      const raw = window.localStorage.getItem(perStudentKey) || "[]";
      const parsed = JSON.parse(raw);
      setLocalResults(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.warn("Failed to read offline results", err);
      setLocalResults([]);
    }
  }, [studentState?._id, normalizedStudent?._id]);

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

  useEffect(() => {
    const normalized = studentData?.student || studentData;
    setStudentState(normalized);
  }, [studentData]);

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (!tabParam) return;

    const navEntry =
      typeof performance !== "undefined"
        ? performance.getEntriesByType("navigation")?.[0]
        : null;
    const isReload = navEntry?.type === "reload";
    if (isReload) return;

    const normalizedTab = tabParam.toLowerCase();
    if (!TAB_IDS.includes(normalizedTab)) return;

    setActiveTab(normalizedTab);
  }, [searchParams]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const {
    name,
    email,
    mobileNumber,
    image,
    username,
    specialization,
    class: academicClass,
    joinedAt,
    courses = [],
    followingEducators = [],
    tests: rawTests = [], // expected to include testSeriesId | seriesId
    results: rawResults = [], // expected to include seriesId referencing test series
  } = student || {};

  const formatRelativeTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    if (diffMs <= 0) return "Just now";

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    });
  };

  const getNameInitials = (fullName = "") => {
    const trimmed = fullName.trim();
    if (!trimmed) return "FP";
    const parts = trimmed.split(/\s+/).slice(0, 2);
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials || "FP";
  };

  const tests = Array.isArray(rawTests) ? rawTests : [];
  const apiResults = Array.isArray(rawResults) ? rawResults : [];

  const combinedResults = useMemo(() => {
    const merged = [...(localResults || []), ...(apiResults || [])];
    const toTime = (val) => {
      const ms = val ? Date.parse(val) : 0;
      return Number.isNaN(ms) ? 0 : ms;
    };
    return merged.sort((a, b) => {
      const tsA = toTime(a?.submittedAt || a?.createdAt);
      const tsB = toTime(b?.submittedAt || b?.createdAt);
      return tsB - tsA;
    });
  }, [localResults, apiResults]);

  const fetchNotifications = useCallback(
    async ({ suppressUnread = false } = {}) => {
      if (!studentId) return;

      setNotificationState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await getStudentNotifications(studentId, {
          limit: 20,
          unreadOnly: true,
        });
        const items = Array.isArray(result?.notifications)
          ? result.notifications
          : [];
        const unreadCount = result?.unreadCount ?? items.length;

        setNotificationState((prev) => ({
          ...prev,
          items,
          loading: false,
          error: null,
          unreadCount,
        }));
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotificationState((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to load notifications right now.",
        }));
      }
    },
    [studentId]
  );

  const handleNotificationRefresh = () => {
    fetchNotifications({ suppressUnread: isNotificationOpen });
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsProfileMenuOpen(false);
  };

  const closeNotifications = () => setIsNotificationOpen(false);

  const handleNotificationSelect = useCallback(
    (item) => {
      if (!item) return;
      closeNotifications();

      const notificationId = item.id || item._id;
      if (notificationId && studentId) {
        setNotificationState((prev) => {
          const filteredItems = prev.items.filter(
            (entry) => entry.id !== notificationId
          );
          const nextUnread = Math.max(prev.unreadCount - 1, 0);
          return {
            ...prev,
            items: filteredItems,
            unreadCount: nextUnread,
          };
        });

        markNotificationAsRead(studentId, notificationId).catch((error) => {
          console.error("Failed to mark notification as read:", error);
          fetchNotifications({ suppressUnread: true });
        });
      }

      if (item.link) {
        router.push(item.link);
      }
    },
    [studentId, router, fetchNotifications]
  );

  useEffect(() => {
    if (!studentId) {
      setNotificationState(INITIAL_NOTIFICATION_STATE);
      setIsNotificationOpen(false);
      return;
    }

    fetchNotifications();
  }, [studentId, fetchNotifications]);

  useEffect(() => {
    if (!isNotificationOpen || !studentId) return;
    fetchNotifications({ suppressUnread: true });
  }, [isNotificationOpen, studentId, fetchNotifications]);

  useEffect(() => {
    if (!isNotificationOpen) return;
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);

  // Courses state
  const [resolvedCourses, setResolvedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // Test series enrichment state
  const [resolvedSeriesMap, setResolvedSeriesMap] = useState({}); // { [seriesId]: seriesObject }
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesError, setSeriesError] = useState(null);

  // Results enrichment state
  const [resolvedResultsMap, setResolvedResultsMap] = useState({}); // { [resultId]: resultObject }
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // Handle profile save
  const handleProfileSave = async (formData) => {
    try {
      const studentId = student?._id;
      if (!studentId) {
        throw new Error("Student ID not found");
      }

      const result = await updateStudentProfile(studentId, formData);

      // Update localStorage with new student data (same as login)
      if (result && result.student) {
        localStorage.setItem(
          "faculty-pedia-student-data",
          JSON.stringify(result.student)
        );
        setStudentState(result.student);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("student-data-updated"));
        }
      }

      // Call parent callback if provided
      if (onProfileUpdate) {
        await onProfileUpdate(result);
      }

      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!Array.isArray(courses)) {
      setResolvedCourses([]);
      return;
    }

    const normalizedCourses = courses
      .map((entry) => {
        if (!entry) return null;
        if (entry.courseId && typeof entry.courseId === "object") {
          return {
            ...entry.courseId,
            enrollmentMeta: {
              enrolledAt: entry.enrolledAt,
              completionStatus: entry.completionStatus,
              progressPercentage: entry.progressPercentage,
            },
          };
        }
        if (entry.courseId) {
          return entry.courseId;
        }
        return entry;
      })
      .filter(Boolean);

    const fallbackCourses = normalizedCourses.filter(
      (course) =>
        typeof course === "object" && course?.title && isCourseActive(course)
    );

    let isCancelled = false;
    (async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);

        const ids = courses
          .map((entry) => {
            if (typeof entry === "string") return entry;
            if (entry?._id) return entry._id;
            if (typeof entry?.courseId === "string") return entry.courseId;
            if (entry?.courseId?._id) return entry.courseId._id;
            return null;
          })
          .filter(Boolean);

        if (!ids.length) {
          setResolvedCourses(fallbackCourses);
          return;
        }

        const fetched = await getCoursesByIds(ids);
        if (!isCancelled) {
          const fetchedActive = (Array.isArray(fetched) ? fetched : [])
            .filter(Boolean)
            .filter(isCourseActive);

          const mergedCourses = [...fetchedActive];
          const seen = new Set(
            fetchedActive.map((course) => course?._id).filter(Boolean)
          );

          fallbackCourses.forEach((course) => {
            if (!course) return;
            if (course?._id && seen.has(course._id)) return;
            if (!isCourseActive(course)) return;
            mergedCourses.push(course);
          });

          setResolvedCourses(mergedCourses.filter(isCourseActive));
        }
      } catch (err) {
        if (!isCancelled) setCoursesError("Failed to load course details");
      } finally {
        if (!isCancelled) setCoursesLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [JSON.stringify(courses)]);

  // Helper: resolve a series object from map by id, gracefully handling absent IDs.
  const getSeries = (id) => {
    // If id is already a populated object with title, return it directly
    if (id && typeof id === "object" && id.title) {
      return id;
    }

    // Handle both string IDs and object references
    const seriesId = typeof id === "string" ? id : id?._id || id;
    return seriesId && resolvedSeriesMap[seriesId]
      ? resolvedSeriesMap[seriesId]
      : null;
  };

  // Helper: get series ID from test object
  const getSeriesId = (test) => {
    const seriesId =
      typeof test?.testSeriesId === "string"
        ? test.testSeriesId
        : test?.testSeriesId?._id || test?.testSeriesId;
    return seriesId;
  };

  // Helper: resolve a result object from map by id, gracefully handling absent IDs.
  const getResult = (id) => {
    // Handle both string IDs and object references
    const resultId = typeof id === "string" ? id : id?._id || id;
    return resultId && resolvedResultsMap[resultId]
      ? resolvedResultsMap[resultId]
      : null;
  };

  // Helper: get result ID from result object or string
  const getResultId = (result) => {
    const resultId =
      typeof result === "string" ? result : result?._id || result?.id;
    return resultId;
  };

  // Resolve test series metadata by fetching each testSeriesId from tests array individually.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setSeriesLoading(true);
        setSeriesError(null);

        // Extract testSeriesId from tests array - each test has { testSeriesId: mongoDbId, ... }
        const seriesIds = new Set();
        tests.forEach((test) => {
          const seriesId =
            typeof test?.testSeriesId === "string"
              ? test.testSeriesId
              : test?.testSeriesId?._id || test?.testSeriesId;
          if (seriesId && !resolvedSeriesMap[seriesId]) {
            seriesIds.add(seriesId);
          }
        });

        // Also check results array for any additional series references
        combinedResults.forEach((result) => {
          // Handle both populated objects and IDs
          const seriesRef = result?.seriesId || result?.testSeriesId;
          const seriesId =
            typeof seriesRef === "string" ? seriesRef : seriesRef?._id;

          if (seriesId && !resolvedSeriesMap[seriesId]) {
            seriesIds.add(seriesId);
          }
        });

        if (seriesIds.size === 0) {
          setSeriesLoading(false);
          return;
        }

        // Fetch each series individually using getTestSeriesById
        const fetchedPairs = await Promise.all(
          Array.from(seriesIds).map(async (seriesId) => {
            try {
              const data = await getTestSeriesById(seriesId);
              const seriesObj = data?.testSeries || data?.data || data;
              return [seriesObj?._id || seriesId, seriesObj];
            } catch (e) {
              console.warn(`Failed to fetch test series ${seriesId}:`, e);
              return [
                seriesId,
                { _id: seriesId, title: "Series unavailable", error: true },
              ];
            }
          })
        );

        if (!cancelled) {
          setResolvedSeriesMap((prev) => {
            const next = { ...prev };
            fetchedPairs.forEach(([id, obj]) => {
              if (id) next[id] = obj;
            });
            return next;
          });
        }
      } catch (e) {
        if (!cancelled) setSeriesError("Failed to resolve test series");
      } finally {
        if (!cancelled) setSeriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(tests), JSON.stringify(combinedResults)]);

  // Resolve result details by fetching each result ID from results array individually.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setResultsLoading(true);
        setResultsError(null);

        // Extract result IDs from results array - each result can be string ID or object with _id
        const resultIds = new Set();
        combinedResults.forEach((result) => {
          const resultId = getResultId(result);
          if (resultId && !resolvedResultsMap[resultId]) {
            resultIds.add(resultId);
          }
        });

        if (resultIds.size === 0) {
          setResultsLoading(false);
          return;
        }

        // Fetch each result individually using getResultById
        const fetchedPairs = await Promise.all(
          Array.from(resultIds).map(async (resultId) => {
            try {
              const data = await getResultById(resultId);
              const resultObj = data?.result || data?.data || data;
              return [resultObj?._id || resultId, resultObj];
            } catch (e) {
              console.warn(`Failed to fetch result ${resultId}:`, e);
              return [resultId, { _id: resultId, error: true }];
            }
          })
        );

        if (!cancelled) {
          setResolvedResultsMap((prev) => {
            const next = { ...prev };
            fetchedPairs.forEach(([id, obj]) => {
              if (id) next[id] = obj;
            });
            return next;
          });
        }
      } catch (e) {
        if (!cancelled) setResultsError("Failed to resolve test results");
      } finally {
        if (!cancelled) setResultsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(combinedResults)]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Student Not Found
          </h2>
          <p className="text-gray-600">
            The requested student profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCourses = resolvedCourses.filter(isCourseActive).length;
  const totalTests = tests.length;
  const totalResults = combinedResults.length;

  const tabs = [
    { id: "overview", label: "Dashboard", icon: "dashboard" },
    { id: "courses", label: "My Courses", icon: "menu_book" },
    { id: "testseries", label: "Test Series", icon: "quiz" },
    { id: "liveclasses", label: "Live Classes", icon: "videocam" },
    { id: "webinars", label: "Webinars", icon: "calendar_month" },
    { id: "results", label: "Results", icon: "assignment_turned_in" },
    { id: "messages", label: "Messages", icon: "chat_bubble" },
    { id: "educators", label: "Following", icon: "people" },
  ];

  const handleTabSelect = (tabId) => {
    if (tabId === "edit" && !isOwnProfile) {
      return;
    }
    setActiveTab(tabId);
    if (tabId !== "edit" && isEditModalOpen) {
      setIsEditModalOpen(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            totalCourses={totalCourses}
            totalResults={totalResults}
            followingEducatorsLength={followingEducators.length}
            results={combinedResults}
            tests={tests}
            getSeries={getSeries}
            getSeriesId={getSeriesId}
            onTabChange={handleTabSelect}
            studentId={student?._id}
          />
        );
      case "courses":
        return (
          <CoursesTab
            resolvedCourses={resolvedCourses.filter(isCourseActive)}
            coursesLoading={coursesLoading}
            coursesError={coursesError}
          />
        );
      case "results":
        return (
          <ResultsTab
            results={combinedResults}
            seriesLoading={seriesLoading}
            resultsLoading={resultsLoading}
            seriesError={seriesError}
            resultsError={resultsError}
            getSeries={getSeries}
            getResult={getResult}
            getResultId={getResultId}
            onTabChange={handleTabSelect}
          />
        );
      case "webinars":
        return <WebinarsTab studentId={student?._id} />;
      case "liveclasses":
        return <LiveClassesTab studentId={student?._id} />;
      case "testseries":
        return <TestSeriesTab studentId={student?._id} />;
      case "messages":
        return (
          <MessagesTab
            studentId={student?._id}
            followingEducators={followingEducators}
          />
        );
      case "educators":
        return <EducatorsTab followingEducators={followingEducators} />;
      default:
        return (
          <OverviewTab
            totalCourses={totalCourses}
            totalResults={totalResults}
            followingEducatorsLength={followingEducators.length}
            results={combinedResults}
            tests={tests}
            getSeries={getSeries}
            getSeriesId={getSeriesId}
            onTabChange={handleTabSelect}
            studentId={student?._id}
          />
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[#111a21] text-gray-900 font-sans h-screen overflow-hidden flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex-none h-20 w-full px-6 md:px-10 flex items-center justify-between z-20 bg-white dark:bg-[#1a2632] shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-2xl">
                school
              </span>
            </div>
            <h2 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">
              FacultyPedia
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4" ref={profileMenuRef}>
          <div className="relative" ref={notificationPanelRef}>
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
              onClick={handleNotificationToggle}
              className="relative inline-flex items-center justify-center rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Bell className="h-5 w-5" />
              {notificationState.unreadCount > 0 &&
                notificationState.items.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  </span>
                )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl z-30">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">
                    Notifications
                  </span>
                  <button
                    type="button"
                    onClick={handleNotificationRefresh}
                    disabled={notificationState.loading}
                    className="flex items-center justify-center rounded-full p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Refresh notifications"
                  >
                    {notificationState.loading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notificationState.loading ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span>Loading notifications...</span>
                    </div>
                  ) : notificationState.error ? (
                    <div className="space-y-3 px-4 py-6 text-sm">
                      <p className="text-red-500">{notificationState.error}</p>
                      <button
                        type="button"
                        onClick={handleNotificationRefresh}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Try again
                      </button>
                    </div>
                  ) : notificationState.items.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-gray-500">
                      You're all caught up! Follow your favourite educators to
                      get updates.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {notificationState.items.map((item) => (
                        <li key={item.id || item._id}>
                          <button
                            type="button"
                            className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-blue-50 focus:outline-none"
                            onClick={() => handleNotificationSelect(item)}
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                              {getNameInitials(item.educatorName)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                                  {item.title}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatRelativeTime(item.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-gray-600">
                                {item.message}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400">
                                <span className="text-gray-500">{item.educatorName}</span>
                                <span>•</span>
                                <span>{item.type}</span>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="pl-4 border-l border-gray-100 dark:border-gray-700 flex items-center gap-3 relative">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {name || "Student"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {CLASS_LABELS[academicClass] ||
                  academicClass ||
                  specialization ||
                  "Student"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-sm cursor-pointer bg-cover bg-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={image ? { backgroundImage: `url('${image}')` } : {}}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
            >
              {!image && (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-sm">
                  {name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-14 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] shadow-lg py-2 z-30">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    router.push(`/profile/student/${student?._id || ""}`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">
                    space_dashboard
                  </span>
                  Dashboard
                </button>
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                    Edit Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">
                    logout
                  </span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="hidden lg:flex w-72 flex-col p-6 h-full">
          <div className="flex flex-col gap-2 bg-white dark:bg-[#1a2632] h-full rounded-2xl shadow-sm p-4 overflow-y-auto hide-scrollbar">
            <div className="mb-4 px-4 pt-2">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
                  disabled={tab.disabled}
                  className={`group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all relative overflow-hidden ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  } ${
                    tab.disabled
                      ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400"
                      : ""
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                  )}
                  <span
                    className={`material-symbols-outlined ${
                      isActive ? "text-blue-600" : "group-hover:text-blue-600"
                    } transition-colors`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}

           
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar relative">
          <div className="max-w-8xl mx-auto flex flex-col gap-8 pb-10">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  Welcome back, {name?.split(" ")[0] || "Student"} 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Ready to continue your learning journey today?
                </p>
              </div>
            </section>

            {/* Tab Content */}
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm p-6">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentData={student}
        onSave={handleProfileSave}
      />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .material-symbols-outlined {
          font-family: "Material Symbols Outlined";
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          font-feature-settings: "liga";
          -webkit-font-feature-settings: "liga";
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
