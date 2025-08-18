import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaBook,
  FaClock,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaDownload,
} from "react-icons/fa";

const ClassAccordion = ({ classData, isExpanded, onToggle }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div 
      data-aos="fade-up"
      className="mb-4 overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <button
        className={`w-full px-6 py-4 flex justify-between items-center ${
          isExpanded ? 'bg-blue-50' : 'bg-white'
        } transition-colors duration-300`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${
            isExpanded ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'
          } transition-colors duration-300`}>
            <FaChalkboardTeacher className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-lg text-gray-900">{classData.title}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <FaBook className="mr-2" /> {classData.topic}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-600 flex items-center justify-end">
              <FaCalendarAlt className="mr-2" />
              {new Date(classData.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 flex items-center justify-end">
              <FaClock className="mr-2" />
              {classData.time}
            </p>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 text-blue-500 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div 
          className="p-6 space-y-4 border-t border-gray-100"
          data-aos="fade-down"
        >
          <p className="text-gray-700 leading-relaxed">{classData.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p>{new Date(classData.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaClock className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p>{classData.duration} minutes</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <FaBook className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Subject</p>
                  <p>{classData.subject}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaChalkboardTeacher className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Topic</p>
                  <p>{classData.topic}</p>
                </div>
              </div>
            </div>
          </div>

          {classData.liveClassLink && (
            <div className="mt-6" data-aos="fade-up">
              <a
                href={classData.liveClassLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transform transition-transform duration-300 hover:scale-102"
              >
                <FaChalkboardTeacher className="mr-2" /> Join Live Class
              </a>
            </div>
          )}

          {classData.assetsLinks && classData.assetsLinks.length > 0 && (
            <div className="mt-6" data-aos="fade-up">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaDownload className="mr-2" /> Resources
              </h4>
              <div className="flex flex-wrap gap-3">
                {classData.assetsLinks.map((asset, index) => (
                  <a
                    key={index}
                    href={asset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-300 hover:shadow"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <FaDownload className="mr-2" />
                    {asset.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassAccordion;
