'use client';

import { FaGraduationCap, FaBriefcase } from 'react-icons/fa';

const QualificationSection = ({ education, experience }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <FaGraduationCap className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        </div>
        
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">{edu.year}</span>
                {edu.grade && (
                  <span className="text-sm font-medium text-gray-700">
                    Grade: {edu.grade}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {education.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No education details available.</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-6">
          <FaBriefcase className="text-green-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
        </div>
        
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800">{exp.position}</h3>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500 mt-2">
                {exp.startDate} - {exp.endDate || 'Present'}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
          
          {experience.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No experience details available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualificationSection;
