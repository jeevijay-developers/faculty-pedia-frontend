"use client";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaTag,
  FaShare,
  FaBookOpen,
  FaGraduationCap,
  FaEye,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const PostDetails = ({ postData }) => {
  const [isClient, setIsClient] = useState(false);

  // Check if postData exists
  if (!postData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">No blog post data available</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setIsClient(true);
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const getReadingTime = () => {
    if (!postData.content?.long) return "5 min read";
    const words = postData.content.long.split(" ").length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    return `${readingTime} min read`;
  };

  const getPublishDate = () => {
    if (!isClient) return "Loading...";
    try {
      // Since there's no publish date in data, we'll use a default recent date
      const date = new Date();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Recently published";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Header Section */}
          <div data-aos="fade-up" className="space-y-6">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {postData.category || "Blog"}
              </span>
              {postData.tags &&
                postData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {postData.title || "Blog Post Title"}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {postData.content?.short || "No description available"}
            </p>
          </div>

          {/* Post Meta */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FaUser className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-semibold text-gray-800">
                    {postData.author
                      ? `${postData.author.firstName} ${postData.author.lastName}`
                      : "Anonymous"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FaCalendarAlt className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="font-semibold text-gray-800">
                    {getPublishDate()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <FaClock className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reading Time</p>
                  <p className="font-semibold text-gray-800">
                    {getReadingTime()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={postData.image?.url || "/images/placeholders/1.svg"}
              alt={postData.title || "Blog Post"}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Post Content */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    postData.content?.long ||
                    postData.content?.short ||
                    "No content available.",
                }}
              />
            </div>
          </div>

          {/* Author Bio Section */}
          {postData.author && (
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <FaUser className="mr-3 text-blue-600" />
                About the Author
              </h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={
                      postData.author.profileImage?.url ||
                      "/images/placeholders/square.svg"
                    }
                    alt={`${postData.author.firstName} ${postData.author.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {postData.author.firstName} {postData.author.lastName}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {postData.author.specialization || "Expert Educator"}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {postData.author.bio ||
                      "Passionate educator dedicated to helping students achieve their academic goals."}
                  </p>
                  {postData.author.rating && (
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">
                        {postData.author.rating}
                      </span>
                      <span className="text-gray-600">
                        ({postData.author.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Content */}
          {(postData.author?.courses?.length > 0 ||
            postData.author?.webinars?.length > 0) && (
            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <FaGraduationCap className="mr-3 text-green-600" />
                Explore More from This Author
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {postData.author.courses &&
                  postData.author.courses.slice(0, 4).map((course, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={
                            course.image?.url || "/images/placeholders/1.svg"
                          }
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {course.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.description?.shortDesc}
                          </p>
                          <p className="text-blue-600 font-medium mt-2">
                            ₹{course.fees}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {/* <div
            data-aos="fade-left"
            className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-xl ring-1 ring-gray-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2">
                <FaHeart className="text-sm" />
                <span>Like Post</span>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2">
                <FaBookmark className="text-sm" />
                <span>Save for Later</span>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2">
                <FaShare className="text-sm" />
                <span>Share Post</span>
              </button>
            </div>
          </div> */}

          {/* Post Stats */}
          {/* <div
            data-aos="fade-left"
            data-aos-delay="100"
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg ring-1 ring-purple-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Post Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <FaEye className="text-blue-500" />
                  <span className="text-gray-700 font-medium">Views</span>
                </div>
                <span className="font-semibold text-gray-800">1,234</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <FaHeart className="text-red-500" />
                  <span className="text-gray-700 font-medium">Likes</span>
                </div>
                <span className="font-semibold text-gray-800">89</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <FaBookmark className="text-green-500" />
                  <span className="text-gray-700 font-medium">Saves</span>
                </div>
                <span className="font-semibold text-gray-800">45</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <FaShare className="text-purple-500" />
                  <span className="text-gray-700 font-medium">Shares</span>
                </div>
                <span className="font-semibold text-gray-800">23</span>
              </div>
            </div>
          </div> */}

          {/* Category Info */}
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg ring-1 ring-orange-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
              <FaTag className="mr-2 text-orange-600" />
              Category
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="inline-block bg-orange-100 text-orange-600 px-3 py-2 rounded-full font-medium">
                {postData.category || "General"}
              </span>
              <p className="text-gray-600 text-sm mt-3">
                Explore more posts in this category to deepen your understanding
                and knowledge.
              </p>
            </div>
          </div>

          {/* Related Tags */}
          {postData.tags && postData.tags.length > 0 && (
            <div
              data-aos="fade-left"
              data-aos-delay="300"
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg ring-1 ring-indigo-100"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Related Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
