"use client";
import React from "react";
import WebinarCard from "@/components/Webinars/WebinarCard";
import AOS from "aos";
import "aos/dist/aos.css";

// This would come from your API in a real application
import sampleWebinars from "@/Data/Details/webinars.data";
import Banner from "@/components/Common/Banner";

export default function WebinarsPage() {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Welcome to Our Webinars"}
        subtitle={
          "Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
        }
      />
      <div className="max-w-7xl mx-auto p-4">
        <h1
          className="text-3xl font-bold text-gray-900 mb-8"
          data-aos="fade-up"
        >
          Available Webinars
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleWebinars.map((webinar, index) => (
            <WebinarCard key={index} webinar={webinar} />
          ))}
        </div>
      </div>
    </div>
  );
}
