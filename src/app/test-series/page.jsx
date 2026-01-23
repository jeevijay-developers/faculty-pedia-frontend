"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { Search } from "lucide-react";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import Loading from "@/components/Common/Loading";
import { getTestSeries, getTestSeriesByEducator } from "@/components/server/test-series.route";

export default function TestSeriesPage() {
  const searchParams = useSearchParams();
  const educatorId = searchParams.get("educator");

  const [allTestSeries, setAllTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educatorName, setEducatorName] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch test series on mount (optionally filtered by educator)
  useEffect(() => {
    const fetchTestSeriesData = async () => {
      try {
        setLoading(true);
        setError(null);
        let testSeriesData = [];

        if (educatorId) {
          // Fetch test series by specific educator
          const response = await getTestSeriesByEducator(educatorId, { limit: 100 });
          testSeriesData = response?.testSeries || response?.data?.testSeries || [];
          // Try to extract educator name from first test series
          const firstTestSeries = testSeriesData[0];
          if (firstTestSeries?.educatorName || firstTestSeries?.educator?.name) {
            setEducatorName(firstTestSeries.educatorName || firstTestSeries.educator?.name || "");
          }
        } else {
          // Fetch all test series
          const response = await getTestSeries();
          testSeriesData = response?.testSeries || response?.data?.testSeries || [];
          if (Array.isArray(response)) {
            testSeriesData = response;
          }
        }

        setAllTestSeries(testSeriesData);
      } catch (err) {
        console.error("Failed to fetch test series:", err);
        setError(err.message || "Failed to fetch test series");
        setAllTestSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeriesData();
  }, [educatorId]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(handle);
  }, [searchInput]);

  // Get unique specializations
  const specializations = useMemo(() => {
    const set = new Set(allTestSeries.map((test) => test.specialization).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [allTestSeries]);

  const filteredTests = useMemo(() => {
    return allTestSeries.filter((test) => {
      const matchesSpec =
        activeTab === "All" || test.specialization === activeTab;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesSpec;
      const inText =
        (test.title || "").toLowerCase().includes(query) ||
        (test.educatorName || "").toLowerCase().includes(query) ||
        (test.subject || "").toLowerCase().includes(query);
      return matchesSpec && inText;
    });
  }, [activeTab, searchQuery, allTestSeries]);

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
            {educatorId ? (educatorName ? `${educatorName}'s Test Series` : "Educator's Test Series") : "Test Series"}
          </h1>
          <p className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
            {educatorId
              ? `Explore test series by ${educatorName || "this educator"}. Practice and improve your skills.`
              : "Practice with comprehensive test series designed to boost your exam preparation and performance."}
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex w-full max-w-150 flex-col gap-2 md:flex-row">
            <label className="flex w-full items-center rounded-full bg-white p-2 shadow-lg focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
              <div className="flex items-center justify-center pl-4 text-gray-500">
                <Search className="h-5 w-5" />
              </div>
              <input
                className="h-12 w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                placeholder="Search for test series, subjects, or educators..."
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {heroSection}
        <Loading
          variant="card-grid"
          count={6}
          message="Loading Test Series"
          className="min-h-100"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {heroSection}
        <div className="max-w-7xl mx-auto p-4 mt-8">
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Test Series
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
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
        <div
          className="sticky top-0 z-40 -mx-4 md:mx-0 flex flex-col gap-4 bg-gray-50/95 backdrop-blur-sm p-4 md:rounded-2xl md:bg-white md:shadow-sm lg:flex-row lg:items-center lg:justify-between border-b md:border border-gray-200 transition-all mb-6"
          data-aos="fade-up"
        >
          <h1 className="text-3xl font-bold text-gray-900">Test Series</h1>
          <p className="text-sm text-gray-600">
            Showing {filteredTests.length} of {allTestSeries.length} test series
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setActiveTab(spec)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === spec
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {spec}
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
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <TestSeriesCard key={test._id || test.id} testSeries={test} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg mb-2">
                No test series found.
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or selecting a different tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
