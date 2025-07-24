'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ClassesCarousel = ({ 
  title = "Popular Classes", 
  viewMoreLink = "/classes",
  classes = [],
  autoplay = false,
  slidesPerView = 4,
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
  const defaultClasses = [
    {
      id: 1,
      title: "JEE Advanced Physics",
      instructor: "Dr. Vikram Singh",
      batch: "Morning Batch",
      schedule: "Mon, Wed, Fri - 8:00 AM",
      duration: "12 months",
      students: "45",
      maxStudents: "50",
      price: "15999",
      originalPrice: "19999",
      image: "/images/classes/class-1.jpg",
      description: "Intensive physics preparation for JEE Advanced with problem-solving focus.",
      enrollLink: "/classes/jee-physics-advanced",
      profileLink: "/instructors/vikram-singh",
      level: "Advanced",
      subjects: ["Mechanics", "Electrodynamics", "Modern Physics"],
      nextClass: "Tomorrow 8:00 AM",
      progress: 65
    },
    {
      id: 2,
      title: "NEET Biology Foundation",
      instructor: "Dr. Anjali Sharma",
      batch: "Evening Batch",
      schedule: "Tue, Thu, Sat - 6:00 PM",
      duration: "10 months",
      students: "38",
      maxStudents: "45",
      price: "12999",
      originalPrice: "16999",
      image: "/images/classes/class-2.jpg",
      description: "Comprehensive biology foundation for NEET with concept clarity.",
      enrollLink: "/classes/neet-biology-foundation",
      profileLink: "/instructors/anjali-sharma",
      level: "Foundation",
      subjects: ["Botany", "Zoology", "Human Physiology"],
      nextClass: "Today 6:00 PM",
      progress: 40
    },
    {
      id: 3,
      title: "JEE Main Mathematics",
      instructor: "Prof. Rahul Gupta",
      batch: "Afternoon Batch",
      schedule: "Daily - 2:00 PM",
      duration: "8 months",
      students: "42",
      maxStudents: "50",
      price: "13999",
      originalPrice: "17999",
      image: "/images/classes/class-3.jpg",
      description: "Complete mathematics preparation for JEE Main with regular practice.",
      enrollLink: "/classes/jee-math-main",
      profileLink: "/instructors/rahul-gupta",
      level: "Intermediate",
      subjects: ["Algebra", "Calculus", "Coordinate Geometry"],
      nextClass: "Today 2:00 PM",
      progress: 25
    },
    {
      id: 4,
      title: "Chemistry Crash Course",
      instructor: "Dr. Pooja Mehta",
      batch: "Weekend Batch",
      schedule: "Sat, Sun - 10:00 AM",
      duration: "4 months",
      students: "35",
      maxStudents: "40",
      price: "8999",
      originalPrice: "11999",
      image: "/images/classes/class-4.jpg",
      description: "Intensive chemistry revision course for quick preparation.",
      enrollLink: "/classes/chemistry-crash",
      profileLink: "/instructors/pooja-mehta",
      level: "Revision",
      subjects: ["Organic", "Inorganic", "Physical"],
      nextClass: "Saturday 10:00 AM",
      progress: 75
    },
    {
      id: 5,
      title: "Foundation Science Class 11",
      instructor: "Prof. Amit Kumar",
      batch: "Morning Batch",
      schedule: "Daily - 9:00 AM",
      duration: "12 months",
      students: "48",
      maxStudents: "50",
      price: "18999",
      originalPrice: "22999",
      image: "/images/classes/class-5.jpg",
      description: "Complete foundation course for Class 11 science students.",
      enrollLink: "/classes/foundation-class11",
      profileLink: "/instructors/amit-kumar",
      level: "Foundation",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      nextClass: "Tomorrow 9:00 AM",
      progress: 30
    }
  ];

  const classesToRender = classes.length > 0 ? classes : defaultClasses;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Join our structured classroom programs with expert faculty and peer learning environment
          </p>
          <Link 
            href={viewMoreLink}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination, ...(autoplay ? [Autoplay] : [])]}
            onSwiper={setSwiperRef}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
            loop={classesToRender.length > slidesPerView}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="classes-carousel pb-12"
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
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
              },
            }}
          >
            {classesToRender.map((classItem) => (
              <SwiperSlide key={classItem.id}>
                <ClassCard classItem={classItem} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Class Card Component - Compact Vertical Layout
const ClassCard = ({ classItem }) => {
  const progressPercentage = classItem.progress || 0;
  const spotsLeft = classItem.maxStudents - classItem.students;
  const isAlmostFull = spotsLeft <= 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100">
      {/* Class Image with Overlay Info */}
      <div className="relative h-32 bg-gray-200 overflow-hidden">
        <Image
          src={classItem.image}
          alt={classItem.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            <p className="text-xs opacity-80">Class</p>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            classItem.level === 'Advanced' ? 'bg-red-500 text-white' :
            classItem.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
            classItem.level === 'Foundation' ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {classItem.level}
          </span>
        </div>
        
        {/* Seats Left Warning */}
        {isAlmostFull && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              {spotsLeft} spots left
            </span>
          </div>
        )}
      </div>

      {/* Class Content */}
      <div className="p-4">
        {/* Title and Batch */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
            {classItem.title}
          </h3>
          <p className="text-sm text-blue-600 font-medium">{classItem.batch}</p>
        </div>

        {/* Instructor and Schedule */}
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-800">{classItem.instructor}</p>
          <p className="text-xs text-gray-600">{classItem.schedule}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Course Progress</span>
            <span className="text-xs text-gray-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Students Count */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
          <span>{classItem.students}/{classItem.maxStudents} students</span>
          <span>{classItem.duration}</span>
        </div>

        {/* Next Class Info */}
        <div className="bg-blue-50 rounded-lg p-2 mb-3">
          <div className="flex items-center text-xs text-blue-700">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Next class: {classItem.nextClass}</span>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {classItem.subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {subject}
              </span>
            ))}
            {classItem.subjects.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{classItem.subjects.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-800">₹{classItem.price}</span>
              {classItem.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-1">₹{classItem.originalPrice}</span>
              )}
              <p className="text-xs text-gray-600">per month</p>
            </div>
          </div>
          
          <Link
            href={classItem.enrollLink}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 text-center block"
          >
            {spotsLeft <= 3 ? 'Grab Last Spots!' : 'Join Class'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassesCarousel;
