"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";

const TestSeriesSection = ({ testSeries }) => {
  console.log("TestSeriesSection Rendered", testSeries);

  const renderTestSeries = () => {
    if (!testSeries || testSeries.length === 0) {
      return <p className="text-gray-500">No test series available.</p>;
    } else {
      return (
        <div>
          {testSeries.slice(0, 3).map((test, index) => {
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-48 h-32">
                    <Image
                      src={test.image.url}
                      alt={test.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {test.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {test.description.short}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{test.startDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{test.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUsers className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{test.enrollments} enrolled</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-lg font-bold text-blue-600">
                        ₹{test.price}
                      </div>
                      <Link
                        href={`/details/exam/${test.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div data-aos="fade-up" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Test Series</h2>
        <Link
          href="/educators/test-series"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          View All
          <svg
            className="w-5 h-5 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">{renderTestSeries()}</div>
    </div>
  );
};

export default TestSeriesSection;
