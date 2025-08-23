"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { defaultCourses } from "@/Data/data";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const CourseCarousel = ({
  title = "Our Top Courses",
  viewMoreLink = "/courses",
  courses = [],
  autoplay = true,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  const coursesToRender = courses.length > 0 ? courses : defaultCourses;
  // console.log('Courses to render:', coursesToRender);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {title}
          </h2>
          <Link
            href={viewMoreLink}
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
        </div>

        {/* Carousel Container */}

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
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

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={
              autoplay
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            loop={coursesToRender.length > 1}
            className="course-carousel"
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {coursesToRender.map((course, idx) => (
              <SwiperSlide key={course.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Course Card Component
const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Course Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden flex-shrink-0">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        {/* Fallback gradient if image fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs opacity-80">Course</p>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Course Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight overflow-hidden">
          {course.title}
        </h3>
        <h4 className="text-base font-semibold text-gray-600 mb-1">
          {course.instructor}
        </h4>

        {/* Instructor */}
        <div className="mb-4 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Duration */}
        <div className="mb-3">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">
            {course.duration}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-800">
              ₹{course.price}
            </span>
            {course.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{course.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`${course.enrollLink}`}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center"
          >
            View Details
          </Link>
                    {/* <Link
            href={course.enrollLink}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center"
          >
            Enroll Now
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
