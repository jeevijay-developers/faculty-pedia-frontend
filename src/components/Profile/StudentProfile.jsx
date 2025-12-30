"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  FiUser,
  FiBookOpen,
  FiAward,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiEdit3,
} from "react-icons/fi";
import { getCoursesByIds } from "../server/course.routes";
import { getTestSeriesById } from "../server/test-series.route"; // Individual test series helper
import { getResultById } from "../server/result.routes"; // Individual result helper
import { updateStudentProfile } from "../server/student/student.routes"; // For profile updates

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
  "edit",
];

const StudentDashboard = ({
  studentData,
  loading = false,
  error = null,
  isOwnProfile = false,
  onProfileUpdate, // Optional callback for parent component
  onRefresh,
}) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const normalizedStudent = studentData?.student || studentData;
  const [studentState, setStudentState] = useState(normalizedStudent);
  const [localResults, setLocalResults] = useState([]);

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
    const explicitInactive = course.isActive === false || course.active === false;
    const flaggedDeleted = course.isDeleted || course.deletedAt || course.deleted === true;
    return !explicitInactive && !flaggedDeleted && status !== "deleted" && status !== "inactive";
  };

  useEffect(() => {
    const normalized = studentData?.student || studentData;
    console.log("👤 StudentDashboard received data:", studentData);
    console.log("👤 Normalized student:", normalized);
    console.log("👤 Following educators in normalized:", normalized?.followingEducators);
    setStudentState(normalized);
  }, [studentData]);

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (!tabParam) return;

    const normalizedTab = tabParam.toLowerCase();
    if (!TAB_IDS.includes(normalizedTab)) return;

    if (normalizedTab === "edit" && !isOwnProfile) {
      return;
    }

    setActiveTab(normalizedTab);
  }, [searchParams, isOwnProfile]);

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
    tests: rawTests = [], // expected to include testSeriesId | seriesId
    results: rawResults = [], // expected to include seriesId referencing test series
  } = student || {};

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
      (course) => typeof course === "object" && course?.title && isCourseActive(course)
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
          const seen = new Set(fetchedActive.map((course) => course?._id).filter(Boolean));

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
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "courses", label: "Courses", icon: FiBookOpen },
    { id: "results", label: "Test Results", icon: FiAward },
    { id: "liveclasses", label: "Live Classes", icon: FiCalendar },
    { id: "webinars", label: "Webinars", icon: FiCalendar },
    { id: "testseries", label: "Test Series", icon: FiFileText },
    { id: "messages", label: "Messages", icon: FiMessageSquare },
    { id: "educators", label: "Following", icon: FiUsers },
    { id: "edit", label: "Edit Profile", icon: FiEdit3, disabled: !isOwnProfile },
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
      case "edit":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col gap-2 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and keep your dashboard in sync.
                </p>
              </div>
              {typeof onRefresh === "function" && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Refresh data
                </button>
              )}
            </div>
            <div className="p-6">
              {isOwnProfile ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                    Tip: Upload a clear profile photo and verify your contact details so educators can recognise you across courses and sessions.
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <FiEdit3 className="h-4 w-4" />
                      Open profile editor
                    </button>
                    {typeof onRefresh === "function" && (
                      <button
                        type="button"
                        onClick={onRefresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        Sync latest data
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Current details
                    </h3>
                    <dl className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Name</dt>
                        <dd className="text-sm font-medium text-gray-900">{name || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Email</dt>
                        <dd className="text-sm font-medium text-gray-900 break-all">{email || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Mobile</dt>
                        <dd className="text-sm font-medium text-gray-900">{mobileNumber || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Class</dt>
                        <dd className="text-sm font-medium text-gray-900">{CLASS_LABELS[academicClass] || academicClass || "—"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center text-gray-500">
                  Profile editing is only available to the account owner.
                </div>
              )}
            </div>
          </div>
        );
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
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start h-full">
          <aside className="lg:w-64 lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Student Dashboard
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Navigate your learning
                </p>
              </div>
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabSelect(tab.id)}
                      disabled={tab.disabled}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      } ${
                        tab.disabled
                          ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400"
                          : ""
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                      <span className="flex-1 text-left">{tab.label}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </nav>
            </div>
            {typeof onRefresh === "function" && (
              <button
                type="button"
                onClick={onRefresh}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                Refresh dashboard data
              </button>
            )}
          </aside>
          <main className="min-w-0 flex-1 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            <div className="mb-8">{renderTabContent()}</div>
          </main>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentData={student}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default StudentDashboard;
