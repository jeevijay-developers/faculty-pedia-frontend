"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import EducatorCard from "./EducatorCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getEducatorsBySpecialization } from "../server/educators.routes";
import Loading from "../Common/Loading";
import CarouselFallback from "../Common/CarouselFallback";

const EducatorsCarousel = ({ specialization = "All" }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [filteredEducators, setFilteredEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  useEffect(() => {
    const fetchEducators = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEducatorsBySpecialization(specialization);
        console.log("📚 Educators API Response:", response);
        
        // Handle different response structures
        let educators = [];
        if (response?.data?.educators && Array.isArray(response.data.educators)) {
          educators = response.data.educators;
        } else if (response?.educators && Array.isArray(response.educators)) {
          educators = response.educators;
        } else if (Array.isArray(response)) {
          educators = response;
        }
        
        console.log(`📚 Found ${educators.length} educators for ${specialization}`);
        setFilteredEducators(educators);
      } catch (error) {
        console.error("Failed to fetch educators:", error);
        setError(error.message || "Failed to load educators");
        setFilteredEducators([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (specialization) {
      fetchEducators();
    }
  }, [specialization]);

  if (loading) {
    return <Loading />;
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CarouselFallback
        type="educators"
        specialization={specialization}
        viewMoreLink="/educators"
        actionText="Browse Educators"
        message={error}
      />
    );
  }

  // Show fallback if no educators found
  if (!filteredEducators || filteredEducators.length === 0) {
    return (
      <CarouselFallback
        type="educators"
        specialization={specialization}
        viewMoreLink="/educators"
        actionText="Browse Educators"
      />
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 truncate">
            {specialization === "All"
              ? "Top Educators"
              : `${specialization} Educators`}
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
            className="educator-swiper my-4"
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
