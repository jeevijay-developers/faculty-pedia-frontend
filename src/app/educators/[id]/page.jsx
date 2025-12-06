"use client";

import React, { useEffect, useState } from "react";
import { fetchEducatorById } from "@/components/server/exams/iit-jee/routes";
import Loading from "@/components/Common/Loading";
import Link from "next/link";
import Image from "next/image";
import { 
  FaBook, 
  FaClock, 
  FaCalendarAlt, 
  FaUsers, 
  FaGraduationCap,
  FaStar,
  FaChalkboardTeacher,
  FaAward,
  FaBriefcase
} from "react-icons/fa";
import { MdSchool, MdEmail, MdPhone } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import EnrollButton from "@/components/Common/EnrollButton";

const EducatorDetailsPage = ({ params }) => {
  const [educator, setEducator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchEducatorDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching educator with ID:", id);
        const response = await fetchEducatorById(id);
        console.log("Educator API Response:", response);
        
        // Handle response structure
        let educatorData = null;
        if (response?.data?.educator) {
          educatorData = response.data.educator;
        } else if (response?.educator) {
          educatorData = response.educator;
        } else if (response?.data) {
          educatorData = response.data;
        } else {
          educatorData = response;
        }
        
        console.log("Educator Data:", educatorData);
        setEducator(educatorData);
      } catch (error) {
        console.error("Error fetching educator:", error);
        setError(error.message || "Failed to load educator details");
      } finally {
        setLoading(false);
      }
    };

    fetchEducatorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading message="Loading educator details..." />
      </div>
    );
  }

  if (error || !educator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Educator Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load educator details. Please try again later.
          </p>
          <Link
            href="/educators"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Educators
          </Link>
        </div>
      </div>
    );
  }

  const {
    fullName,
    username,
    email,
    mobileNumber,
    profilePicture,
    image,
    bio,
    description,
    specialization,
    subject,
    class: classes,
    payPerHourFee,
    rating,
    yoe,
    followers,
    courses,
    webinars,
    testSeries,
  } = educator;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Educator Image */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={profilePicture || image?.url || '/images/placeholders/1.svg'}
                  alt={fullName || 'Educator'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Educator Info */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{fullName}</h1>
              <p className="text-xl text-blue-100 mb-4">@{username}</p>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {specialization && Array.isArray(specialization) && specialization.map((spec, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                    {spec}
                  </span>
                ))}
              </div>

              {rating && (
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < Math.floor(rating.average)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {rating.average?.toFixed(1) || 0}
                  </span>
                  <span className="text-blue-100">
                    ({rating.count || 0} reviews)
                  </span>
                </div>
              )}

              {payPerHourFee && payPerHourFee > 0 && (
                <div className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg">
                  <div className="text-sm font-medium">Pay Per Hour</div>
                  <div className="text-3xl font-bold">₹{payPerHourFee.toLocaleString('en-IN')}</div>
                  <div className="text-sm">per hour</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaChalkboardTeacher className="text-blue-600" />
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {bio || description || "No description available."}
              </p>
            </div>

            {/* Subjects & Expertise */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBook className="text-blue-600" />
                Teaching Subjects
              </h2>
              <div className="flex flex-wrap gap-3">
                {subject && Array.isArray(subject) && subject.map((sub, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium capitalize"
                  >
                    {sub}
                  </div>
                ))}
              </div>
            </div>

            {/* Classes */}
            {classes && Array.isArray(classes) && classes.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MdSchool className="text-blue-600" />
                  Classes
                </h2>
                <div className="flex flex-wrap gap-3">
                  {classes.map((cls, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium"
                    >
                      {cls.replace('class-', 'Class ').toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses, Webinars, Test Series */}
            {(courses?.length > 0 || webinars?.length > 0 || testSeries?.length > 0) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-blue-600" />
                  Offerings
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {courses && courses.length > 0 && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                  )}
                  {webinars && webinars.length > 0 && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{webinars.length}</div>
                      <div className="text-sm text-gray-600">Webinars</div>
                    </div>
                  )}
                  {testSeries && testSeries.length > 0 && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{testSeries.length}</div>
                      <div className="text-sm text-gray-600">Test Series</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              
              {yoe && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaBriefcase className="text-blue-600 text-xl" />
                  <div>
                    <div className="text-sm text-gray-600">Experience</div>
                    <div className="font-semibold text-gray-900">{yoe} years</div>
                  </div>
                </div>
              )}

              {followers && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <FaUsers className="text-purple-600 text-xl" />
                  <div>
                    <div className="text-sm text-gray-600">Followers</div>
                    <div className="font-semibold text-gray-900">
                      {Array.isArray(followers) ? followers.length : followers}
                    </div>
                  </div>
                </div>
              )}

              {rating && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <FaStar className="text-yellow-600 text-xl" />
                  <div>
                    <div className="text-sm text-gray-600">Rating</div>
                    <div className="font-semibold text-gray-900">
                      {rating.average?.toFixed(1) || 0} / 5.0
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Book Session Button */}
            {payPerHourFee && payPerHourFee > 0 && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Book a Session</h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold">₹{payPerHourFee.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-blue-100">per hour</div>
                </div>
                <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                  Book Now
                </button>
                <p className="text-xs text-blue-100 mt-3 text-center">
                  Get personalized 1-on-1 guidance
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
              
              {email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MdEmail className="text-blue-600 text-xl" />
                  <span className="text-sm break-all">{email}</span>
                </div>
              )}

              {mobileNumber && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MdPhone className="text-blue-600 text-xl" />
                  <span className="text-sm">{mobileNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorDetailsPage;
