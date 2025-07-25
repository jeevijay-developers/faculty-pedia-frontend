'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { defaultExams } from '@/Data/data';
import { RiArrowLeftSLine, RiArrowRightSLine, RiTimeLine, RiQuestionLine } from "react-icons/ri";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ExamCarousel = ({ 
  title = "Practice DDPs & Mock tests", 
  viewMoreLink = "/exams",
  exams = [],
  autoplay = true,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  const examsToRender = exams.length > 0 ? exams : defaultExams;
  
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
        <div className="relative px-8 lg:px-0">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
            aria-label="Previous slide"
            style={{ left: '-1rem' }}
          >
            <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
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
              delay: 3500, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            } : false}
            loop={examsToRender.length > 1}
            className="exam-carousel"
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
            {examsToRender.map((exam) => (
              <SwiperSlide key={exam.id}>
                <ExamCard exam={exam} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Exam Card Component
const ExamCard = ({ exam }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
      {/* Exam Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden flex-shrink-0">
        <Image
          src={exam.image}
          alt={exam.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback gradient if image fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-black text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
              {/* <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg> */}
            </div>
            <p className="text-xs opacity-80">Test</p>
          </div>
        </div>
        
        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            exam.difficulty === 'Advanced' 
              ? 'bg-red-100 text-red-700' 
              : exam.difficulty === 'Intermediate'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {exam.difficulty}
          </span>
        </div>
      </div>

      {/* Exam Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Exam Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
          {exam.title}
        </h3>
        
        {/* Instructor */}
        <h4 className="text-base font-semibold text-blue-600 mb-3">{exam.instructor}</h4>

        {/* Description */}
        <div className="mb-4 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-2">
            {exam.description}
          </p>
        </div>

        {/* Test Details */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <RiTimeLine className="w-4 h-4" />
              <span>{exam.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <RiQuestionLine className="w-4 h-4" />
              <span>{exam.questions}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-800">₹{exam.price}</span>
            {exam.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{exam.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-auto">
          <Link
            href={exam.testLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            Take Test
          </Link>
          <div className="flex space-x-2">
            <Link
              href={exam.detailLink}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-md text-xs font-medium transition-colors duration-200 text-center"
            >
              View Details
            </Link>
            <Link
              href={exam.profileLink}
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

export default ExamCarousel;
