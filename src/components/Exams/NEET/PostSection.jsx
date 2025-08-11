'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { neetOneToOneCourseCourses, neetLatestPosts } from '@/Data/Exams/neet.data';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import 'swiper/css';
import 'swiper/css/navigation';

const OneToOnePPHClasses = () => {
  const [swiperRef, setSwiperRef] = useState(null);

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 truncate">Latest Posts</h2>
          <Link
            href="/courses/neet/posts"
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
            style={{ left: '-1rem' }}
          >
            <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
            aria-label="Next slide"
            style={{ right: '-1rem' }}
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
              pauseOnMouseEnter: true
            }}
            loop={neetOneToOneCourseCourses.length > 1}
            className="one-to-one-carousel"
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
            {neetLatestPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className='font-semibold'>{post.title}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{post.description}</p>
                    {/* Action Buttons */}

                    <div className='flex items-center gap-2 mt-4'>
                      <div className='flex items-center gap-3'>
                      <div className="relative h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <Image
                          src={post.postImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                        <p className='text-md font-semibold text-gray-600'>{post.educatorName}</p>
                      </div>
                      <Link
                        href={`/courses/neet/posts/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 ml-auto flex items-center gap-1"
                      >
                        Read More
                        <MdKeyboardDoubleArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default OneToOnePPHClasses;
