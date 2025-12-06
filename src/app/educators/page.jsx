"use client";

import React, { useEffect, useState } from "react";
import EducatorCard from "../../components/Educator/EducatorCard";
import Banner from "@/components/Common/Banner";
import { getEducatorsBySubject, getAllEducators } from "@/components/server/educators.routes";
import Loading from "@/components/Common/Loading";

const EducatorsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [filteredEducators, setFilteredEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subjects = ["All", "Physics", "Chemistry", "Biology", "Mathematics"];

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchEducators = async () => {
      try {
        let response;
        
        // Fetch all educators if "All" is selected, otherwise filter by subject
        if (activeTab === "All") {
          response = await getAllEducators();
        } else {
          response = await getEducatorsBySubject(activeTab.toLowerCase());
        }
        
        console.log("API Response:", response);
        
        // Handle the response structure: response.data.educators
        if (response?.data?.educators && Array.isArray(response.data.educators)) {
          console.log("Found educators:", response.data.educators.length);
          setFilteredEducators(response.data.educators);
        } else if (response?.educators && Array.isArray(response.educators)) {
          console.log("Found educators (alternate format):", response.educators.length);
          setFilteredEducators(response.educators);
        } else if (Array.isArray(response)) {
          console.log("Found educators (array format):", response.length);
          setFilteredEducators(response);
        } else {
          console.warn("Unexpected data format:", response);
          setFilteredEducators([]);
        }
      } catch (error) {
        console.error("Error fetching educators:", error);
        console.error("Error details:", error.response?.data);
        setError(error.response?.data?.message || "Failed to load educators. Please try again later.");
        setFilteredEducators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [activeTab]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          title="Our Expert Educators"
          subtitle="Learn from the best teachers across different subjects"
          url="/images/placeholders/1.svg"
        />
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
      <Banner
        title="Our Expert Educators"
        subtitle="Learn from the best teachers across different subjects"
        url="/images/placeholders/1.svg"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Subject Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap space-x-4 sm:space-x-8 justify-center">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveTab(subject)}
                  className={`py-3 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                    activeTab === subject
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Results count */}
        {filteredEducators.length > 0 && (
          <div className="mb-4 text-center">
            <p className="text-gray-600 text-sm">
              Found <span className="font-semibold text-blue-600">{filteredEducators.length}</span> educator{filteredEducators.length !== 1 ? 's' : ''}
              {activeTab !== "All" && <span> in {activeTab}</span>}
            </p>
          </div>
        )}

        {/* Educators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredEducators && filteredEducators.length > 0 ? (
            filteredEducators.map((educator, i) => (
              <EducatorCard key={educator._id || i} educator={educator} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="mt-4 text-gray-500 text-lg font-medium">
                No educators found for {activeTab}
              </p>
              <p className="mt-2 text-gray-400 text-sm">
                We're constantly adding new educators. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorsPage;
