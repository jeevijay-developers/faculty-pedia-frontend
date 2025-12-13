'use client';

import React from "react";
import Image from "next/image";
import {
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";
import Banner from "../Common/Banner";
import EnrollButton from "../Common/EnrollButton";
import ShareButton from "@/components/Common/ShareButton";

const WebinarDetails = ({ webinar }) => {
  // Handle different response formats and provide fallbacks
  const imageUrl = webinar.image || "https://placehold.co/800x600";
  const title = webinar.title || "Webinar Title";
  const description = webinar.description || "No description available";
  const timing = webinar.timing ? new Date(webinar.timing) : new Date();
  const duration = webinar.duration || 1; // duration in hours
  const seatLimit = webinar.seatLimit || 0;
  const fees = webinar.fees || 0;
  const subject = Array.isArray(webinar.subject) 
    ? webinar.subject.join(", ") 
    : webinar.subject || "General";
  const webinarType = webinar.webinarType || "one-to-all";
  const specialization = Array.isArray(webinar.specialization)
    ? webinar.specialization.join(", ")
    : webinar.specialization || "General";
  const enrolledCount = webinar.enrolledCount || webinar.studentEnrolled?.length || 0;
  const seatsAvailable = webinar.seatsAvailable || (seatLimit - enrolledCount);
  const shareText = `Join the webinar "${title}" on Faculty Pedia.`;

  return (
    <div>
      
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          data-aos="fade-up"
        >
          <div className="relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              unoptimized
              className="object-cover"
            />
            {/* Subject and Type badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                <FaBook className="w-3 h-3 inline mr-1" />
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </span>
              <span className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full capitalize">
                {webinarType.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {title
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h1>
              <ShareButton
                title={title || "Webinar"}
                text={shareText}
                useCurrentUrl
                size="sm"
              />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-semibold">
                    {timing.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {timing.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaClock className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-semibold">{duration} hours</p>
                  <p className="text-sm text-gray-500">
                    {duration * 60} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaUsers className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Seats</p>
                  <p className="font-semibold">{seatsAvailable} available</p>
                  <p className="text-sm text-gray-500">
                    {enrolledCount} enrolled
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaRupeeSign className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="font-semibold">₹{fees}</p>
                  {fees === 0 && <p className="text-sm text-green-600">Free</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div
          className="grid md:grid-cols-2 gap-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaBook className="w-5 h-5 mr-2 text-blue-500" />
            Topics Covered
          </h2>
          <ul className="space-y-3">
            {webinar.topics &&
              webinar.topics.map((topic, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2" />
                  <span>{topic}</span>
                </li>
              ))}
          </ul>
        </div> */}

          {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-blue-500" />
            What You'll Learn
          </h2>
          <ul className="space-y-3">
            {webinar.learningOutcomes.map((outcome, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div> */}
        </div>

        {/* Additional Information */}
        <div
          className="bg-white rounded-xl shadow-lg p-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-blue-500" />
            Webinar Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Specialization
              </h3>
              <p className="text-gray-600">
                {specialization}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Subject</h3>
              <p className="text-gray-600 capitalize">{subject}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Type</h3>
              <p className="text-gray-600 capitalize">
                {webinarType.replace('-', ' ')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Format</h3>
              <p className="text-gray-600">Live Online Webinar</p>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        {webinar.assetsLink && webinar.assetsLink.length > 0 && (
          <div
            className="bg-white rounded-xl shadow-lg p-6"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaBook className="w-5 h-5 mr-2 text-blue-500" />
              Study Materials
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {webinar.assetsLink.map((asset, index) => (
                <a
                  key={index}
                  href={asset}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaBook className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Material {index + 1}</p>
                    <p className="text-sm text-gray-500">Study Resource</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Educator Section */}
        {/* <div
        className="bg-white rounded-xl shadow-lg p-6"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaChalkboardTeacher className="w-5 h-5 mr-2 text-blue-500" />
          About the Educator
        </h2>
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden">
            <Image
              src={webinar.educator.image.url}
              alt={webinar.educator.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{webinar.educator.name}</h3>
            <p className="text-gray-600">{webinar.educator.qualification}</p>
            <p className="text-gray-600 mt-2">{webinar.educator.bio}</p>
          </div>
        </div>
      </div> */}

        {/* CTA Buttons */}
        <div
          className="flex justify-center gap-4 pb-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <EnrollButton
            type="webinar"
            itemId={webinar._id || webinar.id}
            price={fees}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          />
          <button
            className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => window.open(webinar.webinarLink || "#", "_blank")}
            disabled={!webinar.webinarLink}
          >
            {webinar.webinarLink ? "Join Webinar" : "Link Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebinarDetails;
