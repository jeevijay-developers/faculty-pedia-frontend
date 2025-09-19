"use client";

import { useState, useEffect } from "react";
import ProfileSkeleton from "./ProfileSkeleton";
import ProfileHeader from "./ProfileHeader";
import TabNavigation from "./TabNavigation";
import OverviewTab from "./OverviewTab";
import CoursesTab from "./CoursesTab";
import ResultsTab from "./ResultsTab";
import EducatorsTab from "./EducatorsTab";
import WebinarsTab from "./WebinarsTab";
import TestSeriesTab from "./TestSeriesTab";
import EditProfileModal from "./EditProfileModal";
import {
  FiUser,
  FiBookOpen,
  FiAward,
  FiUsers,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { getCoursesByIds } from "../server/course.routes";
import { getTestSeriesById } from "../server/test-series.route"; // Individual test series helper
import { getResultById } from "../server/result.routes"; // Individual result helper
import { updateStudentProfile } from "../server/student/student.routes"; // For profile updates

const StudentProfile = ({
  studentData,
  loading = false,
  error = null,
  isOwnProfile = false,
  onProfileUpdate, // Optional callback for parent component
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State to force re-render after profile update
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(0);

  // Normalize student object early (prevents TDZ when referenced inside hooks)
  const student = studentData?.student || studentData;
  const {
    name,
    email,
    mobileNumber,
    image,
    courses = [],
    followingEducators = [],
    tests = [], // expected to include testSeriesId | seriesId
    results = [], // expected to include seriesId referencing test series
  } = student || {};

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
      }

      // Trigger re-render to show updated data
      setProfileUpdateTrigger((prev) => prev + 1);

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
    // If courses are strings/ObjectIds (not populated objects), fetch them.
    // Otherwise just mirror them into resolvedCourses.
    const needFetch =
      Array.isArray(courses) &&
      courses.some((c) => typeof c === "string" || (c && !c.title));
    if (!needFetch) {
      setResolvedCourses(Array.isArray(courses) ? courses : []);
      return;
    }
    let isCancelled = false;
    (async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const ids = courses
          .map((c) => (typeof c === "string" ? c : c._id))
          .filter(Boolean);
        const fetched = await getCoursesByIds(ids);
        if (!isCancelled) {
          setResolvedCourses(fetched);
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
        results.forEach((result) => {
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
  }, [JSON.stringify(tests), JSON.stringify(results)]);

  // Resolve result details by fetching each result ID from results array individually.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setResultsLoading(true);
        setResultsError(null);

        // Extract result IDs from results array - each result can be string ID or object with _id
        const resultIds = new Set();
        results.forEach((result) => {
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
  }, [JSON.stringify(results)]);

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

  // Debug: Log extracted data
  console.log("Extracted student data:", {
    name,
    email,
    mobileNumber,
    image,
    coursesLength: courses.length,
    followingEducatorsLength: followingEducators.length,
    testsLength: tests.length,
    resultsLength: results.length,
  });

  // Calculate statistics
  const totalCourses = courses.length;
  const totalTests = tests.length;
  const totalResults = results.length;

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "courses", label: "Courses", icon: FiBookOpen },
    { id: "results", label: "Test Results", icon: FiAward },
    { id: "webinars", label: "Webinars", icon: FiCalendar },
    { id: "testseries", label: "Test Series", icon: FiFileText },
    { id: "educators", label: "Following", icon: FiUsers },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            totalCourses={totalCourses}
            totalResults={totalResults}
            followingEducatorsLength={followingEducators.length}
            tests={tests}
            getSeries={getSeries}
            getSeriesId={getSeriesId}
            onTabChange={setActiveTab}
          />
        );
      case "courses":
        return (
          <CoursesTab
            resolvedCourses={resolvedCourses}
            coursesLoading={coursesLoading}
            coursesError={coursesError}
          />
        );
      case "results":
        return (
          <ResultsTab
            results={results}
            seriesLoading={seriesLoading}
            resultsLoading={resultsLoading}
            seriesError={seriesError}
            resultsError={resultsError}
            getSeries={getSeries}
            getResult={getResult}
            getResultId={getResultId}
          />
        );
      case "webinars":
        return <WebinarsTab studentId={student?._id} />;
      case "testseries":
        return <TestSeriesTab studentId={student?._id} />;
      case "educators":
        return <EducatorsTab followingEducators={followingEducators} />;
      default:
        return (
          <OverviewTab
            totalCourses={totalCourses}
            totalResults={totalResults}
            followingEducatorsLength={followingEducators.length}
            tests={tests}
            getSeries={getSeries}
            getSeriesId={getSeriesId}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <ProfileHeader
        name={name}
        email={email}
        mobileNumber={mobileNumber}
        image={image}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {/* Navigation Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">{renderTabContent()}</div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentData={student}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default StudentProfile;
