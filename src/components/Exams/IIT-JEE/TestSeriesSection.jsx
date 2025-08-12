'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { iitJeeTestSeries } from '@/Data/Exams/iit-jee.data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestSeriesSection = () => {
    const [swiperRef, setSwiperRef] = useState(null);

    const prevSlide = () => {
        if (swiperRef) swiperRef.slidePrev();
    };

    const nextSlide = () => {
        if (swiperRef) swiperRef.slideNext();
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Online Test Series</h2>
                    <Link
                        href="/exams/iit-jee/test-series"
                        className="group flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300"
                    >
                        <span className="mr-2">View All</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-transparent rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
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
                        modules={[Navigation, Autoplay]}
                        onSwiper={setSwiperRef}
                        spaceBetween={24}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop={iitJeeTestSeries.length > 3}
                        className="test-series-carousel pb-12"
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
                        {iitJeeTestSeries.map((testSeries) => (
                            <SwiperSlide key={testSeries.id}>
                                <TestSeriesCard testSeries={testSeries} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

// Test Series Card Component
const TestSeriesCard = ({ testSeries }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
            {/* Educator Photo */}
            <div className="relative h-40 bg-gray-100">
                <Image
                    src={testSeries.educatorPhoto}
                    alt={testSeries.educatorName}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                    {testSeries.title}
                </h3>
                <h4 className="text-base font-semibold text-blue-600 mb-1">
                    {testSeries.educatorName}
                </h4>
                <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Qualification: </span>{testSeries.qualification}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Subject: </span>{testSeries.subject}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Number of Tests: </span>{testSeries.noOfTests}
                </div>
                <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium">Fee: </span>₹{testSeries.fee.toLocaleString()}
                </div>

                {/* Action Button */}
                <div className="flex flex-row gap-2">
                    <Link
                        href={`/exams/iit-jee/test-series/${testSeries.slug}`}
                        className="w-full text-gray-700 border border-gray-300 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
                    >
                        View details
                    </Link>
                    <Link
                        href={`/exams/iit-jee/test-series/${testSeries.id}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
                    >
                        Grab the series
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TestSeriesSection;
