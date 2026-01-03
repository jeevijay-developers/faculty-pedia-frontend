"use client";
import React, { useMemo, useState, useEffect } from "react";
import UpcomingWebinarCard from "@/components/Webinars/UpcomingWebinarCard";
import Loading from "@/components/Common/Loading";
import AOS from "aos";
import "aos/dist/aos.css";
import { Search } from "lucide-react";

// API functions
import { fetchAllWebinars } from "@/components/server/exams/iit-jee/routes";
import ShareButton from "@/components/Common/ShareButton";

export default function WebinarsPage() {
  const [allWebinars, setAllWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Available subjects
  const subjects = ["All", "Biology", "Chemistry", "Mathematics", "Physics"];
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Fetch all webinars on mount
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllWebinars();

        // Extract webinars from response
        const webinarsData =
          response?.data?.webinars || response?.webinars || [];
        setAllWebinars(webinarsData);
      } catch (err) {
        console.error("Failed to fetch webinars:", err);
        setError(err.message || "Failed to fetch webinars");
        setAllWebinars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  // Debounce search input to reduce filter churn
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(handle);
  }, [searchInput]);

  // Handle tab change
  const handleTabChange = (subject) => {
    setActiveTab(subject);
  };

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  // Filter webinars based on active tab and search
  const filteredWebinars = useMemo(() => {
    let filtered = allWebinars;

    // Filter by subject tab
    if (activeTab !== "All") {
      filtered = filtered.filter((webinar) => {
        const webinarSubjects = Array.isArray(webinar.subject)
          ? webinar.subject
          : [webinar.subject];
        return webinarSubjects.some(
          (sub) => sub?.toLowerCase() === activeTab.toLowerCase()
        );
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((w) => {
        return (
          w.title?.toLowerCase().includes(query) ||
          w.description?.toLowerCase().includes(query) ||
          w.subject?.toString().toLowerCase().includes(query) ||
          w.specialization?.toString().toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [allWebinars, activeTab, searchQuery]);

  const heroSection = (
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
            Webinars
          </h1>
          <p className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
            Explore upcoming webinars designed to help you learn and grow with
            expert faculty guidance.
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex w-full max-w-150 flex-col gap-2 md:flex-row">
            <label className="flex w-full items-center rounded-full bg-white p-2 shadow-lg focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
              <div className="flex items-center justify-center pl-4 text-gray-500">
                <Search className="h-5 w-5" />
              </div>
              <input
                className="h-12 w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                placeholder="Search for webinars, subjects, or topics..."
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
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {heroSection}
        <Loading
          variant="card-grid"
          count={6}
          message={`Loading ${activeTab} Webinars`}
          className="min-h-100"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {heroSection}
        <div className="max-w-7xl mx-auto p-4 mt-8">
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Webinars
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {heroSection}
      <div className="max-w-7xl mx-auto p-4 mt-8">
        <div className="sticky top-0 z-40 -mx-4 md:mx-0 flex flex-col gap-4 bg-gray-50/95 backdrop-blur-sm p-4 md:rounded-2xl md:bg-white md:shadow-sm lg:flex-row lg:items-center lg:justify-between border-b md:border border-gray-200 transition-all mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">
              Upcoming Webinars
            </h1>
            <ShareButton
              title="Upcoming Webinars"
              text="Discover upcoming webinars on Facultypedia."
              path="/webinars"
              size="sm"
            />
          </div>
          <p className="text-sm text-gray-600">
            Showing {filteredWebinars.length} of{" "}
            {allWebinars.length || filteredWebinars.length} webinars
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleTabChange(subject)}
                disabled={loading}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === subject
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {filteredWebinars.length > 0 ? (
            filteredWebinars.map((webinar) => (
              <UpcomingWebinarCard
                key={webinar._id || webinar.id}
                item={webinar}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery.trim()
                  ? "No webinars found matching your search."
                  : `No ${activeTab} webinars available.`}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery.trim()
                  ? "Try adjusting your search terms."
                  : "Check back later for new webinars."}
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredWebinars.length > 0 && (
          <div className="mt-8 text-center text-gray-600" data-aos="fade-up">
            Showing {filteredWebinars.length} of {allWebinars.length} webinar
            {allWebinars.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
