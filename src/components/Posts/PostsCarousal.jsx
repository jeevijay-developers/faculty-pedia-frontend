"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { postsData, getPostsByCategory } from "@/Data/Posts/posts.data";
import PostCard from "./PostCard";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import "swiper/css";
import "swiper/css/navigation";
import { fetchIITJEEBlogs } from "../server/exams/iit-jee/routes";
import Loading from "../Common/Loading";

const PostCarousel = ({ subject = "All", specialization = "IIT-JEE" }) => {
  const [swiperRef, setSwiperRef] = useState(null);

  // Get posts based on subject prop
  // const filteredPosts = subject === 'All' ? postsData : getPostsByCategory(subject);

  const [filteredPosts, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const DATA = await fetchIITJEEBlogs({
          specialization,
        });
        console.log(DATA);
        setData([...DATA.blogs]);
      } catch (error) {
        console.error("Failed to fetch educators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [specialization]);

  if (loading) {
    return <Loading />;
  }

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 truncate">
            {subject === "All" ? "Latest Posts" : `${subject} Posts`}
          </h2>
          <Link
            href="/posts"
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
        </div>
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2  z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
            aria-label="Previous slide"
            style={{ left: "-1rem" }}
          >
            <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
            aria-label="Next slide"
            style={{ right: "-1rem" }}
          >
            <RiArrowRightSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={filteredPosts.length > 1}
            className="posts-carousel"
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {filteredPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <PostCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PostCarousel;
