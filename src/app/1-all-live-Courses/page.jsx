"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import Loading from "@/components/Common/Loading";
import { getAllCourses } from "@/components/server/course.routes";
import CourseCard from "@/components/Courses/CourseCard";

const normalizeText = (value) =>
  (value ?? "")
    .toString()
    .trim()
    .toLowerCase();

const isOneToAllCourse = (item) => {
  const typeCandidates = [
    item?.type,
    item?.courseType,
    item?.liveClassType,
    item?.classType,
    item?.sessionType,
    item?.mode,
    item?.format,
    item?.category,
  ]
    .filter(Boolean)
    .map(normalizeText);

  // Accepts various spellings/cases for One to All
  const hasOneToAllType = typeCandidates.some((value) =>
    [
      "one to all",
      "one-to-all",
      "ota",
      "1-all",
      "one2all",
      "one 2 all"
    ].includes(value)
  );

  // Optionally, you could check for maxStudents > 1 if needed
  return hasOneToAllType;
};

const OneToAllLiveCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllCourses({ includePast: true, limit: 200 });
        let allCourses = [];
        if (Array.isArray(response?.courses)) {
          allCourses = response.courses;
        } else if (Array.isArray(response?.data?.courses)) {
          allCourses = response.data.courses;
        } else if (Array.isArray(response?.data)) {
          allCourses = response.data;
        } else if (Array.isArray(response)) {
          allCourses = response;
        }
        setCourses(allCourses.filter(isOneToAllCourse));
      } catch (err) {
        setError(err.message || "Failed to load One to All courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const allSubjects = React.useMemo(() => {
    const set = new Set();
    courses.forEach((cls) => {
      if (Array.isArray(cls.subject)) cls.subject.forEach((s) => set.add(s));
      else if (cls.subject) set.add(cls.subject);
    });
    return Array.from(set).sort();
  }, [courses]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
    setSortBy("default");
  };

  const activeFilterCount = selectedSubjects.length + (sortBy !== "default" ? 1 : 0);

  const getFilteredCourses = () => {
    let filtered = [...courses];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((cls) => {
        const title = (cls.liveClassTitle || cls.title || "").toLowerCase();
        const subject = Array.isArray(cls.subject)
          ? cls.subject.join(" ").toLowerCase()
          : (cls.subject || "").toLowerCase();
        const description = (cls.description || "").toLowerCase();
        return title.includes(q) || subject.includes(q) || description.includes(q);
      });
    }
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((cls) => {
        const subjects = Array.isArray(cls.subject) ? cls.subject : [cls.subject];
        return subjects.some((s) => selectedSubjects.includes(s));
      });
    }
    if (sortBy === "price-asc") filtered.sort((a, b) => (a.fees || 0) - (b.fees || 0));
    else if (sortBy === "price-desc") filtered.sort((a, b) => (b.fees || 0) - (a.fees || 0));
    else if (sortBy === "date-asc") filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    else if (sortBy === "date-desc") filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    else if (sortBy === "duration-asc") filtered.sort((a, b) => (a.classDuration || 0) - (b.classDuration || 0));
    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative w-full bg-white">
        <div
          className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 px-4 md:py-24"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url("/images/Banner/1.png")',
          }}
        >
          <div className="flex flex-col gap-4 text-center items-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Group · One to All
            </span>
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-sm">
              One-to-All Live Courses
            </h1>
            <p className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
              Join interactive group sessions led by top educators. Learn collaboratively and benefit from a shared classroom experience.
            </p>
            {/* Search Bar */}
            <div className="mt-6 flex w-full max-w-150 flex-col gap-2 md:flex-row">
              <label className="flex w-full items-center rounded-full bg-white p-2 shadow-lg focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
                <div className="flex items-center justify-center pl-4 text-gray-500">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="h-12 w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                  placeholder="Search by title, subject, or educator..."
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

      <main className="max-w-360 mx-auto px-4 md:px-10 lg:px-20 py-8">
        {/* Page Header + Filter */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Group Live Sessions
            </h2>
            <p className="text-gray-600 text-lg font-normal leading-relaxed">
              Learn together with peers in a collaborative environment guided by expert educators.
            </p>
          </div>
          {/* Filter Button */}
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter & Sort
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">Filter & Sort</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>
                {/* Sort */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="date-asc">Date: Earliest First</option>
                    <option value="date-desc">Date: Latest First</option>
                    <option value="duration-asc">Duration: Shortest First</option>
                  </select>
                </div>
                {/* Subject Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Filter by Subject
                  </label>
                  {allSubjects.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No subjects available</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                      {allSubjects.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            selectedSubjects.includes(subject)
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="mt-5 w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </section>
        {/* Active filter chips */}
        {selectedSubjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSubjects.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {s}
                <button onClick={() => toggleSubject(s)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Courses</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
        {/* Empty State */}
        {!error && filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              {selectedSubjects.length > 0 || searchQuery
                ? "Try adjusting your filters or search terms."
                : "No one-to-all live courses are available at the moment."}
            </p>
            {(selectedSubjects.length > 0 || searchQuery) && (
              <button
                onClick={() => { clearFilters(); setSearchInput(""); setSearchQuery(""); }}
                className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
        {/* Courses Grid */}
        {!error && filteredCourses.length > 0 && (
          <section>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Showing{" "}
                <span className="font-semibold text-gray-900">{filteredCourses.length}</span>{" "}
                {filteredCourses.length === 1 ? "course" : "courses"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {filteredCourses.map((classData) => (
                <CourseCard key={classData._id || classData.id} course={classData} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default OneToAllLiveCoursesPage;
