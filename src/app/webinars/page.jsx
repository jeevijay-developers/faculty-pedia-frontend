"use client";
import React, { useMemo, useState, useEffect } from "react";
import WebinarCard from "@/components/Webinars/WebinarCard";
import Loading from "@/components/Common/Loading";
import AOS from "aos";
import "aos/dist/aos.css";

// API functions
import { getWebinarBySubject } from "@/components/server/webinars.routes";
import Banner from "@/components/Common/Banner";

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Available subjects - you might want to fetch this from API too
  const subjects = ["Biology", "Chemistry", "Mathematics", "Physics"];
  const [activeTab, setActiveTab] = useState(subjects[0]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Fetch webinars by subject
  const fetchWebinars = async (subject) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWebinarBySubject({
        subject: subject.toLowerCase(),
      });
      setWebinars(response.webinars || response || []);
    } catch (err) {
      setError(err.message || "Failed to fetch webinars");
      setWebinars([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch webinars when component mounts or tab changes
  useEffect(() => {
    if (activeTab) {
      fetchWebinars(activeTab);
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (subject) => {
    setActiveTab(subject);
  };

  // Retry function
  const handleRetry = () => {
    if (activeTab) {
      fetchWebinars(activeTab);
    }
  };

  // Filter webinars based on search
  const filteredWebinars = useMemo(() => {
    if (!search.trim()) return webinars;

    const query = search.trim().toLowerCase();
    return webinars.filter((w) => {
      return (
        w.title?.toLowerCase().includes(query) ||
        w.description?.short?.toLowerCase().includes(query) ||
        w.description?.long?.toLowerCase().includes(query) ||
        w.subject?.toLowerCase().includes(query)
      );
    });
  }, [webinars, search]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Welcome to Our Webinars"}
          subtitle={
            "Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
          }
        />
        <Loading
          variant="card-grid"
          count={6}
          message={`Loading ${activeTab} Webinars`}
          className="min-h-[400px]"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Welcome to Our Webinars"}
          subtitle={
            "Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
          }
        />
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
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Welcome to Our Webinars"}
        subtitle={
          "Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
        }
      />
      <div className="max-w-7xl mx-auto p-4 mt-8">
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          data-aos="fade-up"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Webinars
          </h1>
          {/* Search */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search webinars..."
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {filteredWebinars.length}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex  min-w-max justify-center gap-6">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleTabChange(subject)}
                  disabled={loading}
                  className={`py-2 px-4 border-b-2 font-medium text-sm md:text-md transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === subject
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {subject}
                  {loading && activeTab === subject && (
                    <span className="ml-2 inline-block w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  )}
                </button>
              ))}
            </nav>
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
              <WebinarCard key={webinar._id || webinar.id} webinar={webinar} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-2">
                {search.trim()
                  ? "No webinars found matching your search."
                  : `No ${activeTab} webinars available.`}
              </p>
              <p className="text-sm text-gray-400">
                {search.trim()
                  ? "Try adjusting your search terms."
                  : "Check back later for new webinars."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
