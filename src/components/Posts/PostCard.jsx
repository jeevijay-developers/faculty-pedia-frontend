"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";

const PostCard = ({ post, activeSpecialization }) => {
  // Map backend fields to frontend
  const title = post?.title || "Untitled Post";
  const description = post?.description || "No description available.";

  const specializationsArray = Array.isArray(post?.specializations)
    ? post.specializations.filter(Boolean)
    : post?.specialization
    ? [post.specialization]
    : [];

  const normalizedActive = activeSpecialization
    ? activeSpecialization.toUpperCase()
    : null;

  const category = normalizedActive
    ? specializationsArray.find(
        (spec) => spec?.toUpperCase() === normalizedActive
      ) ||
      specializationsArray[0] ||
      "General"
    : specializationsArray[0] || "General";

  const publishDate = post?.createdAt || new Date().toISOString();
  const educator = post?.educatorId || {};
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const normalizedCategory = category?.toUpperCase();

    switch (normalizedCategory) {
      case "NEET":
        return "bg-green-100 text-green-800";
      case "IIT-JEE":
        return "bg-blue-100 text-blue-800";
      case "CBSE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleOpenModal = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fullContent =
    post?.content ||
    post?.fullDescription ||
    post?.longDescription ||
    description;
  const coverImage =
    post?.coverImage?.url ||
    post?.featuredImage?.url ||
    post?.image?.url ||
    null;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] h-full overflow-hidden">
      {/* Content */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors line">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <FaRegCalendarAlt className="h-4 w-4" />
              <span>{formatDate(publishDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  category
                )}`}
              >
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={
                  educator?.profilePicture ||
                  educator?.image?.url ||
                  "/images/placeholders/1.svg"
                }
                alt={educator?.fullName || "Educator"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {educator?.fullName || "Educator"}
              </span>
            </div>
          </div>

          {/* Read More Link */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
          >
            <span>Read More</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
          </button>
        </div>
      </div>

      {isMounted && isModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={handleCloseModal}
                aria-hidden="true"
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`${title} details`}
                className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              >
                <div className="flex flex-col max-h-[85vh]">
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Close"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="overflow-y-auto px-6 pb-6 pt-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FaRegCalendarAlt className="h-4 w-4" />
                        <span>{formatDate(publishDate)}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          category
                        )}`}
                      >
                        {category}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {educator?.fullName || "Educator"}
                      </span>
                    </div>

                    {coverImage && (
                      <div className="relative mt-4 h-56 w-full overflow-hidden rounded-lg">
                        <Image
                          src={coverImage}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      {typeof fullContent === "string" ? (
                        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                          {fullContent}
                        </p>
                      ) : null}

                      {Array.isArray(fullContent) && fullContent.length > 0 && (
                        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                          {fullContent.map((paragraph, index) => (
                            <p key={index} className="whitespace-pre-line">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

export default PostCard;
