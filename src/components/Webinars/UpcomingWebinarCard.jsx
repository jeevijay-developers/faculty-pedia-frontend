import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaClock } from "react-icons/fa";
import { MdSchool, MdCalendarToday } from "react-icons/md";

const UpcomingWebinarCard = ({ item }) => {  
  console.log("item: ", item);
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
      <div className="relative h-40 bg-gray-100">
        <Image
          src={item.image?.url || "/images/placeholders/1.svg"}
          alt={item.title || "Webinar"}
          fill
          defaultValue={"/images/placeholders/1.svg"}
          className="object-cover"
        />
        {item.specialization && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium capitalize">
              {item.specialization}
            </span>
          </div>
        )}
        {item.webinarType && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {item.webinarType}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2 capitalize">
          {item.title || "Webinar Title"}
        </h3>

        {item.description?.short && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description.short}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaUser className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Educator:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium truncate ml-2 capitalize">
              {item.educatorName || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdSchool className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Qualification:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium truncate ml-2">
              {item.qualification || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Duration:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {item.totalHours || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdCalendarToday className="mr-2 text-blue-600" />
              <span className="font-medium">Date:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {item.date || "N/A"}
            </span>
          </div>

          {item.timeRange && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <FaClock className="mr-2 text-blue-600" />
                <span className="font-medium">Time:</span>
              </div>
              <span className="text-sm text-gray-800 font-medium">
                {item.timeRange}
              </span>
            </div>
          )}

          {item.subject && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <MdSchool className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Subject:</span>
              </div>
              <span className="text-sm text-gray-800 font-medium capitalize">
                {item.subject}
              </span>
            </div>
          )}
        </div>

        {item.seatLimit && (
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Available Seats:</span>
            <span className="text-sm font-medium text-gray-800">
              {(item.seatLimit - (item.enrolledCount || 0))} / {item.seatLimit}
            </span>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{Number(item.fee || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/details/webinar/${item.id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default UpcomingWebinarCard;
