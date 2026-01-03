"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import "swiper/css";
import "swiper/css/navigation";
import OneToOneLiveClassesCard from "./OneToOneLiveClassesCard";
import Loading from "../Common/Loading";
import { fetchLiveClassesBySpecialization } from "../server/exams/iit-jee/routes";
import CarouselFallback from "../Common/CarouselFallback";

const OneToOneLiveClassesCarousel = ({
  title = "1-1 Live Classes",
  viewMoreLink = "/1-1-live-class",
  specialization = "IIT-JEE", // Default to IIT-JEE
  autoplay = true,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [classesToRender, setClassesToRender] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  useEffect(() => {
    const fetchLiveClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchLiveClassesBySpecialization(specialization);

        // Handle different response structures
        let liveClasses = [];

        // Backend returns: { success: true, data: { liveClasses: [...] } }
        if (
          response?.data?.data?.liveClasses &&
          Array.isArray(response.data.data.liveClasses)
        ) {
          liveClasses = response.data.data.liveClasses;
        } else if (
          response?.data?.liveClasses &&
          Array.isArray(response.data.liveClasses)
        ) {
          liveClasses = response.data.liveClasses;
        } else if (
          response?.liveClasses &&
          Array.isArray(response.liveClasses)
        ) {
          liveClasses = response.liveClasses;
        } else if (Array.isArray(response?.data)) {
          liveClasses = response.data;
        } else if (Array.isArray(response)) {
          liveClasses = response;
        }

        setClassesToRender(liveClasses);
      } catch (error) {
        console.error("Failed to fetch live classes:", error);
        setError(error.message || "Failed to load live classes");
        setClassesToRender([]);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchLiveClasses();
    }
  }, [specialization]);

  if (loading) {
    return <Loading />;
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CarouselFallback
        type="live-classes"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        actionText="Explore Live Classes"
        message={error}
      />
    );
  }

  // Show fallback if no classes found
  if (!classesToRender || classesToRender.length === 0) {
    return (
      <CarouselFallback
        type="live-classes"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        actionText="Explore Live Classes"
      />
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {title}
          </h2>
          <Link
            href={viewMoreLink}
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {classesToRender.length > 1 && (
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
            spaceBetween={16}
            slidesPerView={1}
            autoplay={
              autoplay && classesToRender.length > 1
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            loop={classesToRender.length > 1}
            className="one-to-one-carousel"
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {classesToRender.map((classData) => (
              <SwiperSlide key={classData._id || classData.id}>
                <OneToOneLiveClassesCard classData={classData} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default OneToOneLiveClassesCarousel;
