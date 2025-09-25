"use client";

import React from "react";

const CarouselFallback = ({ 
  type, 
  title 
}) => {
  // Simple messages based on type
  const getTypeMessage = () => {
    switch (type) {
      case "educators":
        return "No educators available at the moment";
      case "courses":
        return "No courses available at the moment";
      case "live-classes":
        return "No live classes available at the moment";
      case "pph":
        return "No pay-per-hour classes available at the moment";
      case "webinars":
        return "No upcoming webinars at the moment";
      case "test-series":
        return "No test series available at the moment";
      case "posts":
        return "No posts available at the moment";
      default:
        return "No content available at the moment";
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {title}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 text-lg">
            {getTypeMessage()}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back soon for updates!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CarouselFallback;