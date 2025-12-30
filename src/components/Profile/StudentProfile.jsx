"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { confirmAlert } from "@/components/CustomAlert";
import toast from "react-hot-toast";

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
  const profileMenuRef = useRef(null);

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

  useEffect(() => {
    try {
      const stored = JSON.parse(
        typeof window !== "undefined"
          ? window.localStorage.getItem("faculty-pedia-offline-results") || "[]"
          : "[]"
      );
      if (Array.isArray(stored)) setLocalResults(stored);
    } catch (err) {
      console.warn("Failed to read offline results", err);
    }
  }, []);

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
    console.log("👤 StudentDashboard received data:", studentData);
    console.log("👤 Normalized student:", normalized);
    console.log(
      "👤 Following educators in normalized:",
      normalized?.followingEducators
    );
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

  const student = studentState || normalizedStudent;
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
    tests = [], // expected to include testSeriesId | seriesId
    results = [], // expected to include seriesId referencing test series
  } = student || {};

  const combinedResults = useMemo(() => {
    const merged = [...(localResults || []), ...(results || [])];
    const toTime = (val) => {
      const ms = val ? Date.parse(val) : 0;
      return Number.isNaN(ms) ? 0 : ms;
    };
    return merged.sort((a, b) => {
      const tsA = toTime(a?.submittedAt || a?.createdAt);
      const tsB = toTime(b?.submittedAt || b?.createdAt);
      return tsB - tsA;
    });
  }, [localResults, results]);

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
          <button className="relative p-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </button>
          <button className="p-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
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

            <div className="mt-auto px-4 pt-6 pb-2">
              <div className="p-4 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm font-bold mb-1">Premium Plan</p>
                  <p className="text-xs opacity-90 mb-3">
                    Get unlimited access to all courses.
                  </p>
                  <button className="text-xs bg-white text-blue-600 px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors">
                    Upgrade Now
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              </div>
            </div>
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
