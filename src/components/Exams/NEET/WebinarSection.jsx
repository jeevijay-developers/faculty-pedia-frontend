'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { upcomingWebinarData } from '@/Data/webinar.data';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const UpcomingWebinarSection = () => {
    const [swiperRef, setSwiperRef] = useState(null);

    const prevSlide = () => {
        if (swiperRef) swiperRef.slidePrev();
    };

    const nextSlide = () => {
        if (swiperRef) swiperRef.slideNext();
    };

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Webinars</h2>
                    <Link
                        href="/webinars/upcoming"
                        className="group flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300"
                    >
                        <span className="mr-2">view all</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                        aria-label="Previous slide"
                    >
                        <MdOutlineKeyboardArrowLeft className='w-5 h-5 text-gray-500 hover:text-gray-900' />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 lg:translate-x-14 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                        aria-label="Next slide"
                    >
                        <MdOutlineKeyboardArrowRight className='w-5 h-5 text-gray-500 hover:text-gray-900' />
                    </button>

                    {/* Swiper Carousel */}
                    <Swiper
                        modules={[Navigation]}
                        onSwiper={setSwiperRef}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={upcomingWebinarData.length > 4}
                        className="webinar-carousel pb-12"
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                    >
                        {upcomingWebinarData.map((webinar) => (
                            <SwiperSlide key={webinar.id}>
                                <WebinarCard webinar={webinar} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

// Webinar Card Component based on the image shown
const WebinarCard = ({ webinar }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
            {/* Webinar Banner Image */}
            <div className="relative h-40 bg-gray-100">
                <Image
                    src={webinar.image}
                    alt={webinar.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>

            {/* Card Content */}
            <div className="p-4">
                {/* Title */}
                <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-900 leading-tight line-clamp-2 text-ellipsis truncate">
                        {webinar.title}
                    </h3>
                </div>

                {/* Instructor */}
                <h4 className="text-base font-semibold text-gray-800 mb-1">
                    {webinar.instructor}
                </h4>

                {/* Experience */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {webinar.experience}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2 ">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {webinar.years} exp.
                    </span>
                    {webinar.subjects.map((subject, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                            {subject}
                        </span>
                    ))}
                </div>
                <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-800">₹{webinar.price}</span>
                        {webinar.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{webinar.originalPrice}</span>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-2 mb-3">

                    <Link
                        href={`/webinars/upcoming/${webinar.id}/details`}
                        className="flex-1 border border-gray-300 text-gray-800 text-xs font-medium py-1.5 px-3 rounded hover:bg-gray-50 transition-colors duration-200 text-center"
                    >
                        View Details
                    </Link>
                                        <Link
                        href={`/webinars/upcoming/${webinar.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 text-xs font-medium rounded transition-colors duration-200 text-center"
                    >
                        Join Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpcomingWebinarSection;