"use client";

import React, { useEffect, useState } from "react";
import Banner from "@/components/Common/Banner";
import Loading from "@/components/Common/Loading";
import { fetchAllLiveClasses } from "@/components/server/exams/iit-jee/routes";
import OneToOneLiveClassesCard from "@/components/OneToOne/OneToOneLiveClassesCard";
import ShareButton from "@/components/Common/ShareButton";

const LiveClassesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "all", label: "All Live Classes" },
    { id: "one-to-all", label: "One to All Live Classes" },
    { id: "one-to-one", label: "One to One Live Classes" }
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
        if (response?.data?.data?.liveClasses && Array.isArray(response.data.data.liveClasses)) {
          classes = response.data.data.liveClasses;
        } else if (response?.data?.liveClasses && Array.isArray(response.data.liveClasses)) {
          classes = response.data.liveClasses;
        } else if (response?.liveClasses && Array.isArray(response.liveClasses)) {
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

  // Filter classes based on active tab
  const getFilteredClasses = () => {
    if (activeTab === "all") {
      return liveClasses;
    } else if (activeTab === "one-to-one") {
      // One-to-one classes have maxStudents = 1
      return liveClasses.filter(cls => cls.maxStudents === 1);
    } else if (activeTab === "one-to-all") {
      // One-to-all classes have maxStudents > 1
      return liveClasses.filter(cls => cls.maxStudents > 1);
    }
    return liveClasses;
  };

  const filteredClasses = getFilteredClasses();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner
        title="Live Classes"
        subtitle="Join our interactive live classes and enhance your learning experience."
        url="/images/placeholders/1.svg"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
          <ShareButton
            title="Live Classes"
            text="Explore live classes on Faculty Pedia."
            path="/1-1-live-class"
            size="sm"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap space-x-4 sm:space-x-8 justify-center" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium mb-2">Error Loading Classes</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Live Classes Found
              </h3>
              <p className="text-gray-500">
                {activeTab === "all"
                  ? "No live classes available at the moment."
                  : activeTab === "one-to-one"
                  ? "No one-to-one live classes available at the moment."
                  : "No one-to-all live classes available at the moment."}
              </p>
            </div>
          </div>
        )}

        {/* Classes Grid */}
        {!error && filteredClasses.length > 0 && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredClasses.length}</span> {filteredClasses.length === 1 ? 'class' : 'classes'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classData) => (
                <OneToOneLiveClassesCard 
                  key={classData._id || classData.id} 
                  classData={classData}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassesPage;
