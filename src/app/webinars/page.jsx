"use client";
import React, { useMemo, useState, useEffect } from "react";
import UpcomingWebinarCard from "@/components/Webinars/UpcomingWebinarCard";
import Loading from "@/components/Common/Loading";
import AOS from "aos";
import "aos/dist/aos.css";

// API functions
import { fetchAllWebinars } from "@/components/server/exams/iit-jee/routes";
import Banner from "@/components/Common/Banner";
import ShareButton from "@/components/Common/ShareButton";

export default function WebinarsPage() {
  const [allWebinars, setAllWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

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
        console.log("🎤 Fetching all webinars...");
        const response = await fetchAllWebinars();
        console.log("🎤 Webinars Response:", response);
        
        // Extract webinars from response
        const webinarsData = response?.data?.webinars || response?.webinars || [];
        console.log(`🎤 Found ${webinarsData.length} webinars`);
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
    if (search.trim()) {
      const query = search.trim().toLowerCase();
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
  }, [allWebinars, activeTab, search]);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Upcoming Webinars
            </h1>
            <ShareButton
              title="Upcoming Webinars"
              text="Discover upcoming webinars on Faculty Pedia."
              path="/webinars"
              size="sm"
            />
          </div>
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
              <UpcomingWebinarCard key={webinar._id || webinar.id} item={webinar} />
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
