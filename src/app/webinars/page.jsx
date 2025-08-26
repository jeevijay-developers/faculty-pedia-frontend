"use client";
import React, { useMemo, useState, useEffect } from "react";
import WebinarCard from "@/components/Webinars/WebinarCard";
import AOS from "aos";
import "aos/dist/aos.css";

// This would come from your API in a real application
import upcomingWebinarSpecializedData from "@/Data/Details/webinars.data";
import Banner from "@/components/Common/Banner";

// Derive specialization from title prefix
const getSpecialization = (title = "") => {
  if (title.startsWith("jee-")) return "IIT-JEE";
  if (title.startsWith("neet-")) return "NEET";
  if (title.startsWith("cbse-")) return "CBSE";
  return "Other";
};

export default function WebinarsPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Augment webinars with derived specialization & subject (optional future usage)
  const webinarsWithSpec = useMemo(
    () =>
      upcomingWebinarSpecializedData.map(w => ({
        ...w,
        specialization: getSpecialization(w.title),
      })),
    []
  );

  // Tabs (specializations)
  const specializations = useMemo(() => {
    const set = new Set(webinarsWithSpec.map(w => w.specialization));
    return ["All", ...Array.from(set)];
  }, [webinarsWithSpec]);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredWebinars = useMemo(() => {
    return webinarsWithSpec.filter(w => {
      const matchesSpec = activeTab === "All" || w.specialization === activeTab;
      const query = search.trim().toLowerCase();
      if (!query) return matchesSpec;
      const inText =
        w.title.toLowerCase().includes(query) ||
        w.description.short.toLowerCase().includes(query) ||
        w.description.long.toLowerCase().includes(query);
      return matchesSpec && inText;
    });
  }, [webinarsWithSpec, activeTab, search]);

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8" data-aos="fade-up">
          <h1 className="text-3xl font-bold text-gray-900">Available Webinars</h1>
          {/* Search */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search webinars..."
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{filteredWebinars.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-8 min-w-max">
              {specializations.map(spec => (
                <button
                  key={spec}
                  onClick={() => setActiveTab(spec)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm md:text-md transition-colors whitespace-nowrap ${
                    activeTab === spec
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="150">
          {filteredWebinars.length > 0 ? (
            filteredWebinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg mb-2">No webinars found.</p>
              <p className="text-sm text-gray-400">Try adjusting your search or selecting a different tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
