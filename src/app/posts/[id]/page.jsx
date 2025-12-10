"use client";

import React, { useEffect, useState } from "react";
import { fetchPostById } from "@/components/server/exams/iit-jee/routes";
import Loading from "@/components/Common/Loading";
import Link from "next/link";
import Image from "next/image";
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTag,
  FaBook,
  FaArrowLeft
} from "react-icons/fa";

const PostDetailsPage = ({ params }) => {
  const [post, setPost] = useState(null);
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
    const fetchPostDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching post with ID:", id);
        const response = await fetchPostById(id);
        console.log("Post API Response:", response);
        
        // Handle response structure
        let postData = null;
        if (response?.data?.post) {
          postData = response.data.post;
        } else if (response?.data) {
          postData = response.data;
        } else if (response?.post) {
          postData = response.post;
        } else {
          postData = response;
        }
        
        console.log("Post Data:", postData);
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message || "Failed to load post details");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "NEET":
        return "bg-green-100 text-green-800 border-green-300";
      case "IIT-JEE":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CBSE":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading message="Loading post details..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-6">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Post Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load post details. The post may have been removed or doesn't exist.
          </p>
          <Link
            href="/posts"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    specializations,
    subjects,
    educatorId,
    createdAt,
    updatedAt,
  } = post;

  const educator = educatorId || {};
  const category = specializations?.[0] || "General";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Posts</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Post Header */}
          <div className="p-8 border-b border-gray-200">
            {/* Categories/Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {specializations && Array.isArray(specializations) && specializations.map((spec, idx) => (
                <span
                  key={idx}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(spec)}`}
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={educator?.profilePicture || educator?.image?.url || '/images/placeholders/1.svg'}
                    alt={educator?.fullName || "Educator"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      {educator?.fullName || "Educator"}
                    </span>
                  </div>
                  {educator?.username && (
                    <div className="text-xs text-gray-500">@{educator.username}</div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm">
                <FaCalendarAlt className="text-blue-600" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-8">
            {/* Subjects */}
            {subjects && Array.isArray(subjects) && subjects.length > 0 && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaBook className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Subjects Covered</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-gray-700 rounded-md text-sm font-medium capitalize"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {description}
              </div>
            </div>
          </div>

          {/* Post Footer */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {updatedAt && createdAt !== updatedAt && (
                  <span>Last updated: {formatDate(updatedAt)}</span>
                )}
              </div>
              
              {/* Author Info */}
              {educator && (
                <Link
                  href={`/educators/${educator._id || educator.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FaUser />
                  <span>View Educator Profile</span>
                </Link>
              )}
            </div>
          </div>
        </article>

        {/* Related Info */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About the Post</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Specialization</div>
              <div className="font-semibold text-gray-900">
                {specializations?.join(', ') || 'General'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Subjects</div>
              <div className="font-semibold text-gray-900 capitalize">
                {subjects?.join(', ') || 'Multiple'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
