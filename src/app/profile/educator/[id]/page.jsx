"use client";
import { use, useEffect, useState } from "react";
import ViewProfile from "@/components/Educator/ViewProfile";
import AOS from "aos";
import "aos/dist/aos.css";
import ViewProfileLoader from "@/components/others/viewProfileLoader";
import { getEducatorProfile } from "@/components/server/educators.routes";
import ShareButton from "@/components/Common/ShareButton";
import CourseCard from "@/components/Courses/CourseCard";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import { getCoursesByEducator } from "@/components/server/course.routes";
import { getTestSeriesByEducator } from "@/components/server/test-series.route";
import { getWebinarsByEducator } from "@/components/server/webinars.routes";
import Link from "next/link";
import WebinarCard from "@/components/Webinars/WebinarCard";

const Page = ({ params }) => {
  const resolvedParams = use(params);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const [educatorData, setEducatorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [testSeries, setTestSeries] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [webinarsLoading, setWebinarsLoading] = useState(false);
  const [testSeriesLoading, setTestSeriesLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resolvedParams?.id) {
      setError("No educator ID provided");
      setLoading(false);
      return;
    }

    // Validate MongoDB ObjectId format (24 hex characters)
    const isValidObjectId = /^[a-f\d]{24}$/i.test(resolvedParams.id);
    if (!isValidObjectId) {
      setError("Invalid educator ID format");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const fetchEducators = async () => {
      try {
        const apiResponse = await getEducatorProfile(resolvedParams.id);

        // Backend returns: { success: true, data: { educator: {...} } }
        // getEducatorProfile returns response.data which gives us the full response object
        let educator = null;

        if (apiResponse?.data?.educator) {
          // Standard backend response: data.educator
          educator = apiResponse.data.educator;
        } else if (apiResponse?.educator) {
          // Direct access to educator
          educator = apiResponse.educator;
        } else if (apiResponse?._id) {
          // Sometimes the educator data is returned directly
          educator = apiResponse;
        } else {
          console.error("✗ Could not extract educator from response");
          throw new Error("Educator data not found in response");
        }

        setEducatorData(educator);
      } catch (error) {
        console.error("✗ Error fetching educator:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        let errorMessage = "Failed to load educator profile";

        if (error.response?.status === 404) {
          errorMessage =
            "Educator not found. This profile may have been removed.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [resolvedParams?.id]);

  // Fetch educator's courses and test series
  useEffect(() => {
    if (!educatorData?._id) return;

    const fetchEducatorContent = async () => {
      const educatorId = educatorData._id;

      // Fetch courses
      setCoursesLoading(true);
      try {
        const coursesResponse = await getCoursesByEducator(educatorId, { limit: 100 });
        const coursesList = coursesResponse?.courses || coursesResponse?.data?.courses || [];
        setCourses(Array.isArray(coursesList) ? coursesList : []);
      } catch (err) {
        console.error("Error fetching educator courses:", err);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }

      // Fetch webinars
      setWebinarsLoading(true);
      try {
        const webinarsResponse = await getWebinarsByEducator(educatorId, {
          limit: 100,
        });
        const webinarsList =
          webinarsResponse?.data?.webinars || webinarsResponse?.webinars || [];
        setWebinars(Array.isArray(webinarsList) ? webinarsList : []);
      } catch (err) {
        console.error("Error fetching educator webinars:", err);
        setWebinars([]);
      } finally {
        setWebinarsLoading(false);
      }

      // Fetch test series (only non-course-specific ones)
      setTestSeriesLoading(true);
      try {
        const testSeriesResponse = await getTestSeriesByEducator(educatorId, { limit: 100 });
        const testSeriesList = testSeriesResponse?.testSeries || testSeriesResponse?.data?.testSeries || [];
        // Filter out course-specific test series
        const standaloneTestSeries = (Array.isArray(testSeriesList) ? testSeriesList : []).filter(
          (ts) => !ts.courseId && !ts.course
        );
        setTestSeries(standaloneTestSeries);
      } catch (err) {
        console.error("Error fetching educator test series:", err);
        setTestSeries([]);
      } finally {
        setTestSeriesLoading(false);
      }
    };

    fetchEducatorContent();
  }, [educatorData]);

  if (loading) {
    return <ViewProfileLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!educatorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-gray-800">
            Educator profile unavailable
          </p>
          <p className="text-sm text-gray-500 mt-2">
            We could not load the requested educator. Please verify the profile
            link and try again.
          </p>
        </div>
      </div>
    );
  }

  // if (!educatorData) {
  //   notFound();
  // }

  const educatorName = educatorData?.fullName || educatorData?.username || "this educator";
  const oneToOneCourses = courses.filter(
    (course) => course?.courseType === "one-to-one" || course?.courseType === "OTO"
  );
  const oneToAllCourses = courses.filter(
    (course) => course?.courseType === "one-to-all" || course?.courseType === "OTA"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-6 flex justify-end">
        <ShareButton
          title={
            educatorData?.fullName ||
            educatorData?.username ||
            "Educator Profile"
          }
          text={`Check out ${
            educatorData?.fullName || educatorData?.username || "this educator"
          } on Facultypedia.`}
          useCurrentUrl
          size="sm"
        />
      </div>
      <ViewProfile educatorData={educatorData} />

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                One to One Live Course
              </h3>
              <p className="text-gray-600 mb-6">
                Personalized live sessions for focused preparation
              </p>
              {oneToOneCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {oneToOneCourses.slice(0, 6).map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                  {oneToOneCourses.length > 6 && (
                    <div className="mt-8 text-center">
                      <Link
                        href="/courses"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All {oneToOneCourses.length} One to One Live Course
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-lg">
                    No one to one live course available yet
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                One to All Live Course
              </h3>
              <p className="text-gray-600 mb-6">
                Interactive live classes designed for group learning
              </p>
              {oneToAllCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {oneToAllCourses.slice(0, 6).map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                  {oneToAllCourses.length > 6 && (
                    <div className="mt-8 text-center">
                      <Link
                        href="/courses"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All {oneToAllCourses.length} One to All Live Course
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-lg">
                    No one to all live course available yet
                  </p>
                </div>
              )}
              </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 text-5xl mb-4">📚</div>
            <p className="text-gray-600 text-lg">
              No courses available yet
            </p>
          </div>
        )}
      </div>

      {/* Test Series Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Webinars by {educatorName}
          </h2>
          <p className="text-gray-600">
            Join live and upcoming webinars by this educator
          </p>
        </div>

        {webinarsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : webinars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webinars.slice(0, 6).map((webinar) => (
                <WebinarCard
                  key={webinar._id || webinar.id}
                  webinar={webinar}
                />
              ))}
            </div>
            {webinars.length > 6 && (
              <div className="mt-8 text-center">
                <Link
                  href={`/webinars?educator=${educatorData._id}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All {webinars.length} Webinars
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 text-5xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">
              No webinars available yet
            </p>
          </div>
        )}
      </div>

      {/* Test Series Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Test Series by {educatorName}
          </h2>
          <p className="text-gray-600">
            Practice with comprehensive test series
          </p>
        </div>

        {testSeriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : testSeries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testSeries.slice(0, 6).map((ts) => (
                <TestSeriesCard key={ts._id} testSeries={ts} />
              ))}
            </div>
            {testSeries.length > 6 && (
              <div className="mt-8 text-center">
                <Link
                  href="/test-series"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All {testSeries.length} Test Series
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <p className="text-gray-600 text-lg">
              No test series available yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
