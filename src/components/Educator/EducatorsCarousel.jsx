"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getEducatorsBySpecialization } from "@/Data/Educator/educator-profile.data";
import EducatorCard from "./EducatorCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EducatorsCarousel = ({ specialization = 'All' }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  
  // Filter educators based on specialization prop
  const filteredEducators = getEducatorsBySpecialization(specialization);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 truncate">
            {specialization === 'All' ? 'Top Educators' : `${specialization} Educators`}
          </h2>
          <Link
            href={"/educators"}
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
        </div>

        <div className="relative">
          {/* Navigation Buttons - Only show if we have enough educators */}
          {filteredEducators.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                aria-label="Previous slide"
                style={{ left: "-1rem" }}
              >
                <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                aria-label="Next slide"
                style={{ right: "-1rem" }}
              >
                <RiArrowRightSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>
            </>
          )}

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={filteredEducators.length > 3} // Enable loop only if we have more than 3 educators
            navigation={false} // Disable default navigation to use custom buttons
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="educator-swiper"
          >
            {filteredEducators.map((educator) => (
              <SwiperSlide key={educator.id}>
                <EducatorCard educator={educator} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .educator-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
        }
      `}</style>
    </section>
  );
};

export default EducatorsCarousel;
