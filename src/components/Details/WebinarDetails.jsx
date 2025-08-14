import React from "react";
import Image from "next/image";
import {
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";
import Banner from "../Common/Banner";

const WebinarDetails = ({ webinar }) => {
  return (
    <div>
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Welcome to Our Webinars"}
        subtitle={
          "Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
        }
      />
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          data-aos="fade-up"
        >
          <div className="relative h-64 w-full">
            <Image
              src={webinar.image.url}
              alt={webinar.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {webinar.title}
            </h1>
            <p className="text-gray-600 mb-6">{webinar.description.longDesc}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p>{new Date(webinar.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaClock className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p>{webinar.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaUsers className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Seats</p>
                  <p>{webinar.seatLimit} available</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FaRupeeSign className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p>₹{webinar.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div
          className="grid md:grid-cols-2 gap-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaBook className="w-5 h-5 mr-2 text-blue-500" />
            Topics Covered
          </h2>
          <ul className="space-y-3">
            {webinar.topics &&
              webinar.topics.map((topic, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2" />
                  <span>{topic}</span>
                </li>
              ))}
          </ul>
        </div> */}

          {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-blue-500" />
            What You'll Learn
          </h2>
          <ul className="space-y-3">
            {webinar.learningOutcomes.map((outcome, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div> */}
        </div>

        {/* Educator Section */}
        {/* <div
        className="bg-white rounded-xl shadow-lg p-6"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaChalkboardTeacher className="w-5 h-5 mr-2 text-blue-500" />
          About the Educator
        </h2>
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden">
            <Image
              src={webinar.educator.image.url}
              alt={webinar.educator.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{webinar.educator.name}</h3>
            <p className="text-gray-600">{webinar.educator.qualification}</p>
            <p className="text-gray-600 mt-2">{webinar.educator.bio}</p>
          </div>
        </div>
      </div> */}

        {/* CTA Buttons */}
        <div
          className=" bottom-6 left-0 right-0 flex justify-center gap-4"
          // style={{ zIndex: 10 }}
        >
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            onClick={() => window.open(webinar.enrollmentLink || "#", "_blank")}
          >
            Enroll Now for ₹{webinar.price}
          </button>
          <button
            className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 font-medium"
            onClick={() => window.open(webinar.webinarLink || "#", "_blank")}
          >
            Attend Webinar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebinarDetails;
