import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUsers, FaRupeeSign, FaBook } from "react-icons/fa";
import { getApiUrl } from "@/utils/environment";

const resolveImageUrl = (image) => {
  const rawImage =
    (typeof image === "string" && image.trim() && image.trim()) ||
    (typeof image?.url === "string" && image.url.trim() && image.url.trim()) ||
    (typeof image?.secure_url === "string" &&
      image.secure_url.trim() &&
      image.secure_url.trim()) ||
    "";

  if (!rawImage) return "https://placehold.co/600x400";

  if (/^https?:\/\//i.test(rawImage)) return rawImage;

  const apiUrl = getApiUrl().replace(/\/$/, "");
  const normalizedPath = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
  return `${apiUrl}${normalizedPath}`;
};

const WebinarCard = ({ webinar }) => {
  const webinarId = webinar._id || webinar.id;
  const imageUrl = resolveImageUrl(webinar.image);
  const normalizedSubject = Array.isArray(webinar.subject)
    ? webinar.subject.find((item) => typeof item === "string" && item.trim())
    : webinar.subject;
  const subject =
    typeof normalizedSubject === "string" && normalizedSubject.trim()
      ? normalizedSubject.trim()
      : "general";
  const title = webinar.title || "Untitled Webinar";
  const description = webinar.description?.short || "No description available";

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      data-aos="fade-up"
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          unoptimized
          className="object-cover"
        />
        {/* Subject badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
            <FaBook className="w-3 h-3 mr-1" />
            {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaClock className="w-4 h-4 text-blue-500 mr-2" />
            <span>{webinar.duration || 0} minutes</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaUsers className="w-4 h-4 text-blue-500 mr-2" />
            <span>{webinar.seatLimit || 0} seats</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaRupeeSign className="w-4 h-4 text-blue-500 mr-2" />
            <span>₹{webinar.fees || 0}</span>
          </div>
        </div>

        <Link
          href={`/webinars/${webinarId}`}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <span className="mr-2">View Details</span>
        </Link>
      </div>
    </div>
  );
};

export default WebinarCard;
