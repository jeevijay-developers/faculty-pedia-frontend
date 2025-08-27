import React, { useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaBookOpen,
  FaMedal,
  FaCheckCircle,
} from "react-icons/fa";

const TestAccordion = ({ testData, isExpanded, onToggle }) => {
  // console.log("TestAccordion Rendered", testData);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

    // Format the starting date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div
      data-aos="fade-up"
      className="mb-4 overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <button
        className={`w-full px-6 py-4 flex justify-between items-center ${
          isExpanded ? "bg-blue-50" : "bg-white"
        } transition-colors duration-300`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-full ${
              isExpanded
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-500"
            } transition-colors duration-300`}
          >
            <FaClipboardList className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-lg text-gray-900">
              {testData.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <FaBookOpen className="mr-2" /> {testData.description.short}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-600 flex items-center justify-end">
              <FaCalendarAlt className="mr-2" />
              {formatDate(testData.startDate)}
            </p>
            <p className="text-sm text-gray-600 flex items-center justify-end">
              <FaClock className="mr-2" />
              {testData.duration} min
            </p>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 text-blue-500 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div
          className="p-6 space-y-4 border-t border-gray-100"
          data-aos="fade-down"
        >
          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
            {testData.description.long}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Test Date</p>
                  <p>{formatDate(testData.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaClock className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p>{testData.duration} minutes</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <FaMedal className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Marking Scheme</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600">
                      +{testData.overallMarks.positive}
                    </span>
                    <span className="text-red-600">
                      {testData.overallMarks.negative}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaCheckCircle className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Marking Type</p>
                  <p>{testData.markingType}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4" data-aos="fade-up">
            <Link
              href="/details/exam/1"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transform transition-transform duration-300 hover:scale-102"
            >
              <FaClipboardList className="mr-2" /> Attend Test
            </Link>
            <Link
              href="/details/exam/1"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transform transition-transform duration-300 hover:scale-102"
            >
              <FaCheckCircle className="mr-2" /> View Results
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAccordion;
