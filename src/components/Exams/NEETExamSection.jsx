"use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { fetchIITJEEOnlineCourses } from '@/components/server/exams/iit-jee/routes';
import CourseCard from '@/components/Courses/CourseCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const NEETExamSection = () => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchIITJEEOnlineCourses('NEET', {
          limit: 12,
          sortBy: 'startDate',
          sortOrder: 'asc',
          status: 'ongoing',
        });
        const list = data?.courses || data?.data?.courses || [];
        if (isMounted) setCourses(list);
      } catch (err) {
        console.error('Failed to load NEET courses', err);
        if (isMounted) {
          setError('Unable to load NEET courses right now.');
          setCourses([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);
  
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
          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading courses...</div>
          ) : error ? (
            <div className="py-16 text-center text-red-500">{error}</div>
          ) : courses.length === 0 ? (
            <div className="py-16 text-center text-gray-500">No NEET courses available right now.</div>
          ) : (
            <Swiper
              modules={[Navigation]}
              onSwiper={setSwiperRef}
              spaceBetween={24}
              slidesPerView={1}
              loop={courses.length > 3}
              className="neet-exam-carousel pb-12"
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
              {courses.map((course) => (
                <SwiperSlide key={course._id}>
                  <CourseCard
                    course={{
                      ...course,
                      totalWeeks: course.classDuration,
                      educatorName:
                        course?.educatorID?.fullName ||
                        course?.educatorName ||
                        course?.educator,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default NEETExamSection;
