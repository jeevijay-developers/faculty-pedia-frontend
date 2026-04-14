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
  const webinar =
    (item?.data && typeof item.data === "object" ? item.data : null) || item;

  const webinarTiming = webinar?.timing || webinar?.date || webinar?.startDate;

  // Format timing date
  const webinarDate = webinarTiming
    ? new Date(webinarTiming).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const webinarTime = webinarTiming
    ? new Date(webinarTiming).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const resolvedImage =
    (typeof webinar?.image === "string" && webinar.image) ||
    (typeof webinar?.image?.url === "string" && webinar.image.url) ||
    "/images/placeholders/card-16x9.svg";

  const durationValue =
    webinar?.duration || webinar?.totalHours || webinar?.timeRange || null;
  const durationLabel =
    typeof durationValue === "number"
      ? `${durationValue} hours`
      : typeof durationValue === "string" && durationValue.trim()
      ? durationValue
      : "N/A";

  const webinarFees = Number(webinar?.fees ?? webinar?.fee ?? 0);

  const initialEducatorName = deriveEducatorName(webinar);
  const [educatorName, setEducatorName] = useState(initialEducatorName);

  useEffect(() => {
    const educatorIdString =
      (typeof webinar?.educatorID === "string" && webinar.educatorID) ||
      (typeof webinar?.educatorId === "string" && webinar.educatorId) ||
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
  }, [webinar?.educatorID, webinar?.educatorId, educatorName]);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] h-full overflow-hidden">
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
        <Image
          src={resolvedImage}
          alt={webinar?.title || "Webinar"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {webinar?.specialization && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {Array.isArray(webinar.specialization)
                ? webinar.specialization[0]
                : webinar.specialization}
            </span>
          </div>
        )}
        {webinar?.webinarType && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium capitalize">
              {webinar.webinarType.replace("-", " ")}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 leading-tight line-clamp-2">
          {webinar?.title || "Webinar Title"}
        </h3>

        {webinar?.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {typeof webinar.description === "string"
              ? webinar.description
              : webinar.description?.short || ""}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaUser className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Educator:</span>
            </div>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate ml-2">
              {educatorName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Duration:</span>
            </div>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {durationLabel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MdCalendarToday className="mr-2 text-blue-600" />
              <span className="font-medium">Date:</span>
            </div>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {webinarDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaClock className="mr-2 text-blue-600" />
              <span className="font-medium">Time:</span>
            </div>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {webinarTime}
            </span>
          </div>

          {webinar?.subject && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MdSchool className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Subject:</span>
              </div>
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium capitalize">
                {Array.isArray(webinar.subject)
                  ? webinar.subject.join(", ")
                  : webinar.subject}
              </span>
            </div>
          )}
        </div>

        {webinar?.seatLimit && (
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="text-sm text-gray-600 dark:text-gray-400">Available Seats:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {webinar.seatsAvailable ||
                webinar.seatLimit - (webinar.enrolledCount || 0)}{" "}
              / {webinar.seatLimit}
            </span>
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-blue-600">
                {webinarFees > 0 ? `₹${webinarFees.toLocaleString("en-IN")}` : "Free"}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/webinars/${webinar?._id || webinar?.id}`}
          className="w-full rounded-full bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default UpcomingWebinarCard;
