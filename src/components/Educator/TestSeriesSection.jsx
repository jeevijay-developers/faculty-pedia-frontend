"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaClock, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestSeriesSection = ({ testSeries }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const containerRef = useRef(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    if (testSeries && currentIndex < testSeries.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const renderTestSeries = () => {
    if (!testSeries || testSeries.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No test series available</p>
          <p className="text-gray-400 text-sm mt-1">
            Check back later for new test series
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Navigation Buttons */}
        {testSeries.length > itemsPerView && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-xl'
              }`}
              style={{ transform: 'translateY(-50%) translateX(-50%)' }}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= testSeries.length - itemsPerView}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
                currentIndex >= testSeries.length - itemsPerView
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-xl'
              }`}
              style={{ transform: 'translateY(-50%) translateX(50%)' }}
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(testSeries.length / itemsPerView) * 100}%`
            }}
          >
            {testSeries.map((test, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / testSeries.length}%` }}
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full">
                  <div className="flex flex-col h-full">
                    <div className="relative w-full h-48">
                      <Image
                        src={test.image?.url || "/images/placeholders/square.svg"}
                        alt={test.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{test.price}
                      </div>
                      {/* Enrollment Badge */}
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {test.enrollments} enrolled
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {test.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {test.description?.short || "Comprehensive test series preparation"}
                      </p>

                      {/* Test Details */}
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex items-center text-gray-600 bg-blue-50 p-2 rounded-lg">
                          <FaClock className="w-3 h-3 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1 truncate">{test.duration || "2 hours"}</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-blue-50 p-2 rounded-lg">
                          <FaCalendarAlt className="w-3 h-3 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="font-medium">Start:</span>
                          <span className="ml-1 truncate">{test.startDate || "Available Now"}</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-blue-50 p-2 rounded-lg">
                          <FaUsers className="w-3 h-3 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="font-medium">Students:</span>
                          <span className="ml-1 truncate">{test.enrollments} enrolled</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex flex-col space-y-2">
                        <Link
                          href={`/details/exam/${test.id}`}
                          className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium text-center text-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/details/exam/${test.id}?enroll=true`}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold text-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {testSeries.length > itemsPerView && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(testSeries.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div data-aos="fade-up" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Test Series</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Practice with our comprehensive test series</p>
          </div>
        </div>
        {testSeries && testSeries.length > 0 && (
          <Link
            href="/educators/test-series"
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 font-medium group text-sm w-fit"
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      <div className="px-2 sm:px-4">
        {renderTestSeries()}
      </div>
    </div>
  );
};

export default TestSeriesSection;
