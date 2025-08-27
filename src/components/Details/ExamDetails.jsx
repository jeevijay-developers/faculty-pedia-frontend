"use client";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaBook } from "react-icons/fa";
import TestAccordion from "./TestAccordion";
import AOS from "aos";
import "aos/dist/aos.css";

const ExamDetails = ({ examData }) => {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  // console.log(examData);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div data-aos="fade-up" className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold capitalize">{examData.title}</h1>
          <p className="text-gray-600">
            {examData.description?.long || examData.description?.short || examData.description || "No description available"}
          </p>

          <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <FaBook className="text-blue-500" />
              <span className="text-gray-700">{examData.noOfTests} Tests</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="text-gray-700">
                Starts {new Date(examData.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="text-gray-700">
                Ends {new Date(examData.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Price Card */}
        <div
          data-aos="fade-left"
          className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-600">
              ₹{examData.price}
            </h2>
            <p className="text-gray-500 mt-2">Full Test Series Access</p>
            <button className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Available Tests</h2>
        <div className="space-y-4">
          {examData?.liveTests?.map((test, index) => (
            <TestAccordion
              key={index}
              testData={test}
              isExpanded={expandedId === index}
              onToggle={() =>
                setExpandedId(expandedId === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
