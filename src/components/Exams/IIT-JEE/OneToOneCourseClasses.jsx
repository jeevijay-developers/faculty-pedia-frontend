'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { iitJeeOneToOneCourseCourses } from '@/Data/Exams/iit-jee.data';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import 'swiper/css';
import 'swiper/css/navigation';

const OneToOneCourseClasses = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">1-1 Live Course Classes</h2>
          <Link
            href="/courses/iit-jee/one-to-one-course"
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
        </div>
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
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
            loop={iitJeeOneToOneCourseCourses.length > 1}
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
            {iitJeeOneToOneCourseCourses.map((course) => (
              <SwiperSlide key={course.id}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative h-40 bg-gray-200 overflow-hidden flex-shrink-0">
                    <Image
                      src={course.postImage}
                      alt={course.educatorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight overflow-hidden">
                      {course.title}
                    </h3>
                    <h4 className="text-base font-semibold text-blue-600 mb-1">{course.educatorName}</h4>
                    <div className="mb-2 text-sm text-gray-600">
                      <span className="font-medium">Qualification: </span>{course.qualification}
                    </div>
                    <div className="mb-2 text-sm text-gray-600">
                      <span className="font-medium">Subject: </span>{course.subject}
                    </div>
                    <div className="mb-2 text-sm text-gray-600">
                      <span className="font-medium">Total Hours: </span>{course.totalHours}
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                      <span className="font-medium">Fee: </span>₹{course.fee.toLocaleString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2">

                      <Link
                        href={`/courses/iit-jee/one-to-one-course/${course.id}`}
                        className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/courses/iit-jee/one-to-one-course/${course.id}/enroll`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
                      >
                        Enroll Now
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

export default OneToOneCourseClasses;