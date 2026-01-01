"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "@/components/Courses/CourseCard";
import Loading from "@/components/Common/Loading";
import { getAllCourses } from "@/components/server/course.routes";
import { Search } from "lucide-react";

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("none");

  const subjects = ["All", "Physics", "Chemistry", "Biology", "Mathematics"];

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCourses({ limit: 100 }); // Fetch more courses

        let courses = [];
        if (data?.courses && Array.isArray(data.courses)) {
          courses = data.courses;
        } else if (Array.isArray(data)) {
          courses = data;
        }

        setAllCourses(courses);
        setFilteredCourses(courses); // Show all courses initially
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Filter courses when active tab changes
  useEffect(() => {
    if (activeTab === "All") {
      setFilteredCourses(allCourses);
    } else {
      const filtered = allCourses.filter((course) => {
        // Handle both array and string formats for subject field
        if (Array.isArray(course.subject)) {
          return course.subject.some(
            (subj) => subj.toLowerCase() === activeTab.toLowerCase()
          );
        }
        return course.subject?.toLowerCase() === activeTab.toLowerCase();
      });
      setFilteredCourses(filtered);
    }
  }, [activeTab, allCourses]);

  useEffect(() => {
    const coursesToSort = [...filteredCourses];

    switch (sortOption) {
      case "priceHigh":
        coursesToSort.sort(
          (a, b) =>
            Number(b.fees ?? b.price ?? 0) - Number(a.fees ?? a.price ?? 0)
        );
        break;
      case "priceLow":
        coursesToSort.sort(
          (a, b) =>
            Number(a.fees ?? a.price ?? 0) - Number(b.fees ?? b.price ?? 0)
        );
        break;
      case "enrolled":
        coursesToSort.sort(
          (a, b) =>
            Number(b.enrolledStudents?.length ?? b.enrolledCount ?? 0) -
            Number(a.enrolledStudents?.length ?? a.enrolledCount ?? 0)
        );
        break;
      default:
        break;
    }

    setSortedCourses(coursesToSort);
  }, [filteredCourses, sortOption]);

  // Debounce the search input before applying it to filtering
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(handle);
  }, [searchInput]);

  // Filter courses by search query
  const searchFilteredCourses = sortedCourses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const title = (course.title || "").toLowerCase();
    const description = (course.description || "").toLowerCase();
    const subjects = Array.isArray(course.subject)
      ? course.subject.join(" ").toLowerCase()
      : (course.subject || "").toLowerCase();
    return (
      title.includes(query) ||
      description.includes(query) ||
      subjects.includes(query)
    );
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative w-full bg-white">
          <div
            className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 px-4 md:py-24"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/images/Banner/1.png")',
            }}
          >
            <div className="flex flex-col gap-4 text-center items-center max-w-4xl mx-auto">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-sm">
                Our Courses
              </h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full bg-white">
        <div
          className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 px-4 md:py-24"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/images/Banner/1.png")',
          }}
        >
          <div className="flex flex-col gap-4 text-center items-center max-w-4xl mx-auto">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-sm">
              Our Courses
            </h1>
            <h2 className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
              Explore comprehensive courses across multiple subjects. Learn from
              structured curriculum designed for success.
            </h2>

            {/* Search Bar */}
            <div className="mt-6 flex w-full max-w-150 flex-col gap-2 md:flex-row">
              <label className="flex w-full items-center rounded-full bg-white p-2 shadow-lg focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
                <div className="flex items-center justify-center pl-4 text-gray-500">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="h-12 w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                  placeholder="Search for courses, subjects, or topics..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  onClick={() => setSearchQuery(searchInput.trim())}
                  className="h-12 rounded-full bg-blue-600 px-8 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Control Bar */}
        <div className="sticky top-0 z-40 -mx-4 md:mx-0 flex flex-col gap-4 bg-gray-50/95 backdrop-blur-sm p-4 md:rounded-2xl md:bg-white md:shadow-sm lg:flex-row lg:items-center lg:justify-between border-b md:border border-gray-200 transition-all mb-6">
          {/* Subject Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all ${
                  activeTab === subject
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Sorting & Results Count */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <p className="text-sm text-gray-600 lg:hidden">
              {searchFilteredCourses.length} Courses
            </p>
            <div className="flex gap-3">
              <div className="relative group">
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="appearance-none h-10 rounded-full border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-0 cursor-pointer hover:bg-gray-50"
                >
                  <option value="none">Sort by: Default</option>
                  <option value="priceHigh">
                    Sort by: Price (High to Low)
                  </option>
                  <option value="priceLow">Sort by: Price (Low to High)</option>
                  <option value="enrolled">Sort by: Enrolled Students</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results count for desktop */}
        {searchFilteredCourses.length > 0 && (
          <p className="text-sm text-gray-600 mb-6 hidden lg:block">
            Found{" "}
            <span className="font-semibold text-blue-600">
              {searchFilteredCourses.length}
            </span>{" "}
            course
            {searchFilteredCourses.length !== 1 ? "s" : ""}
            {activeTab !== "All" && <span> in {activeTab}</span>}
          </p>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {searchFilteredCourses && searchFilteredCourses.length > 0 ? (
            searchFilteredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-blue-50">
                <Search className="h-16 w-16 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                No courses found
              </h3>
              <p className="mt-2 max-w-sm text-gray-500">
                {searchQuery
                  ? "We couldn't find any courses matching your search. Try different keywords."
                  : activeTab !== "All"
                  ? `No courses found for ${activeTab}. Try selecting another subject.`
                  : "We're constantly adding new courses. Please check back soon!"}
              </p>
              {(searchQuery || activeTab !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("All");
                  }}
                  className="mt-6 rounded-full bg-white border border-gray-200 px-6 py-2.5 text-sm font-bold text-blue-600 shadow-sm hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
