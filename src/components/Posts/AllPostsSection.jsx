'use client';

import React, { useState } from 'react';
import Banner from '../Common/Banner';
import PostCard from './PostCard';
import { postsData, getPostsByCategory } from '../../Data/Posts/posts.data';

const AllPostsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [displayedPosts, setDisplayedPosts] = useState(9);
  
  const categories = ['All Posts', 'NEET', 'IIT-JEE'];
  let allFilteredPosts = [];
  if (selectedCategory === 'All Posts') {
    allFilteredPosts = postsData;
  } else if (selectedCategory === 'IIT-JEE') {
    allFilteredPosts = getPostsByCategory('IIT-JEE');
  } else {
    allFilteredPosts = getPostsByCategory(selectedCategory);
  }
  const postsToShow = allFilteredPosts.slice(0, displayedPosts);
  const hasMorePosts = displayedPosts < allFilteredPosts.length;

  const handleLoadMore = () => {
    setDisplayedPosts(prev => prev + 9);
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
        title="Latest Posts & Articles"
        subtitle="Stay updated with the latest educational content, tips, and insights from our expert faculty"
      />

      {/* Posts Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Educational Posts</h2>
              <p className="text-gray-600">
                Showing {postsToShow.length} of {allFilteredPosts.length} {selectedCategory === 'All Posts' ? '' : selectedCategory} posts
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label htmlFor="category-select" className="text-sm font-medium text-gray-700">
                Filter by Category:
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 min-w-[150px]"
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
          {allFilteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsToShow.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMorePosts && (
                <div className="text-center mt-12">
                  <button 
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:cursor-pointer"
                  >
                    Load More Posts ({allFilteredPosts.length - displayedPosts} remaining)
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
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
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
