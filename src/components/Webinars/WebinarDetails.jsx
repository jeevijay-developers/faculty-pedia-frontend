"use client";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaVideo,
  FaDownload,
  FaPlayCircle,
  FaFileAlt,
} from "react-icons/fa";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { getWebinarById } from "../server/webinars.routes";
import Loading from "../Common/Loading";

const WebinarDetails = ({ id }) => {
  // console.log("WebinarDetails Rendered", webinarData);
  // console.log(id);

  const [webinarData, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    const fetchWebinars = async () => {
      setLoading(true);
      try {
        const DATA = await getWebinarById(id);
        // console.log(DATA);
        setData(DATA);
      } catch (error) {
        console.error("Failed to fetch educators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  // Check if webinarData exists
  // if (!webinarData) {
  //   return (
  //     <div className="max-w-7xl mx-auto px-4 py-8">
  //       <div className="text-center">
  //         <p className="text-gray-500">No webinar data available</p>
  //       </div>
  //     </div>
  //   );
  // }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        {/* sfdggf */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <div data-aos="fade-up" className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {webinarData.webinarType === "OTA"
                  ? "Open To All"
                  : "Open To One" || "Live"}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                {webinarData.duration || 60} minutes
              </span>
            </div>
            <h1 className="text-4xl font-bold capitalize text-gray-900">
              {webinarData.title || "Webinar Title"}
            </h1>
            <p className="text-lg text-gray-600">
              {webinarData.description?.short || "No description available"}
            </p>
          </div>

          {/* Webinar Image */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={webinarData.image?.url || "/images/placeholders/1.svg"}
              alt={webinarData.title || "Webinar"}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Key Information */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FaCalendarAlt className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Date & Time
                </h3>
              </div>
              <p className="text-gray-700 font-medium">
                {formatDate(webinarData.date)}
              </p>
              <p className="text-gray-600">{formatTime(webinarData.time)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FaUsers className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Enrollment
                </h3>
              </div>
              <p className="text-gray-700 font-medium">
                {webinarData.enrolledStudents?.length || 0} /{" "}
                {webinarData.seatLimit || 0} enrolled
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${
                      ((webinarData.enrolledStudents?.length || 0) /
                        (webinarData.seatLimit || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              About This Webinar
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {webinarData.description?.long ||
                "No detailed description available."}
            </p>
          </div>

          {/* Assets Section */}
          {webinarData.assetsLinks && webinarData.assetsLinks.length > 0 && (
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Webinar Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {webinarData.assetsLinks.map((asset, index) => (
                  <Link
                    key={index}
                    href={asset.link}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {asset.name === "VIDEO" ? (
                      <FaPlayCircle className="text-red-500 text-2xl" />
                    ) : (
                      <FaFileAlt className="text-blue-500 text-2xl" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {asset.name === "VIDEO" ? "Recording" : "Document"}
                      </p>
                      <p className="text-sm text-gray-600">Click to access</p>
                    </div>
                    <FaDownload className="text-gray-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div
            data-aos="fade-left"
            className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-xl  top-6 ring-1 ring-blue-100"
          >
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Limited Seats
                </div>
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{webinarData.fees || 0}
                </span>
                <p className="text-gray-600 mt-2">One-time payment</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl  hover:cursor-pointer">
                  🚀 Enroll Now
                </button>
                {/* <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                  💬 Ask Questions
                </button> */}
              </div>

              <div className="pt-4 bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FaClock className="w-4 h-4 mr-2 text-blue-500" />
                    Duration:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {webinarData.duration || 60} mins
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FaUsers className="w-4 h-4 mr-2 text-green-500" />
                    Seats Available:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {(webinarData.seatLimit || 0) -
                      (webinarData.enrolledStudents?.length || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FaVideo className="w-4 h-4 mr-2 text-purple-500" />
                    Type:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {webinarData.webinarType || "Live"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div
            data-aos="fade-left"
            data-aos-delay="100"
            className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg ring-1 ring-indigo-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <span className="text-2xl mr-2">✨</span>
              What You'll Get
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaVideo className="text-blue-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Live interactive session
                </span>
              </li>
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaDownload className="text-green-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Downloadable resources
                </span>
              </li>
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaPlayCircle className="text-red-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Session recording
                </span>
              </li>
              <li className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUsers className="text-purple-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">
                  Q&A with expert
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarDetails;
