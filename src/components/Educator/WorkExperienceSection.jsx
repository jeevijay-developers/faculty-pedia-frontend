'use client';

import { FaBriefcase, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import { formatDate } from '@/utils/dateFormatter';

const WorkExperienceSection = ({ workExperience }) => {
  if (!workExperience || workExperience.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Work Experience</h2>
        <p className="text-gray-500 text-sm sm:text-base">No work experience information available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Work Experience</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {workExperience.map((exp, index) => (
          <div 
            key={index}
            className="border-l-4 border-blue-500 pl-4 sm:pl-6 pb-4 sm:pb-6 last:pb-0 relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-2 top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-1">
                    <FaBriefcase className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">{exp.title}</span>
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 flex items-center gap-2">
                    <FaBuilding className="text-gray-500 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{exp.company}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mt-2 md:mt-0 md:ml-4 flex-shrink-0">
                  <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    {formatDate(exp.startDate, 'short')} - {exp.endDate ? formatDate(exp.endDate, 'short') : 'Present'}
                  </span>
                </div>
              </div>
              
              {/* Duration calculation */}
              <div className="text-xs sm:text-sm text-gray-500 mb-2">
                {(() => {
                  const start = new Date(exp.startDate);
                  const end = exp.endDate ? new Date(exp.endDate) : new Date();
                  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                  const years = Math.floor(months / 12);
                  const remainingMonths = months % 12;
                  
                  let duration = '';
                  if (years > 0) duration += `${years} year${years > 1 ? 's' : ''}`;
                  if (remainingMonths > 0) {
                    if (duration) duration += ' ';
                    duration += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
                  }
                  
                  return duration || '1 month';
                })()}
              </div>
              
              {exp.description && (
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceSection;
