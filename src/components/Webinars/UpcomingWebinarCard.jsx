import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaClock } from "react-icons/fa";
import { MdSchool, MdCalendarToday } from "react-icons/md";
import { fetchEducatorById } from "@/components/server/webinars.routes";

const deriveEducatorName = (webinar) => {
  const educatorObject =
    (webinar?.educatorID && typeof webinar.educatorID === "object"
      ? webinar.educatorID
      : null) ||
    (webinar?.educatorId && typeof webinar.educatorId === "object"
      ? webinar.educatorId
      : null) ||
    (webinar?.educator && typeof webinar.educator === "object"
      ? webinar.educator
      : null) ||
    (webinar?.creator && typeof webinar.creator === "object"
      ? webinar.creator
      : null);

  const candidate =
    [
      webinar?.educatorName,
      webinar?.educatorFullName,
      educatorObject?.fullName,
          educatorObject?.name,
      [educatorObject?.firstName, educatorObject?.lastName]
        .filter(Boolean)
        .join(" "),
      educatorObject?.username,
      webinar?.creatorName,
    ].find((val) => typeof val === "string" && val.trim()) ||
    (typeof webinar?.educatorID === "string" && webinar.educatorID.trim()
      ? webinar.educatorID.trim()
      : null) ||
    (typeof webinar?.educatorId === "string" && webinar.educatorId.trim()
      ? webinar.educatorId.trim()
      : null);

  return candidate || "Educator";
};

const UpcomingWebinarCard = ({ item }) => {
  // Format timing date
  const webinarDate = item.timing
    ? new Date(item.timing).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const webinarTime = item.timing
    ? new Date(item.timing).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const initialEducatorName = deriveEducatorName(item);
  const [educatorName, setEducatorName] = useState(initialEducatorName);

  useEffect(() => {
    const educatorIdString =
      (typeof item?.educatorID === "string" && item.educatorID) ||
      (typeof item?.educatorId === "string" && item.educatorId) ||
      null;

    if (!educatorIdString) return;
    if (educatorName && educatorName !== "Educator") return;

    let isMounted = true;

    const loadEducator = async () => {
      const educator = await fetchEducatorById(educatorIdString);
      if (!educator || !isMounted) return;
      const nameCandidates = [
        educator.fullName,
        [educator.firstName, educator.lastName].filter(Boolean).join(" "),
        educator.username,
      ].filter((val) => typeof val === "string" && val.trim());

      if (nameCandidates.length) {
        setEducatorName(nameCandidates[0]);
      }
    };

    loadEducator();

    return () => {
      isMounted = false;
    };
  }, [item?.educatorID, item?.educatorId, educatorName]);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] h-full overflow-hidden">
      <div className="relative h-40 bg-gray-100 rounded-xl mb-4">
        <Image
          src={item.image || "/images/placeholders/1.svg"}
          alt={item.title || "Webinar"}
          fill
          className="object-cover"
        />
        {item.specialization && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {Array.isArray(item.specialization)
                ? item.specialization[0]
                : item.specialization}
            </span>
          </div>
        )}
        {item.webinarType && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium capitalize">
              {item.webinarType.replace("-", " ")}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
          {item.title || "Webinar Title"}
        </h3>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaUser className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Educator:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium truncate ml-2">
              {educatorName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Duration:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {item.duration ? `${item.duration} hours` : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MdCalendarToday className="mr-2 text-blue-600" />
              <span className="font-medium">Date:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {webinarDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Time:</span>
            </div>
            <span className="text-sm text-gray-800 font-medium">
              {webinarTime}
            </span>
          </div>

          {item.subject && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <MdSchool className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Subject:</span>
              </div>
              <span className="text-sm text-gray-800 font-medium capitalize">
                {Array.isArray(item.subject)
                  ? item.subject.join(", ")
                  : item.subject}
              </span>
            </div>
          )}
        </div>

        {item.seatLimit && (
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Available Seats:</span>
            <span className="text-sm font-medium text-gray-800">
              {item.seatsAvailable ||
                item.seatLimit - (item.enrolledCount || 0)}{" "}
              / {item.seatLimit}
            </span>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-blue-600">
                {item.fees && item.fees > 0 ? `₹${Number(item.fees).toLocaleString("en-IN")}` : "Free"}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/webinars/${item._id || item.id}`}
          className="w-full rounded-full bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default UpcomingWebinarCard;
