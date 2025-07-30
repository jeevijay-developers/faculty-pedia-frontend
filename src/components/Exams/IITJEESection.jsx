'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiUser, FiClock } from 'react-icons/fi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const IITJEESection = () => {
  const [swiperRef, setSwiperRef] = useState(null);
  
  // Sample exam data - in a real app, this would likely come from props or an API
  const examData = [
    {
      id: 1,
      title: "Organic Chemistry Mastery",
      instructor: "Meera Sharma",
      price: "7999",
      originalPrice: "9999",
      image: "/images/placeholders/1.svg",
      enrollLink: "/exams/organic-chemistry",
      detailsLink: "/exams/organic-chemistry/details",
      duration: "3 months",
      startDate: "Aug 15, 2025"
    },
    {
      id: 2,
      title: "Advanced Physics for JEE",
      instructor: "Dr. Rajesh Kumar",
      price: "8499",
      originalPrice: "10999",
      image: "/images/placeholders/1.svg",
      enrollLink: "/exams/advanced-physics",
      detailsLink: "/exams/advanced-physics/details",
      duration: "4 months",
      startDate: "Sep 1, 2025"
    },
    {
      id: 3,
      title: "JEE Mathematics Foundation",
      instructor: "Prof. Anita Singh",
      price: "6999",
      originalPrice: "8599",
      image: "/images/placeholders/1.svg",
      enrollLink: "/exams/mathematics-foundation",
      detailsLink: "/exams/mathematics-foundation/details",
      duration: "3.5 months",
      startDate: "Aug 20, 2025"
    },
    {
      id: 4,
      title: "Physical Chemistry Crash Course",
      instructor: "Dr. Vikram Patel",
      price: "5999",
      originalPrice: "7499",
      image: "/images/placeholders/1.svg",
      enrollLink: "/exams/physical-chemistry",
      detailsLink: "/exams/physical-chemistry/details",
      duration: "2 months",
      startDate: "Sep 10, 2025"
    },
    {
      id: 5,
      title: "Inorganic Chemistry Complete Guide",
      instructor: "Dr. Priya Mehta",
      price: "7499",
      originalPrice: "8999",
      image: "/images/placeholders/1.svg",
      enrollLink: "/exams/inorganic-chemistry",
      detailsLink: "/exams/inorganic-chemistry/details",
      duration: "3 months",
      startDate: "Aug 25, 2025"
    }
  ];

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">IIT JEE Exams</h2>
          <Link 
            href="/exams/iit-jee"
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            aria-label="Previous slide"
          >
            <svg 
              className="w-5 h-5 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            aria-label="Next slide"
          >
            <svg 
              className="w-5 h-5 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={setSwiperRef}
            spaceBetween={24}
            slidesPerView={1}
            loop={examData.length > 4}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3
            }}
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
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            {examData.map((exam) => (
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
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
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
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
        <div className="space-y-2">
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

export default IITJEESection;
