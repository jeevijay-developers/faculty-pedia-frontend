"use client";
import React, { useEffect, useState } from "react";
import WebinarDetails from "@/components/Details/WebinarDetails";
import Loading from "@/components/Common/Loading";
import AOS from "aos";
import "aos/dist/aos.css";
import { getWebinarById } from "@/components/server/webinars.routes";
import Banner from "@/components/Common/Banner";
import Link from "next/link";

export default function WebinarDetailsPage({ params }) {
  const id = React.use(params).id;
  const [isLoading, setIsLoading] = useState(true);
  const [webinar, setWebinar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Fetch webinar details
  const fetchWebinarDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getWebinarById(id);

      // Handle different response structures
      const webinarData = response.webinar || response.data || response;

      if (!webinarData) {
        throw new Error("Webinar not found");
      }

      setWebinar(webinarData);
    } catch (err) {
      console.error("Error fetching webinar:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load webinar details";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWebinarDetails();
    }
  }, [id]);

  // Retry function
  const handleRetry = () => {
    fetchWebinarDetails();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Webinar Details"}
          subtitle={"Loading webinar information..."}
        />
        <Loading
          variant="spinner"
          message="Loading webinar details..."
          className="min-h-[400px]"
          spinnerSize={72}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Webinar Details"}
          subtitle={"Unable to load webinar information"}
        />
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Failed to Load Webinar
            </h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Try Again
              </button>
              <Link
                href="/webinars"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
              >
                Back to Webinars
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (!webinar) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Webinar Not Found"}
          subtitle={"The webinar you're looking for doesn't exist"}
        />
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-6">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Webinar Not Found
            </h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              The webinar with ID "{id}" could not be found. It may have been
              removed or the link is incorrect.
            </p>
            <Link
              href="/webinars"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Browse All Webinars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <WebinarDetails webinar={webinar} />;
}
