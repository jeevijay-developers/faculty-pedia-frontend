"use client";

import React, { useEffect, useState } from "react";
import Banner from "@/components/Common/Banner";
import CourseCard from "@/components/Courses/CourseCard";
import Loading from "@/components/Common/Loading";
import { getAllCourses } from "@/components/server/course.routes";

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subjects = ["All", "physics", "chemistry", "biology", "mathematics"];

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCourses({ limit: 100 }); // Fetch more courses
        console.log("📚 All Courses Response:", data);
        
        let courses = [];
        if (data?.courses && Array.isArray(data.courses)) {
          courses = data.courses;
        } else if (Array.isArray(data)) {
          courses = data;
        }
        
        console.log(`📚 Loaded ${courses.length} total courses`);
        setAllCourses(courses);
        setFilteredCourses(courses); // Show all courses initially
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Filter courses when active tab changes
  useEffect(() => {
    if (activeTab === "All") {
      setFilteredCourses(allCourses);
    } else {
      const filtered = allCourses.filter((course) => {
        // Handle both array and string formats for subject field
        if (Array.isArray(course.subject)) {
          return course.subject.some(
            (subj) => subj.toLowerCase() === activeTab.toLowerCase()
          );
        }
        return course.subject?.toLowerCase() === activeTab.toLowerCase();
      });
      console.log(`📚 Filtered ${filtered.length} courses for ${activeTab}`);
      setFilteredCourses(filtered);
    }
  }, [activeTab, allCourses]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          title="Our Courses"
          subtitle="Learn from the best courses across different subjects"
          url="/images/placeholders/1.svg"
        />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner
        title="Our Courses"
        subtitle="Learn from the best courses across different subjects"
        url="/images/placeholders/1.svg"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Subject Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 justify-center flex-wrap">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveTab(subject)}
                  className={`py-2 px-4 border-b-2 font-medium text-md transition-colors capitalize ${
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

        {/* Course Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> course
            {filteredCourses.length !== 1 ? "s" : ""}
            {activeTab !== "All" && (
              <span className="capitalize"> in {activeTab}</span>
            )}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No courses found for {activeTab}
              </p>
              <button
                onClick={() => setActiveTab("All")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View all courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
