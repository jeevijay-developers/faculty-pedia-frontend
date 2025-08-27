import React, { useState } from "react";
import { FaBook, FaClock, FaCalendarAlt, FaChalkboardTeacher, FaDownload, FaPlay } from "react-icons/fa";

const ClassCard = ({ classData }) => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe date formatting function
  const formatDate = (dateString) => {
    if (!isClient) {
      return '';
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBA';
    return timeString;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FaChalkboardTeacher className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{classData.title}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <FaBook className="w-4 h-4 mr-1" />
                {classData.topic}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 flex items-center justify-end">
              <FaCalendarAlt className="w-4 h-4 mr-1" />
              {formatDate(classData.date)}
            </p>
            <p className="text-sm text-gray-600 flex items-center justify-end">
              <FaClock className="w-4 h-4 mr-1" />
              {formatTime(classData.time)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-4">{classData.description}</p>
        
        {/* Class Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <FaBook className="w-4 h-4 mr-2 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="text-sm font-medium">{classData.subject}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaClock className="w-4 h-4 mr-2 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium">{classData.duration} minutes</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {classData.liveClassLink && (
            <a
              href={classData.liveClassLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center"
            >
              <FaPlay className="w-3 h-3 mr-1" />
              Join Class
            </a>
          )}
        </div>

        {/* Assets Links */}
        {classData.assetsLinks && classData.assetsLinks.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">Course Materials:</p>
            <div className="flex flex-wrap gap-2">
              {classData.assetsLinks.map((asset, index) => (
                <a
                  key={index}
                  href={asset.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaDownload className="w-3 h-3 mr-1" />
                  {asset.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
