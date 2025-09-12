"use client";

import React, { useMemo } from "react";
import ClassCard from "./ClassCard";

const ClassesList = ({ selectedClass = null, data = [] }) => {
  // Filter data based on selected class
  const filtered = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (selectedClass === null) {
      // Show all courses when no class is selected
      return data;
    }

    // Filter by courseClass field from the schema
    return data.filter((item) => {
      // Handle both string and number comparison
      const courseClass = item.courseClass || item.class;
      return courseClass && courseClass.toString() === selectedClass.toString();
    });
  }, [selectedClass, data]);

  // No data available
  if (!data || data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Courses Available
          </h3>
          <p className="text-gray-600">
            CBSE courses will be available soon. Check back later!
          </p>
        </div>
      </div>
    );
  }

  // No results for selected filter
  if (filtered.length === 0 && selectedClass !== null) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">
            No courses available for Class {selectedClass}. Try selecting a
            different class.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedClass && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Class {selectedClass} Courses
            </h2>
            <p className="text-gray-600">
              {filtered.length} courses available for Class {selectedClass}
            </p>
          </div>
        )}

        {!selectedClass && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              CBSE Courses
            </h2>
            <p className="text-gray-600">
              {filtered.length} courses available across all classes
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((courseItem, i) => (
            <ClassCard
              key={courseItem._id || courseItem.id || i}
              courseItem={courseItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesList;
