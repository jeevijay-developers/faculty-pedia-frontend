import React, { useState } from "react";
import Image from "next/image";
import { IoStarSharp, IoCallSharp, IoMailSharp } from "react-icons/io5";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import CourseCard from "@/components/Courses/CourseCard";
import UpcomingWebinarCard from "@/components/Webinars/UpcomingWebinarCard";
import { TestSeriesCard } from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import { IoLogoWhatsapp } from "react-icons/io";
import Link from "next/link";

const ViewProfile = ({ educatorData }) => {

  // State for managing visible items
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [visibleWebinars, setVisibleWebinars] = useState(6);
  const [visibleTestSeries, setVisibleTestSeries] = useState(6);

  // State for follow functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    educatorData?.followers?.length || 0
  );

  if (!educatorData) return null;

  // Functions to load more items
  const loadMoreCourses = () => {
    setVisibleCourses((prev) => prev + 3);
  };

  const loadMoreWebinars = () => {
    setVisibleWebinars((prev) => prev + 3);
  };

  const loadMoreTestSeries = () => {
    setVisibleTestSeries((prev) => prev + 3);
  };

  // Follow functionality
  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Educator Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Educator Photo & Basic Info */}
            <div className="lg:w-1/3">
              {/* Educator Photo */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600">
                  <Image
                    src={
                      educatorData.image?.url || "/images/placeholders/1.svg"
                    }
                    // onError={(e) => {
                    //   const TARGET = e.target;
                    //   TARGET.src = "/images/placeholders/1.svg";
                    // }}
                    alt={`${educatorData.firstName} ${educatorData.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {`${educatorData.firstName} ${educatorData.lastName}`}
                </h1>

                <div className="mb-3">
                  {educatorData.qualification &&
                    educatorData.qualification.map((q) => {
                      return (
                        <section>
                          <p className="text-lg text-blue-600 font-medium">
                            {q?.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {q?.institute}
                          </p>
                        </section>
                      );
                    })}
                </div>

                <div className="mb-3">
                  <p className="text-gray-600">
                    {educatorData.yearsExperience}+ years experience
                  </p>
                </div>

                {/* Specialization Badge */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {educatorData.specialization}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <IoMailSharp className="w-4 h-4" />
                    <span className="text-sm">{educatorData.email}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <IoCallSharp className="w-4 h-4" />
                    <span className="text-sm">{educatorData.mobileNumber}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <IoStarSharp
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(educatorData.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {educatorData.rating}
                  </span>
                  <span className="text-gray-600">
                    ({educatorData.reviewCount} reviews)
                  </span>
                </div>

                {/* Follow Button and Follower Count */}
                <div className="flex flex-col items-center lg:items-start gap-3 mb-6">
                  <div className="flex gap-5 items-center">
                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center gap-2 px-6 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        isFollowing
                          ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <FaUserCheck className="w-4 h-4" />
                          Following
                          <span>
                            {" "}
                            <IoLogoWhatsapp className="text-green-500" />{" "}
                          </span>
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>

                    <Link
                      href={`https://wa.me/${educatorData.mobileNumber}`}
                      target="_blank"
                    >
                      <span className="cursor-pointer">
                        {" "}
                        <IoLogoWhatsapp className="text-green-500 w-8 h-8" />{" "}
                      </span>
                    </Link>
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="text-lg font-semibold text-gray-900">
                      {followerCount.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {followerCount === 1 ? "Follower" : "Followers"}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center lg:justify-start gap-3">
                  {educatorData.socials?.instagram && (
                    <a
                      href={educatorData.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="w-5 h-5 text-pink-600 hover:text-pink-700" />
                    </a>
                  )}
                  {educatorData.socials?.facebook && (
                    <a
                      href={educatorData.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                    </a>
                  )}
                  {educatorData.socials?.twitter && (
                    <a
                      href={educatorData.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter className="w-5 h-5 text-blue-400 hover:text-blue-500" />
                    </a>
                  )}
                  {educatorData.socials?.linkedin && (
                    <a
                      href={educatorData.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="w-5 h-5 text-blue-700 hover:text-blue-800" />
                    </a>
                  )}
                  {educatorData.socials?.youtube && (
                    <a
                      href={educatorData.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube className="w-5 h-5 text-red-600 hover:text-red-700" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 gap-6">
                {/* Intro Video */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction Video
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={educatorData.introVideoLink}
                      title="Introduction Video"
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{educatorData.bio}</p>
        </div>

        {/* Work Experience & Qualifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Work Experience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Work Experience
            </h2>
            <div className="space-y-6">
              {educatorData.workExperience?.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.title}
                  </h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.startDate).getFullYear()} -{" "}
                    {new Date(exp.endDate).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Education & Qualifications
            </h2>
            <div className="space-y-6">
              {educatorData.qualification?.map((qual, index) => (
                <div key={index} className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {qual.title}
                  </h3>
                  <p className="text-green-600 font-medium">{qual.institute}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(qual.startDate).getFullYear()} -{" "}
                    {new Date(qual.endDate).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Details & Payment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Specialization:
                    </span>
                    <span className="text-lg font-semibold text-blue-600">
                      {educatorData.specialization}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Classes:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {educatorData.class}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Courses:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {educatorData.courses?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Experience:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {educatorData.yearsExperience}+ years
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`text-lg font-semibold ${
                        educatorData.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {educatorData.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Followers:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {educatorData.followers?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        {educatorData.courses && educatorData.courses.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educatorData.courses
                .slice(0, visibleCourses)
                .map((course, index) => (
                  <CourseCard
                    key={index}
                    course={{ ...course, educator: educatorData }}
                  />
                ))}
            </div>
            {visibleCourses < educatorData.courses.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreCourses}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Courses
                  <span className="text-sm">
                    ({Math.min(3, educatorData.courses.length - visibleCourses)}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Webinars Section */}
        {educatorData.webinars && educatorData.webinars.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Webinars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educatorData.webinars
                .slice(0, visibleWebinars)
                .map((webinar, index) => (
                  <UpcomingWebinarCard
                    key={index}
                    item={{
                      ...webinar,
                      educatorName: educatorData.name,
                      educatorPhoto: educatorData.profileImage.url,
                      qualification:
                        educatorData.qualification?.[0]?.title || "N/A",
                      specialization: educatorData.specialization,
                      totalHours: "2 Hours",
                      timeRange: "10:00 AM - 12:00 PM",
                      date: "Coming Soon",
                      fee:
                        webinar.price?.replace("₹", "").replace(",", "") || "0",
                      detailsLink: `/webinars/${webinar.id}`,
                    }}
                  />
                ))}
            </div>
            {visibleWebinars < educatorData.webinars.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreWebinars}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Webinars
                  <span className="text-sm">
                    (
                    {Math.min(
                      3,
                      educatorData.webinars.length - visibleWebinars
                    )}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Test Series Section */}
        {educatorData.testSeries && educatorData.testSeries.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Test Series
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educatorData.testSeries
                .slice(0, visibleTestSeries)
                .map((testSeries, index) => (
                  <TestSeriesCard
                    key={index}
                    testSeries={{
                      ...testSeries,
                      id: testSeries.id || `ts_${index}`,
                      educatorName: educatorData.name,
                      educatorPhoto: educatorData.profileImage.url,
                      qualification:
                        educatorData.qualification?.[0]?.title || "N/A",
                      noOfTests: testSeries.numberOfTests,
                      fee: testSeries.price,
                      slug: testSeries.id || `test-series-${index}`,
                    }}
                  />
                ))}
            </div>
            {visibleTestSeries < educatorData.testSeries.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreTestSeries}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Test Series
                  <span className="text-sm">
                    (
                    {Math.min(
                      3,
                      educatorData.testSeries.length - visibleTestSeries
                    )}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Statistics Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Educator Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {educatorData.courses?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {educatorData.webinars?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Webinars</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {educatorData.testSeries?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Test Series</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
