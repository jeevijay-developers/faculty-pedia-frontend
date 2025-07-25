'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { defaultWebinars } from '@/Data/data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const WebinarCarousel = ({ 
  title = "Featured Webinars", 
  viewMoreLink = "/webinars",
  webinars = [],
  autoplay = true,
  slidesPerView = 2,
  spaceBetween = 24
}) => {
  const [swiperRef, setSwiperRef] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };


  const webinarsToRender = webinars.length > 0 ? webinars : defaultWebinars;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
          <Link 
            href={viewMoreLink}
            className="bg-white text-gray-700 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
          >
            View More
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, ...(autoplay ? [Autoplay] : [])]}
            onSwiper={setSwiperRef}
            spaceBetween={spaceBetween}
            slidesPerView={1}
            autoplay={autoplay ? { delay: 4000, disableOnInteraction: false } : false}
            loop={webinarsToRender.length > slidesPerView}
            className="webinar-carousel"
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
              },
            }}
          >
            {webinarsToRender.map((webinar, idx) => (
              <SwiperSlide key={webinar.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <WebinarCard webinar={webinar} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Webinar Card Component - Horizontal Layout
const WebinarCard = ({ webinar }) => {
  const isLive = webinar.status === 'live';
  const isFree = webinar.price === 'Free';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full min-h-[400px] flex flex-col">
      <div className="flex flex-col md:flex-row flex-1 h-full">
        {/* Webinar Image */}
        <div className="relative md:w-2/5 h-48 md:h-64 bg-gray-200 overflow-hidden flex-shrink-0">
          <Image
            src={webinar.image}
            alt={webinar.title}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Fallback gradient */}
          <div className="absolute h-full inset-0 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
              </div>
              <p className="text-sm opacity-80">Live Webinar</p>
            </div>
          </div>
          
          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                LIVE
              </span>
            </div>
          )}
          
          {/* Free Badge */}
          {isFree && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                FREE
              </span>
            </div>
          )}
        </div>

        {/* Webinar Content */}
        <div className="md:w-3/5 p-6 flex flex-col justify-between min-h-0 max-h-full">
          <div className="flex-grow">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
              {webinar.title}
            </h3>
            
            {/* Instructor */}
            <p className="text-blue-600 font-semibold mb-3 text-base">{webinar.instructor}</p>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {webinar.description}
            </p>
            
            {/* Topics */}
            <div className="flex flex-wrap gap-1 mb-4">
              {webinar.topics && webinar.topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs whitespace-nowrap">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {/* Date and Time */}
            <div className="flex items-center justify-between mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span className="truncate">{webinar.date}</span>
              </div>
              <div className="flex items-center text-gray-600 ml-2">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="truncate">{webinar.time}</span>
              </div>
            </div>
            
            {/* Price Section */}
            <div className="mb-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-800">
                  {isFree ? 'Free' : `₹${webinar.price}`}
                </span>
                {webinar.originalPrice && !isFree && (
                  <span className="text-base text-gray-500 line-through">₹{webinar.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div className="flex items-center text-gray-500 text-xs mb-4">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span className="truncate">{webinar.attendees} registered</span>
            </div>
            
            {/* Join Button */}
            <div className="w-full">
              <Link
                href={webinar.joinLink}
                className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-center block text-sm ${
                  isLive 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLive ? 'Join Live' : 'Register Now'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarCarousel;
