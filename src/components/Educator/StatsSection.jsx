'use client';

import { FaUserGraduate, FaStar, FaChalkboardTeacher, FaClock } from 'react-icons/fa';

const StatsSection = ({ stats }) => {
  const { students, courses, experience, satisfaction } = stats;

  const statItems = [
    {
      icon: <FaUserGraduate className="text-blue-500" size={24} />,
      value: students.toLocaleString(),
      label: 'Students',
    },
    {
      icon: <FaChalkboardTeacher className="text-green-500" size={24} />,
      value: courses,
      label: 'Courses',
    },
    {
      icon: <FaClock className="text-purple-500" size={24} />,
      value: `${experience} Years`,
      label: 'Experience',
    },
    {
      icon: <FaStar className="text-yellow-500" size={24} />,
      value: `${satisfaction}%`,
      label: 'Satisfaction',
    },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Educator Stats</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="mb-2">
              {item.icon}
            </div>
            <div className="text-xl font-bold text-gray-800">
              {item.value}
            </div>
            <div className="text-sm text-gray-600">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
