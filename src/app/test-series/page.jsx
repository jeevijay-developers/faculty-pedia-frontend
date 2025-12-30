"use client";

import React, { useMemo, useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Search } from "lucide-react";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import { testData } from "@/Data/Tests/test.data";

export default function TestSeriesPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(handle);
  }, [searchInput]);

  // Get unique specializations
  const specializations = useMemo(() => {
    const set = new Set(testData.map((test) => test.specialization));
    return ["All", ...Array.from(set)];
  }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = useMemo(() => {
    return testData.filter((test) => {
      const matchesSpec =
        activeTab === "All" || test.specialization === activeTab;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesSpec;
      const inText =
        test.title.toLowerCase().includes(query) ||
        test.educatorName.toLowerCase().includes(query) ||
        test.subject.toLowerCase().includes(query);
      return matchesSpec && inText;
    });
  }, [activeTab, searchQuery]);

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
            Test Series
          </h1>
          <p className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
            Practice with comprehensive test series designed to boost your exam
            preparation and performance.
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
            Showing {filteredTests.length} of {testData.length} test series
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
              <TestSeriesCard key={test.id} testSeries={test} />
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
