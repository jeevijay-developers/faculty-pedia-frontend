"use client";
import React, { useEffect, useState } from "react";
import TestSeriesDetails from "@/components/TestSeries/TestSeriesDetails";
import TestSeriesLoader from "@/components/others/testSeriesLoader";
import AOS from "aos";
import "aos/dist/aos.css";
import { fetchTestSeriesById } from "@/components/server/exams/iit-jee/routes";
import Banner from "@/components/Common/Banner";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const TestSeriesDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [testSeries, setTestSeries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Fetch test series details
  const fetchTestSeriesDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchTestSeriesById(id);

      // Handle different response structures
      const testSeriesData = response.testSeries || response.data || response;

      if (!testSeriesData) {
        throw new Error("Test series not found");
      }

      setTestSeries(testSeriesData);
    } catch (err) {
      console.error("Error fetching test series:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load test series details";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTestSeriesDetails();
    }
  }, [id]);

  // Retry function
  const handleRetry = () => {
    fetchTestSeriesDetails();
  };

  // Loading state
  if (isLoading) {
    return <TestSeriesLoader />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Test Series Details"}
          subtitle={"Unable to load test series information"}
        />
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Failed to Load Test Series
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <Link
                href="/test-series"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Back to Test Series
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No test series data
  if (!testSeries) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Test Series Details"}
          subtitle={"Test series not found"}
        />
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-6">📚</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Test Series Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              The test series you're looking for doesn't exist or has been
              removed.
            </p>
            <Link
              href="/test-series"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Test Series
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Hero Section optimized for 1200x400 banner */}
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative mx-auto w-full max-w-[1200px] aspect-[3/1] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-900">
          <Image
            src={testSeries.image || "/images/placeholders/1.svg"}
            alt={testSeries.title || "Test Series"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/15 flex flex-col items-center justify-end pb-5 sm:pb-8 md:pb-10 px-4 sm:px-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-4xl tracking-wide leading-tight drop-shadow-md" data-aos="fade-up">
              {testSeries.title || "Test Series"}
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-100 max-w-2xl leading-relaxed font-medium" data-aos="fade-up" data-aos-delay="100">
              Master your preparation with {testSeries.numberOfTests || testSeries.noOfTests || 0} comprehensive tests
            </p>
          </div>
        </div>
      </div>
      <TestSeriesDetails testSeriesData={testSeries} />
    </div>
  );
};

export default TestSeriesDetailPage;
