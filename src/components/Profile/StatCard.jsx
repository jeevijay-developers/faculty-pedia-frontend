"use client";

import React from "react";

const StatCard = ({
  icon: Icon,
  title,
  value,
  bgColor = "bg-blue-50 dark:bg-blue-900/20",
  borderColor = "border-blue-100",
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${bgColor} border ${borderColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
