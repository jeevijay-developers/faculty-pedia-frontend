'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { neetExamData } from '@/Data/exam.data';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const NEETExamSection = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">NEET Exams</h2>
          <Link 
            href="/exams/neet"
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 lg:-translate-x-14 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
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
            loop={neetExamData.length > 4}
            className="exam-carousel pb-12"
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
            {neetExamData.map((exam) => (
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full min-h-[420px] flex flex-col border border-gray-100">
      {/* Exam Banner Image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={exam.image}
          alt={exam.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow h-full">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight text-ellipsis truncate">
          {exam.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center mb-3 text-gray-600">
          <FiUser className="mr-2 text-blue-600" size={16} />
          <p className="text-sm">{exam.instructor}</p>
        </div>

        {/* Duration and Start Date */}
        <div className="flex flex-col space-y-2 mb-4 text-gray-600">
          <div className="flex items-center">
            <FiClock className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">{exam.duration}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-blue-600" size={16} />
            <span className="text-sm">Starts {exam.startDate}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-auto mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">₹{exam.price}</span>
            {exam.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{exam.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2">
          <Link
            href={exam.enrollLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            Enroll Now
          </Link>
          <Link
            href={exam.detailsLink}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NEETExamSection;
