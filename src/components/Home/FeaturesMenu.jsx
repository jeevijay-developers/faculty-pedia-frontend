"use client";
import React from "react";
import Image from "next/image";

const FeaturesMenu = () => {
  return (
    <section className="my-20 px-4">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Why Choose Faculty Pedia
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive learning features designed to help you excel
          in your academic journey
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-md text-blue-600">
              <Image
                src={"/features/live-classes.png"}
                width={40}
                height={40}
                alt="Live Classes"
              />
            </span>
            <div className="text-lg mt-2">Online Classes</div>
            <p className="text-sm font-normal mt-2 opacity-90">
              Attend interactive classes from anywhere, anytime
            </p>
          </div>
        </div>

        <div className="group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-md text-blue-600">
              <Image
                src={"/features/1-1-live.png"}
                width={40}
                height={40}
                alt="1-on-1 Live Classes"
              />
            </span>
            <div className="text-lg mt-2">1-on-1 Live Classes</div>
            <p className="text-sm font-normal mt-2 opacity-90">
              Personalized sessions for focused learning
            </p>
          </div>
        </div>

        <div className="group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-md text-blue-600">
              <Image
                src={"/features/webinars.png"}
                width={40}
                height={40}
                alt="Webinars"
              />
            </span>
            <div className="text-lg mt-2">Webinars</div>
            <p className="text-sm font-normal mt-2 opacity-90">
              Live expert discussions and sessions
            </p>
          </div>
        </div>

        <div className="group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-md text-blue-600">
              <Image
                src={"/features/study-material.png"}
                width={40}
                height={40}
                alt="Study Material"
              />
            </span>
            <div className="text-lg mt-2">Study Material</div>
            <p className="text-sm font-normal mt-2 opacity-90">
              High-quality notes, PDFs, and resources
            </p>
          </div>
        </div>

        <div className="group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-md text-blue-600">
              <Image
                src={"/features/live-test.png"}
                width={40}
                height={40}
                alt="Live Tests"
              />
            </span>
            <div className="text-lg mt-2">Online Tests</div>
            <p className="text-sm font-normal mt-2 opacity-90">
              Evaluate yourself with real-time tests and analytics
            </p>
          </div>
        </div>

        <div className="group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-md text-blue-600">
              <Image
                src={"/features/CBSE.png"}
                width={40}
                height={40}
                alt="CBSE Content"
              />
            </span>
            <div className="text-lg mt-2">CBSE Content</div>
            <p className="text-sm font-normal mt-2 opacity-90">
              Comprehensive resources and materials for CBSE students
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturesMenu;
