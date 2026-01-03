"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { fetchPPHEducatorsBySpecialization } from "../server/exams/iit-jee/routes";

import "swiper/css";
import "swiper/css/navigation";
import OneToOnePPHCard from "./OneToOnePPHCard";
import CarouselFallback from "../Common/CarouselFallback";
import Loading from "../Common/Loading";

/**
 * Props:
 * - title?: string
 * - specialization?: 'IIT-JEE' | 'NEET' | 'CBSE'
 * - viewMoreLink?: string
 */
const OneToOnePPHCarousel = ({
  title = "1-1 Live Pay Per Hour",
  specialization = "IIT-JEE",
  viewMoreLink = "/one-to-one-pph",
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPPHEducators = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPPHEducatorsBySpecialization(
          specialization
        );

        // Extract educators from response
        const educators = response?.educators || [];

        // Transform educator data to match card component expectations
        const transformedData = educators.map((educator) => ({
          id: educator._id,
          _id: educator._id,
          title: `1-1 Session with ${educator.fullName}`,
          educatorName: educator.fullName,
          postImage: educator.profilePicture || educator.image?.url || "",
          qualification: educator.qualifications || "Not specified",
          subject: Array.isArray(educator.subject)
            ? educator.subject.join(", ")
            : educator.subject,
          specialization: Array.isArray(educator.specialization)
            ? educator.specialization.join(", ")
            : educator.specialization,
          fee: educator.payPerHourFee || 0,
          ...educator,
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Failed to fetch PPH educators:", error);
        setError(error.message || "Failed to load PPH educators");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchPPHEducators();
    }
  }, [specialization]);

  const prevSlide = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  if (loading) {
    return <Loading />;
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CarouselFallback
        type="pph"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        actionText="Explore PPH Classes"
        message={error}
      />
    );
  }

  // Show fallback if no PPH educators found
  if (!data || data.length === 0) {
    return (
      <CarouselFallback
        type="pph"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        actionText="Explore PPH Classes"
      />
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 truncate">
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

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={data.length > 1}
            className="one-to-one-carousel"
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {data.map((item) => {
              const detailsHref = `/educators/${item._id || item.id}`;
              return (
                <SwiperSlide key={item._id || item.id}>
                  <OneToOnePPHCard item={item} detailsHref={detailsHref} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default OneToOnePPHCarousel;
