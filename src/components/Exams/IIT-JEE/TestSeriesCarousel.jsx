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
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchTestSeriesBySpecialization } from "@/components/server/exams/iit-jee/routes";
import Loading from "@/components/Common/Loading";
import CarouselFallback from "@/components/Common/CarouselFallback";

const TestSeriesCarousel = ({
  title = "Online Test Series",
  specialization = "IIT-JEE", // IIT-JEE | NEET | CBSE
  viewMoreLink = "/test-series",
  autoplay = true,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [testsToRender, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestSeries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchTestSeriesBySpecialization(specialization);

        // Extract test series from response and keep only independent ones
        const testSeriesData = (response?.testSeries || []).filter((ts) => {
          // Exclude anything linked to a course or marked course specific
          const hasCourse = Boolean(ts?.courseId);
          const isCourseSpecific = Boolean(ts?.isCourseSpecific);
          return !hasCourse && !isCourseSpecific;
        });

        setData(testSeriesData);
      } catch (error) {
        console.error("Failed to fetch test series:", error);
        setError(error.message || "Failed to load test series");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchTestSeries();
    }
  }, [specialization]);

  if (loading) {
    return (
      <Loading
        variant="skeleton"
        message="Loading test series"
        count={6}
      />
    );
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CarouselFallback
        type="test-series"
        specialization={specialization}
        title={title}
        viewMoreLink={viewMoreLink}
        message={error}
      />
    );
  }

  // Show fallback if no test series found
  if (!testsToRender || testsToRender.length === 0) {
    return (
      <CarouselFallback
        type="test-series"
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
    <section className="py-16 bg-white">
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
  // Format validity date
  const validityDate = testSeries.validity
    ? new Date(testSeries.validity).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const testsCount = (() => {
    if (Array.isArray(testSeries.tests) && testSeries.tests.length > 0) {
      return testSeries.tests.length;
    }
    if (
      Array.isArray(testSeries.liveTests) &&
      testSeries.liveTests.length > 0
    ) {
      return testSeries.liveTests.length;
    }
    if (typeof testSeries.numberOfTests === "number")
      return testSeries.numberOfTests;
    if (typeof testSeries.noOfTests === "number") return testSeries.noOfTests;
    return 0;
  })();

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
      <div className="relative mb-4 h-40 overflow-hidden rounded-xl bg-white">
        <Image
          src={testSeries.image || "/images/placeholders/1.svg"}
          alt={testSeries.title || "Test Series"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {testSeries.specialization?.[0] || "General"}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">
          {testSeries.title}
        </h3>
        <h4 className="mb-3 text-base font-semibold text-blue-600">
          {testSeries.educatorId?.fullName || testSeries.educatorName || "Educator"}
        </h4>

        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-gray-700">Subject: </span>
            <span className="text-gray-800">
              {Array.isArray(testSeries.subject)
                ? testSeries.subject.join(", ")
                : testSeries.subject}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Number of Tests: </span>
            <span className="text-gray-800">{testsCount}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Valid Until: </span>
            <span className="text-gray-800">{validityDate}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 text-2xl font-bold text-blue-700">
            ₹{testSeries.price?.toLocaleString("en-IN") || 0}
          </div>
          <Link
            href={`/test-series/${testSeries._id || testSeries.id}`}
            className="block w-full rounded-full bg-blue-600 py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesCarousel;
