"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";

const WebinarsSection = ({ webinars }) => {
  const renderWebinars = () => {
    if (!webinars || webinars.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No webinars available</p>
          <p className="text-gray-400 text-sm mt-1">
            Check back later for upcoming sessions
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {webinars.slice(0, 3).map((webinar, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-64 h-48 md:h-auto">
                <Image
                  src={webinar.image.url}
                  alt={webinar.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                {webinar.isLive && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span>Live</span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  <h3 className="font-bold text-xl text-gray-800 capitalize group-hover:text-blue-600 transition-colors duration-300">
                    {webinar.title}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {webinar.description.short}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                      <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">
                        {new Date(webinar.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                      <FaClock className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{webinar.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                      <FaUsers className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">
                        {webinar.attendees} registered
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <Link
                      href={`/webinars/${webinar.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-102"
                    >
                      {webinar.isLive ? (
                        <>
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                          Join Now
                        </>
                      ) : (
                        "Register"
                      )}
                    </Link>
                    <Link
                      href={`/webinars/${webinar.id}/details`}
                      className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div data-aos="fade-up" className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaCalendarAlt className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Upcoming Webinars
          </h2>
        </div>
        <Link
          href="/educators/webinars"
          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 font-medium group"
        >
          View All
          <svg
            className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {renderWebinars()}
    </div>
  );
};

export default WebinarsSection;
