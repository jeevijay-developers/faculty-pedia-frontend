"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import UpcomingWebinarCard from "./UpcomingWebinarCard";
import CarouselFallback from "../Common/CarouselFallback";

import "swiper/css";
import "swiper/css/navigation";
import { fetchWebinarsBySpecialization } from "../server/exams/iit-jee/routes";
import Loading from "../Common/Loading";

/**
 * Props:
 * - title?: string
 * - specialization?: 'IIT-JEE' | 'NEET' | 'CBSE'
 * - viewMoreLink?: string
 */
const UpcomingWebinarCarousel = ({
  title = "Upcoming Webinars",
  specialization = "IIT-JEE",
  viewMoreLink = "/webinars",
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebinars = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWebinarsBySpecialization(specialization);

        // Extract webinars from response
        const webinarsData =
          response?.data?.webinars || response?.webinars || [];
        setData(webinarsData);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
        setError(error.message || "Failed to load webinars");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchWebinars();
    }
  }, [specialization]);

  if (loading) {
    return (
      <Loading
        variant="skeleton"
        message="Loading webinars"
        count={6}
      />
    );
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CarouselFallback
        type="webinars"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        message={error}
      />
    );
  }

  // Show fallback if no webinars found
  if (!data || data.length === 0) {
    return (
      <CarouselFallback
        type="webinars"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
      />
    );
  }

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
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
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
            aria-label="Previous slide"
          >
            <MdOutlineKeyboardArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-900" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 lg:translate-x-14 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            aria-label="Next slide"
          >
            <MdOutlineKeyboardArrowRight className="w-5 h-5 text-gray-500 hover:text-gray-900" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={data.length > 3}
            className="webinar-carousel pb-12"
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {data.map((webinar) => (
              <SwiperSlide key={webinar._id}>
                <UpcomingWebinarCard item={webinar} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default UpcomingWebinarCarousel;
