'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { jeeMainCourseData } from '@/Data/jeeMainCourseData';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { FiUser, FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const JEEMainSection = ({
    title = "JEE Main Courses",
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

    const coursesToRender = courses.length > 0 ? courses : jeeMainCourseData;
    // console.log('Courses to render:', coursesToRender);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-row justify-between items-center gap-2 mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800  truncate">{title}</h2>
                    <Link
                        href={viewMoreLink}
                        className="group flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300"
                    >
                        <span className="mr-2">View all</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Carousel Container */}

                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 lg:-translate-x-14 z-20 bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                        aria-label="Previous slide"
                        style={{ left: '-1rem' }}
                    >
                        <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 lg:translate-x-14 z-20 bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                        aria-label="Next slide"
                        style={{ right: '-1rem' }}
                    >
                        <RiArrowRightSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </button>

                    {/* Swiper Carousel */}
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        onSwiper={setSwiperRef}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={autoplay ? {
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        } : false}
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
            {/* Course Image at the very top */}
            <div className="relative w-full h-40 bg-gray-200 overflow-hidden flex-shrink-0">
                {course.image ? (
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority
                    />
                ) : (
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
                )}
            </div>

            {/* Course Content */}
            <div className="p-5 flex flex-col flex-grow">

                {/* Course Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight text-ellipsis truncate overflow-hidden">
                    {course.title}
                </h3>

                {/* Description */}
                <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2 text-ellipsis overflow-hidden min-h-[2.6em] leading-tight">
                        {course.description}
                    </p>
                </div>

                {/* Instructor */}
                <div className="flex items-center mb-3 text-gray-600">
                    <FiUser className="mr-2 text-blue-600" size={16} />
                    <p className="text-sm">{course.instructor}</p>
                </div>

                {/* Duration and Start Date */}
                <div className="flex flex-col space-y-2 mb-4 text-gray-600">
                    <div className="flex items-center">
                        <FiClock className="mr-2 text-blue-600" size={16} />
                        <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                        <FiCalendar className="mr-2 text-blue-600" size={16} />
                        <span className="text-sm">Starts {course.startDate ? course.startDate : '-'}</span>
                    </div>
                </div>


                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-800">₹{course.price}</span>
                        {course.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{course.originalPrice}</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-auto">
                    <Link
                        href={course.enrollLink}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
                    >
                        Enroll Now
                    </Link>
                    <div className="flex space-x-2">
                        <Link
                            href={course.enrollLink}
                            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-md text-xs font-medium transition-colors duration-200 text-center"
                        >
                            View Details
                        </Link>
                        <Link
                            href={course.profileLink}
                            className="flex-1 border border-blue-300 text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-md text-xs font-medium transition-colors duration-200 text-center"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JEEMainSection;
