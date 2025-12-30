"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Loading from "@/components/Common/Loading";
import { fetchAllLiveClasses } from "@/components/server/exams/iit-jee/routes";
import OneToOneLiveClassesCard from "@/components/OneToOne/OneToOneLiveClassesCard";

const LiveClassesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    class: "all",
    minEnrollment: "any",
    maxPrice: "any",
    date: "any",
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "All" },
    { id: "one-to-all", label: "One to All" },
    { id: "one-to-one", label: "One to One" },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔥 Fetching all live classes...");
        const response = await fetchAllLiveClasses();
        console.log("🔥 Live Classes Response:", response);

        // Handle different response structures
        let classes = [];
        if (
          response?.data?.data?.liveClasses &&
          Array.isArray(response.data.data.liveClasses)
        ) {
          classes = response.data.data.liveClasses;
        } else if (
          response?.data?.liveClasses &&
          Array.isArray(response.data.liveClasses)
        ) {
          classes = response.data.liveClasses;
        } else if (
          response?.liveClasses &&
          Array.isArray(response.liveClasses)
        ) {
          classes = response.liveClasses;
        } else if (Array.isArray(response?.data)) {
          classes = response.data;
        } else if (Array.isArray(response)) {
          classes = response;
        }

        console.log(`🔥 Found ${classes.length} live classes`);
        setLiveClasses(classes);
      } catch (error) {
        console.error("Failed to fetch live classes:", error);
        setError(error.message || "Failed to load live classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Debounce search input to avoid rapid filter churn
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(handle);
  }, [searchInput]);

  // Filter classes based on active tab and filters
  const getFilteredClasses = () => {
    let filtered = liveClasses;

    // Search by title/subject/description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((cls) => {
        const title = (cls.liveClassTitle || cls.title || "").toLowerCase();
        const subject = Array.isArray(cls.subject)
          ? cls.subject.join(" ").toLowerCase()
          : (cls.subject || "").toLowerCase();
        const description = (cls.description || "").toLowerCase();
        return (
          title.includes(q) || subject.includes(q) || description.includes(q)
        );
      });
    }

    // Filter by tab
    if (activeTab === "one-to-one") {
      filtered = filtered.filter((cls) => cls.maxStudents === 1);
    } else if (activeTab === "one-to-all") {
      filtered = filtered.filter((cls) => cls.maxStudents > 1);
    }

    // Filter by class level
    if (filters.class !== "all") {
      filtered = filtered.filter((cls) => {
        const classArr = Array.isArray(cls.class) ? cls.class : [cls.class];
        return classArr.some((c) =>
          c?.toLowerCase().includes(filters.class.toLowerCase())
        );
      });
    }

    // Filter by minimum enrollment
    if (filters.minEnrollment !== "any") {
      const minEnroll = parseInt(filters.minEnrollment);
      filtered = filtered.filter(
        (cls) => (cls.enrolledStudents?.length || 0) >= minEnroll
      );
    }

    // Filter by maximum price
    if (filters.maxPrice !== "any") {
      const maxPrice = parseInt(filters.maxPrice);
      if (maxPrice === 5001) {
        // Above ₹5,000
        filtered = filtered.filter((cls) => (cls.liveClassesFee || 0) > 5000);
      } else {
        filtered = filtered.filter(
          (cls) => (cls.liveClassesFee || 0) <= maxPrice
        );
      }
    }

    // Filter by date (upcoming, today, this week)
    if (filters.date !== "any") {
      const now = new Date();
      filtered = filtered.filter((cls) => {
        if (!cls.classTiming) return false;
        const classDate = new Date(cls.classTiming);

        if (filters.date === "upcoming") {
          return classDate > now;
        } else if (filters.date === "today") {
          return classDate.toDateString() === now.toDateString();
        } else if (filters.date === "week") {
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return classDate >= now && classDate <= weekFromNow;
        }
        return true;
      });
    }

    return filtered;
  };

  const handleClearFilters = () => {
    setFilters({
      class: "all",
      minEnrollment: "any",
      maxPrice: "any",
      date: "any",
    });
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const filteredClasses = getFilteredClasses();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full bg-white">
        <div
          className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 px-4 md:py-24"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)), url("/images/Banner/1.png")',
          }}
        >
          <div className="flex flex-col gap-4 text-center items-center max-w-4xl mx-auto">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-sm">
              Live Classes
            </h1>
            <p className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
              Join interactive sessions with expert educators and elevate your
              learning in real time.
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex w-full max-w-150 flex-col gap-2 md:flex-row">
              <label className="flex w-full items-center rounded-full bg-white p-2 shadow-lg focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
                <div className="flex items-center justify-center pl-4 text-gray-500">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="h-12 w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                  placeholder="Search for live classes, subjects, or educators..."
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
        <section className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h1 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Explore Live Classes
              </h1>
              <p className="text-gray-600 text-lg font-normal leading-relaxed">
                Master new skills with top educators in real-time interactive
                sessions.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>Filters</span>
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Filter
                  </h3>

                  {/* Class Level Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Level
                    </label>
                    <select
                      value={filters.class}
                      onChange={(e) =>
                        setFilters({ ...filters, class: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All</option>
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>

                  {/* Min Enrollment Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Enrollment
                    </label>
                    <select
                      value={filters.minEnrollment}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minEnrollment: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="any">Any</option>
                      <option value="5">5+ Students</option>
                      <option value="10">10+ Students</option>
                      <option value="15">15+ Students</option>
                    </select>
                  </div>

                  {/* Max Price Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price (₹)
                    </label>
                    <select
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="any">Any</option>
                      <option value="500">Under ₹500</option>
                      <option value="1000">Under ₹1,000</option>
                      <option value="2000">Under ₹2,000</option>
                      <option value="5000">Under ₹5,000</option>
                      <option value="5001">Above ₹5,000</option>
                    </select>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClearFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 sticky top-20 z-30 backdrop-blur-sm py-2">
          <div className="flex p-1 rounded-full shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto">
            {tabs.map((tab) => (
              <label key={tab.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="class-type"
                  value={tab.id}
                  checked={activeTab === tab.id}
                  onChange={() => setActiveTab(tab.id)}
                  className="peer sr-only"
                />
                <div className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-md hover:text-blue-600 peer-checked:hover:text-white whitespace-nowrap">
                  {tab.label}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Error Loading Classes
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && filteredClasses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Classes Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              {activeTab === "all"
                ? "No live classes available at the moment."
                : activeTab === "one-to-one"
                ? "No one-to-one live classes available at the moment."
                : "No one-to-all live classes available at the moment."}
            </p>
          </div>
        )}

        {/* Classes Grid */}
        {!error && filteredClasses.length > 0 && (
          <section>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredClasses.length}
                </span>{" "}
                {filteredClasses.length === 1 ? "class" : "classes"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {filteredClasses.map((classData) => (
                <OneToOneLiveClassesCard
                  key={classData._id || classData.id}
                  classData={classData}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default LiveClassesPage;
