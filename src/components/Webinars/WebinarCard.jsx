import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUsers, FaRupeeSign } from "react-icons/fa";

const WebinarCard = ({ webinar }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      data-aos="fade-up"
    >
      <div className="relative h-48 w-full">
        <Image
          src={webinar.image.url}
          alt={webinar.title}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {webinar.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaClock className="w-4 h-4 text-blue-500 mr-2" />
            <span>{webinar.duration} minutes</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaUsers className="w-4 h-4 text-blue-500 mr-2" />
            <span>{webinar.seatLimit} seats</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaRupeeSign className="w-4 h-4 text-blue-500 mr-2" />
            <span>₹{webinar.price}</span>
          </div>
        </div>

          <Link
            href={`/webinars/${webinar.id}`}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <span className="mr-2">View Details</span>
          </Link>
      </div>
    </div>
  );
};

export default WebinarCard;
