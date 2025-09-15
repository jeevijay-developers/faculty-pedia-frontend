"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { getTestsBySpecialization } from "@/Data/Tests/test.data";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchIITJEETestSeries } from "@/components/server/exams/iit-jee/routes";
import Loading from "@/components/Common/Loading";

const TestSeriesCarousel = ({
  title = "Online Test Series",
  specialization = "All", // IIT-JEE | NEET | CBSE | All
  viewMoreLink = "/test-series",
  autoplay = true,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);

  // const testsToRender = getTestsBySpecialization(specialization);

  const [testsToRender, setData] = useState(
    getTestsBySpecialization(specialization)
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchWebinars = async () => {
      setLoading(true);
      try {
        const DATA = await fetchIITJEETestSeries({
          specialization: specialization,
        });
        console.log(specialization, DATA);
        setData([...DATA.testSeries]);
      } catch (error) {
        console.error("Failed to fetch educators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  if (loading) {
    return <Loading />;
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
        {/* Header */}
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-transparent rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
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

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperRef}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={
              autoplay && testsToRender.length > 3
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            loop={testsToRender.length > 3}
            className="test-series-carousel pb-12"
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
            {testsToRender.length > 0 ? (
              testsToRender.map((testSeries) => (
                <SwiperSlide key={testSeries._id}>
                  <TestSeriesCard
                    testSeries={testSeries}
                    specialization={specialization}
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="bg-white rounded-lg border border-gray-200 p-10 text-center w-full">
                  <p className="text-gray-500 text-lg">
                    No test series available for {specialization}
                  </p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Test Series Card Component
export const TestSeriesCard = ({ testSeries }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Educator Photo */}
      <div className="relative h-40 bg-gray-100">
        <Image
          src={
            testSeries.educatorId?.image?.url || "/images/placeholders/1.svg"
          }
          alt={testSeries.educatorId?.firstName || "Educator"}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            {testSeries.specialization}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
          {testSeries.title}
        </h3>
        <h4 className="text-base font-semibold text-blue-600 mb-1">
          {testSeries.educatorName}
        </h4>
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">Qualification: </span>
          <span className="text-sm text-gray-800 font-medium truncate ml-2">
            {testSeries.educatorId?.qualification &&
              testSeries.educatorId.qualification.map((q, i) => {
                return (
                  <span className="text-sm text-gray-800 font-medium truncate ml-2" key={i}>
                    {q.title}
                  </span>
                );
              })}
          </span>
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">Subject: </span>
          {testSeries.subject}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">Number of Tests: </span>
          {testSeries.noOfTests}
        </div>
        <div className="mb-4 text-xl font-bold text-black">
          ₹{testSeries.price}
        </div>

        {/* Action Button */}
        <div className="flex flex-row gap-2">
          <Link
            href={`/test-series/${testSeries._id}`}
            className="w-full text-white border bg-blue-600 border-gray-300 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesCarousel;
