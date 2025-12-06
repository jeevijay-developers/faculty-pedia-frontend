import React, { useState, useEffect } from "react";
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
import { getWebinarById } from "@/components/server/webinars.routes";
import { getCourseById } from "@/components/server/course.routes";
import { getTestSeriesById } from "@/components/server/test-series.route";
import { followEducator, unfollowEducator } from "@/components/server/student/student.routes";
import { getUserData } from "@/utils/userData";
import { toast } from "react-hot-toast";

const ViewProfile = ({ educatorData }) => {
  
  // Add safety check at the top
  if (!educatorData) {
    console.error("ViewProfile: educatorData is null or undefined");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-gray-800">
            No educator data available
          </p>
        </div>
      </div>
    );
  }
    
  // State for managing visible items
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [visibleWebinars, setVisibleWebinars] = useState(6);
  const [visibleTestSeries, setVisibleTestSeries] = useState(6);

  console.log("Educator data: ", educatorData);

  const ratingAverage = Number(
    educatorData?.rating?.average ?? educatorData?.rating ?? 0
  );
  const ratingCount = Number(
    educatorData?.rating?.count ??
      educatorData?.reviewCount ??
      educatorData?.ratingsCount ??
      0
  );
  
  // State for webinar details
  const [webinarDetails, setWebinarDetails] = useState([]);
  const [loadingWebinars, setLoadingWebinars] = useState(false);

  // State for course details
  const [courseDetails, setCourseDetails] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // State for test series details
  const [testSeriesDetails, setTestSeriesDetails] = useState([]);
  const [loadingTestSeries, setLoadingTestSeries] = useState(false);

  // State for follow functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    educatorData?.followers?.length || 0
  );
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already following this educator
  useEffect(() => {
    const userData = getUserData();
    setCurrentUser(userData);
    
    if (userData && userData.followingEducators && educatorData?._id) {
      const following = userData.followingEducators.some(
        (follow) => follow.educatorId === educatorData._id || follow.educatorId?._id === educatorData._id
      );
      setIsFollowing(following);
    }
  }, [educatorData?._id]);

  // Fetch webinar details when component mounts or educatorData changes
  useEffect(() => {
    const fetchWebinarDetails = async () => {
      if (educatorData?.webinars && educatorData.webinars.length > 0) {
        setLoadingWebinars(true);
        try {
          const webinarPromises = educatorData.webinars.map(webinarId => 
            getWebinarById(webinarId)
          );
          const webinars = await Promise.all(webinarPromises);
          setWebinarDetails(webinars.filter(webinar => webinar)); // Filter out any null/undefined results
        } catch (error) {
          console.error("Error fetching webinar details:", error);
          setWebinarDetails([]);
        } finally {
          setLoadingWebinars(false);
        }
      }
    };

    fetchWebinarDetails();
  }, [educatorData?.webinars]);

  // Fetch course details when component mounts or educatorData changes
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (educatorData?.courses && educatorData.courses.length > 0) {
        setLoadingCourses(true);
        try {
          const coursePromises = educatorData.courses.map(courseId => 
            getCourseById(courseId)
          );
          const courses = await Promise.all(coursePromises);          
          setCourseDetails(courses.filter(course => course)); // Filter out any null/undefined results
          
        } catch (error) {
          console.error("Error fetching course details:", error);
          setCourseDetails([]);
        } finally {
          setLoadingCourses(false);
        }
      }
    };

    fetchCourseDetails();
  }, [educatorData?.courses]);

  // Fetch test series details when component mounts or educatorData changes
  useEffect(() => {
    const fetchTestSeriesDetails = async () => {
      if (educatorData?.testSeries && educatorData.testSeries.length > 0) {
        setLoadingTestSeries(true);
        try {
          const testSeriesPromises = educatorData.testSeries.map(testSeriesId => 
            getTestSeriesById(testSeriesId)
          );
          const testSeriesList = await Promise.all(testSeriesPromises);
          setTestSeriesDetails(testSeriesList.filter(testSeries => testSeries)); // Filter out any null/undefined results
        } catch (error) {
          console.error("Error fetching test series details:", error);
          setTestSeriesDetails([]);
        } finally {
          setLoadingTestSeries(false);
        }
      }
    };

    fetchTestSeriesDetails();
  }, [educatorData?.testSeries]);

  if (!educatorData) return null;  // Functions to load more items
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
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login as a student to follow educators");
      return;
    }

    if (!educatorData?._id) {
      toast.error("Educator information not available");
      return;
    }

    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowEducator(currentUser._id, educatorData._id);
        toast.success("Unfollowed successfully");
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
        
        // Update local storage
        const updatedFollowing = currentUser.followingEducators.filter(
          (follow) => follow.educatorId !== educatorData._id && follow.educatorId?._id !== educatorData._id
        );
        const updatedUser = { ...currentUser, followingEducators: updatedFollowing };
        localStorage.setItem("faculty-pedia-student-data", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      } else {
        await followEducator(currentUser._id, educatorData._id);
        toast.success("Followed successfully");
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
        
        // Update local storage
        const newFollow = { educatorId: educatorData._id, followedAt: new Date() };
        const updatedFollowing = [...(currentUser.followingEducators || []), newFollow];
        const updatedUser = { ...currentUser, followingEducators: updatedFollowing };
        localStorage.setItem("faculty-pedia-student-data", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error(error.response?.data?.message || "Failed to update follow status");
      // Revert optimistic update on error
      if (isFollowing) {
        setFollowerCount((prev) => prev + 1);
      } else {
        setFollowerCount((prev) => Math.max(0, prev - 1));
      }
    } finally {
      setIsLoadingFollow(false);
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
                    src={educatorData.image?.url || "/images/placeholders/1.svg"}
                    alt={`${educatorData.firstName} ${educatorData.lastName}`}
                    fill
                    sizes="(100vw)"
                    className="object-cover"
                    priority
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
                    educatorData.qualification.map((q, i) => {
                      return (
                        <section key={i}>
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
                          i < Math.floor(ratingAverage)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {ratingAverage.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({ratingCount} reviews)
                  </span>
                </div>

                {/* Follow Button and Follower Count */}
                <div className="flex flex-col items-center lg:items-start gap-3 mb-6">
                  <div className="flex gap-5 items-center">
                    <button
                      onClick={handleFollowToggle}
                      disabled={isLoadingFollow || !currentUser}
                      className={`flex items-center gap-2 px-6 py-2 text-sm rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFollowing
                          ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isLoadingFollow ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : isFollowing ? (
                        <>
                          <FaUserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="w-4 h-4" />
                          {currentUser ? "Follow" : "Login to Follow"}
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
                      src={(() => {
                        if (!educatorData.introVideoLink) return "";
                        
                        const url = educatorData.introVideoLink;
                        
                        // Extract video ID from various YouTube URL formats
                        let videoId = null;
                        
                        // Format: https://www.youtube.com/watch?v=VIDEO_ID
                        if (url.includes("youtube.com/watch?v=")) {
                          videoId = url.split("watch?v=")[1]?.split("&")[0];
                        }
                        // Format: https://youtu.be/VIDEO_ID
                        else if (url.includes("youtu.be/")) {
                          videoId = url.split("youtu.be/")[1]?.split("?")[0];
                        }
                        // Format: https://www.youtube.com/embed/VIDEO_ID (already correct)
                        else if (url.includes("youtube.com/embed/")) {
                          return url;
                        }
                        
                        // Convert to embed URL
                        return videoId 
                          ? `https://www.youtube.com/embed/${videoId}`
                          : url; // Fallback to original if can't parse
                      })()}
                      title="Introduction Video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                      {courseDetails?.length || 0}
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
        {courseDetails && courseDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Courses
            </h2>
            {loadingCourses ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading courses...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseDetails
                  .slice(0, visibleCourses)
                  .map((course, index) => (
                    <CourseCard
                      key={course._id || index}
                      course={{ 
                        ...course, 
                        educator: {
                          _id: educatorData._id,
                          firstName: educatorData.firstName,
                          lastName: educatorData.lastName,
                          image: educatorData.image,
                          specialization: educatorData.specialization,
                          qualification: educatorData.qualification,
                          rating: ratingAverage,
                          yearsExperience: educatorData.yearsExperience
                        }
                      }}
                    />
                  ))}
              </div>
            )}
            {visibleCourses < courseDetails.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreCourses}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  View More Courses
                  <span className="text-sm">
                    ({Math.min(3, courseDetails.length - visibleCourses)}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Webinars Section */}
        {webinarDetails && webinarDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Webinars
            </h2>
            {loadingWebinars ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading webinars...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinarDetails
                  .slice(0, visibleWebinars)
                  .map((webinar, index) => (
                    <UpcomingWebinarCard
                      key={webinar._id || index}
                      item={{
                        id: webinar._id,
                        title: webinar.title,
                        description: webinar.description,
                        educatorName: `${educatorData.firstName} ${educatorData.lastName}`,
                        educatorPhoto: educatorData.image?.url || "/images/placeholders/1.svg",
                        qualification: educatorData.qualification?.[0]?.title || "N/A",
                        specialization: webinar.specialization || educatorData.specialization,
                        subject: webinar.subject,
                        totalHours: `${Math.floor(webinar.duration / 60)}h ${webinar.duration % 60}m`,
                        timeRange: webinar.time,
                        date: new Date(webinar.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }),
                        fee: webinar.fees?.toString() || "0",
                        detailsLink: `/webinars/${webinar._id}`,
                        image: webinar.image?.url || "/images/placeholders/1.svg",
                        seatLimit: webinar.seatLimit,
                        enrolledCount: webinar.enrolledStudents?.length || 0,
                        webinarType: webinar.webinarType,
                        webinarLink: webinar.webinarLink
                      }}
                    />
                  ))}
              </div>
            )}
            {visibleWebinars < webinarDetails.length && (
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
                      webinarDetails.length - visibleWebinars
                    )}{" "}
                    more)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Test Series Section */}
        {testSeriesDetails && testSeriesDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Test Series
            </h2>
            {loadingTestSeries ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading test series...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testSeriesDetails
                  .slice(0, visibleTestSeries)
                  .map((testSeries, index) => (
                    <TestSeriesCard
                      key={testSeries._id || index}
                      testSeries={{
                        id: testSeries._id,
                        title: testSeries.title,
                        educatorName: `${educatorData.firstName} ${educatorData.lastName}`,
                        educatorPhoto: educatorData.image?.url || "/images/placeholders/1.svg",
                        qualification: educatorData.qualification?.[0]?.title || "N/A",
                        subject: testSeries.subject,
                        specialization: testSeries.specialization,
                        noOfTests: testSeries.noOfTests,
                        fee: testSeries.price,
                        slug: testSeries._id || `test-series-${index}`,
                        description: testSeries.description,
                        validity: testSeries.validity,
                        startDate: testSeries.startDate,
                        endDate: testSeries.endDate,
                      }}
                    />
                  ))}
              </div>
            )}
            {visibleTestSeries < testSeriesDetails.length && (
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
                      testSeriesDetails.length - visibleTestSeries
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
                {courseDetails?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {webinarDetails?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Webinars</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {testSeriesDetails?.length || 0}
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
