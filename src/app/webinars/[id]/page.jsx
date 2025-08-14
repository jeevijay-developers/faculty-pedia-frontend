"use client";
import React, { useEffect, useState } from "react";
import WebinarDetails from "@/components/Details/WebinarDetails";
import AOS from "aos";
import "aos/dist/aos.css";
import sampleWebinars from "@/Data/Details/webinars.data";
import Banner from "@/components/Common/Banner";

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

    // Simulate API call with the sample data
    const fetchWebinar = () => {
      try {
        // console.log("Fetching webinar details for ID:", id);

        // const found = sampleWebinars.find((w) => w.id === id);
        const found = sampleWebinars.find((w) => w.id == id);

        if (!found) {
          setError("Webinar not found");
        } else {
          setWebinar(found);
        }
      } catch (err) {
        setError("Error loading webinar");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebinar();
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <div className="max-w-7xl mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">
              Loading webinar details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Banner
          url={"/images/placeholders/1.svg"}
          title={"Welcome to Our Webinars"}
          subtitle={
            "Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
          }
        />
        <div className="max-w-7xl mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
            <p className="text-gray-600 mb-6">
              The webinar you're looking for could not be found or there was an
              error loading it.
            </p>
            <a
              href="/webinars"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Webinars
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <WebinarDetails webinar={webinar} />;
}
