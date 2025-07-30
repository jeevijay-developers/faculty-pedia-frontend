'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { defaultClasses } from '@/Data/data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const ClassesCarousel = ({ 
  title = "Popular Classes", 
  viewMoreLink = "/classes",
  classes = [],
  autoplay = false,
  slidesPerView = 3,
  spaceBetween = 20
}) => {
  const [swiperRef, setSwiperRef] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  // Default classes data if none provided


  const classesToRender = classes.length > 0 ? classes : defaultClasses;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Join our structured classroom programs with expert faculty and peer learning environment
          </p>
          <Link 
            href={viewMoreLink}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
          >
            Explore All Classes
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
            modules={[Navigation, ...(autoplay ? [Autoplay] : [])]}
            onSwiper={setSwiperRef}
            spaceBetween={spaceBetween}
            slidesPerView={1}
            autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
            loop={classesToRender.length > slidesPerView}
            className="classes-carousel pb-12"
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: spaceBetween,
              },
            }}
          >
            {classesToRender.map((classItem, idx) => (
              <SwiperSlide key={classItem.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <ClassCard classItem={classItem} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Class Card Component - Clean and Simple Layout
const ClassCard = ({ classItem }) => {
  const spotsLeft = classItem.maxStudents - classItem.students;
  const isAlmostFull = spotsLeft <= 5;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 h-full">
      {/* Class Image with Overlay Info */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <Image
          src={classItem.image}
          alt={classItem.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback */}
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <div className="text-gray-600 text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <p className="text-sm">Class</p>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            classItem.level === 'Advanced' ? 'bg-red-100 text-red-700' :
            classItem.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
            classItem.level === 'Foundation' ? 'bg-green-100 text-green-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {classItem.level}
          </span>
        </div>
        
        {/* Seats Left Warning */}
        {isAlmostFull && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
              {spotsLeft} spots left
            </span>
          </div>
        )}
      </div>

      {/* Class Content */}
      <div className="p-5 flex flex-col h-full">
        {/* Title and Instructor */}
        <div className="mb-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {classItem.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{classItem.instructor}</p>
          <p className="text-sm text-blue-600 font-medium">{classItem.batch}</p>
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{classItem.schedule}</span>
          </div>
        </div>

        {/* Students and Duration */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <span>{classItem.students}/{classItem.maxStudents} students</span>
          <span>{classItem.duration}</span>
        </div>

        {/* Next Class */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>Next: {classItem.nextClass}</span>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {classItem.subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                {subject}
              </span>
            ))}
            {classItem.subjects.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                +{classItem.subjects.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-gray-900">₹{classItem.price}</span>
              {classItem.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">₹{classItem.originalPrice}</span>
              )}
              <p className="text-xs text-gray-600">per month</p>
            </div>
          </div>
          
          <Link
            href={classItem.enrollLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 text-center block"
          >
            {spotsLeft <= 3 ? 'Grab Last Spots!' : 'Join Class'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassesCarousel;
