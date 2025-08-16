"use client";

import {
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
  FaUniversity,
  FaBuilding,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const QualificationSection = ({ education, experience }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const renderEducation = () => {
    if (education && education.length >= 0) {
      return (
        <div className="space-y-4">
          {education.slice(0, 3).map((edu, index) => {
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaUniversity className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {edu.title}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaBuilding className="w-4 h-4 mr-2 text-gray-400" />
                      {edu.institute}
                    </p>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="flex-1">
                        {new Date(edu.startDate).toLocaleDateString()} -{" "}
                        {new Date(edu.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FaGraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No education details available.</p>
        </div>
      );
    }
  };

  // const QualificationSection = ({ education, experience }) => {
  // console.log(education, experience);

  const renderExperience = () => {
    if (experience && experience.length >= 0) {
      return (
        <div className="space-y-4">
          {experience.slice(0, 3).map((exp, index) => {
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FaBriefcase className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaBuilding className="w-4 h-4 mr-2 text-gray-400" />
                      {exp.company}
                    </p>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4 mr-2 text-green-500" />
                      <span className="flex-1">
                        {new Date(exp.startDate).toLocaleDateString()} -{" "}
                        {new Date(exp.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FaBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No experience details available.</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-10" data-aos="fade-up">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <FaGraduationCap className="text-blue-600 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Education</h2>
        </div>
        {renderEducation()}
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-50 rounded-lg mr-4">
            <FaBriefcase className="text-green-600 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
        </div>
        {renderExperience()}
      </div>
    </div>
  );
};

export default QualificationSection;
