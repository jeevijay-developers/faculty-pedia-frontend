"use client";

import React, { useEffect, useState } from "react";
import { fetchLiveClassById } from "@/components/server/exams/iit-jee/routes";
import Loading from "@/components/Common/Loading";
import { 
  FaBook, 
  FaClock, 
  FaCalendarAlt, 
  FaUsers, 
  FaGraduationCap,
  FaVideo
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import EnrollButton from "@/components/Common/EnrollButton";

const LiveClassDetailsPage = ({ params }) => {
  const [liveClass, setLiveClass] = useState(null);
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
    const fetchLiveClassDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching live class with ID:", id);
        const response = await fetchLiveClassById(id);
        console.log("Live Class API Response:", response);
        
        // Handle response structure
        let classData = null;
        if (response?.data?.liveClass) {
          classData = response.data.liveClass;
        } else if (response?.liveClass) {
          classData = response.liveClass;
        } else if (response?.data) {
          classData = response.data;
        } else {
          classData = response;
        }
        
        console.log("Live Class Data:", classData);
        setLiveClass(classData);
      } catch (error) {
        console.error("Error fetching live class:", error);
        setError(error.message || "Failed to load live class details");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClassDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!liveClass) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Live class not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(liveClass.liveClassSpecification) &&
              liveClass.liveClassSpecification.map((spec, idx) => (
                <span
                  key={idx}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            {Array.isArray(liveClass.class) &&
              liveClass.class.map((cls, idx) => (
                <span
                  key={idx}
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cls}
                </span>
              ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {liveClass.liveClassTitle}
          </h1>

          {/* Educator Info */}
          {liveClass.educatorID && (
            <div className="flex items-center gap-3 mb-4">
              <IoPersonSharp className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-semibold text-gray-900">
                  {liveClass.educatorID?.fullName || 
                   liveClass.educatorID?.username || 
                   "Instructor"}
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FaClock className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {liveClass.classDuration}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FaUsers className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {liveClass.maxStudents}
              </div>
              <div className="text-sm text-gray-600">Max Students</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FaGraduationCap className="w-6 h-6 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {liveClass.enrolledStudents?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Enrolled</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FaBook className="w-6 h-6 mx-auto text-orange-600 mb-2" />
              <div className="text-sm font-bold text-gray-900 capitalize">
                {Array.isArray(liveClass.subject) 
                  ? liveClass.subject.join(", ") 
                  : liveClass.subject}
              </div>
              <div className="text-sm text-gray-600">Subject</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intro Video */}
            {liveClass.introVideo && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaVideo className="text-blue-600" />
                  Introduction Video
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={getYouTubeEmbedUrl(liveClass.introVideo)}
                    title="Live Class Introduction"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Live Class
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {liveClass.description || "Interactive live class session with expert instructor."}
              </p>
            </div>

            {/* Schedule */}
            {liveClass.classTiming && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  Schedule
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCalendarAlt className="text-blue-600" />
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(liveClass.classTiming)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="text-blue-600" />
                    <span className="font-medium">Time:</span>
                    <span>{formatTime(liveClass.classTiming)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ₹{(liveClass.liveClassesFee || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    {liveClass.enrolledStudents?.length || 0} / {liveClass.maxStudents} seats filled
                  </p>
                </div>

                <EnrollButton
                  type="liveClass"
                  itemId={liveClass._id || liveClass.id}
                  price={liveClass.liveClassesFee}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                />

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    This class includes:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {liveClass.classDuration} minutes live session
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      One-on-one interaction
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Q&A session
                    </li>
                    {liveClass.recordingURL && (
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Recording available
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassDetailsPage;