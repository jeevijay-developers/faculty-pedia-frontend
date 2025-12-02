"use client";

import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import ClassesList from "./ClassesList";
import Loading from "@/components/Common/Loading";
import { fetchIITJEEOnlineCourses } from "@/components/server/exams/iit-jee/routes";

const CBSEPageContent = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch CBSE courses data
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const DATA = await fetchIITJEEOnlineCourses({
          specialization: "CBSE",
        });
        setData(DATA.courses || DATA || []);
      } catch (error) {
        console.error("Failed to fetch CBSE courses:", error);
        setError(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle retry
  const handleRetry = () => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const DATA = await fetchIITJEEOnlineCourses({
          specialization: "CBSE",
        });
        setData(DATA.courses || DATA || []);
      } catch (error) {
        console.error("Failed to fetch CBSE courses:", error);
        setError(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading
          variant="card-grid"
          count={9}
          message="Loading CBSE Courses..."
          className="min-h-[500px]"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Failed to Load Courses
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
    <>
      <FilterSection
        selectedClass={selectedClass}
        onChange={setSelectedClass}
      />
      <ClassesList selectedClass={selectedClass} data={data} />
    </>
  );
};

export default CBSEPageContent;
