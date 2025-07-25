'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { defaultPosts } from '@/Data/data';
import 'swiper/css';

const OurPosts = ({
  title = "Latest Articles & Resources",
  subtitle = "Expert articles to guide your educational journey",
  viewAllLink = "/blog",
  posts = []
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  
  const postsToDisplay = posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Posts Carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="post-carousel"
          >
            {postsToDisplay.map((post, idx) => (
              <SwiperSlide key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link 
            href={viewAllLink}
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            View all articles
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Post Image */}
      <Link href={post.slug} className="block relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Fallback for missing image */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Post Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title */}
        <Link href={post.slug}>
          <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        
        {/* Footer */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-gray-500 text-xs">{post.readTime}</span>
          <Link 
            href={post.slug}
            className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurPosts;
