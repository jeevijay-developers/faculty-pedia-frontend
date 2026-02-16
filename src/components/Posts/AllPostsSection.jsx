"use client";

import React, { useState, useEffect } from "react";
import Banner from "../Common/Banner";
import PostCard from "./PostCard";
import { fetchPosts, getPostsByEducator } from "../server/posts.route";

const AllPostsSection = ({ educatorId, educatorName: propEducatorName }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [displayedPosts, setDisplayedPosts] = useState(9);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [educatorName, setEducatorName] = useState(propEducatorName || "");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });

  const categories = ["All Posts", "CBSE", "NEET", "IIT-JEE"];

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError("");
      try {
        let posts = [];
        let paginationData = { currentPage: 1, totalPages: 1, totalPosts: 0 };

        if (educatorId) {
          // Fetch posts by specific educator
          const result = await getPostsByEducator(educatorId, { limit: 100 });
          posts = result.posts || [];
          paginationData = result.pagination || paginationData;
          // Try to extract educator name from first post
          const firstPost = posts[0];
          if (firstPost?.educatorName || firstPost?.educator?.name) {
            setEducatorName(firstPost.educatorName || firstPost.educator?.name || "");
          }
        } else {
          // Fetch all posts with optional category filter
          const specialization =
            selectedCategory === "All Posts" ? undefined : selectedCategory;
          const result = await fetchPosts({
            page: 1,
            limit: 100,
            specialization,
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          posts = result.posts || [];
          paginationData = result.pagination || paginationData;
        }

        setAllPosts(posts);
        setPagination(paginationData);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts. Please try again.");
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
    setDisplayedPosts(9);
  }, [selectedCategory, educatorId]);

  const allFilteredPosts = allPosts;
  const postsToShow = allFilteredPosts.slice(0, displayedPosts);
  const hasMorePosts = displayedPosts < allFilteredPosts.length;

  const handleLoadMore = () => {
    setDisplayedPosts((prev) => prev + 9);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayedPosts(9); // Reset to show first 9 posts when category changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <Banner
        url="/images/Banner/1.png"
        title={educatorId ? (educatorName ? `${educatorName}'s Posts` : "Educator's Posts") : "Latest Posts & Articles"}
        subtitle={educatorId
          ? `Explore posts and articles by ${educatorName || "this educator"}.`
          : "Stay updated with the latest educational content, tips, and insights from our expert faculty"}
      />

      {/* Posts Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {educatorId ? (educatorName ? `Posts by ${educatorName}` : "Educator Posts") : "Educational Posts"}
              </h2>
              <p className="text-gray-600">
                Showing {postsToShow.length} of {allFilteredPosts.length}{" "}
                {selectedCategory === "All Posts" ? "" : selectedCategory} posts
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="category-select"
                className="text-sm font-medium text-gray-700"
              >
                Filter by Category:
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 min-w-37.5"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error}
              </h3>
            </div>
          ) : allFilteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsToShow.map((post) => (
                  <PostCard key={post._id || post.id} post={post} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMorePosts && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:cursor-pointer"
                  >
                    Load More Posts ({allFilteredPosts.length - displayedPosts}{" "}
                    remaining)
                  </button>
                </div>
              )}

              {/* Show all loaded message */}
              {!hasMorePosts && allFilteredPosts.length > 9 && (
                <div className="text-center mt-12">
                  <p className="text-gray-600 font-medium">
                    All {allFilteredPosts.length} posts loaded
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                There are no posts available for the selected category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllPostsSection;
