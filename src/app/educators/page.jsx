"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ourEducatorData } from "@/Data/ourEducatorData";

const getUnique = (arr, key) => [
  ...new Set(arr.map((item) => item[key]).filter(Boolean)),
];

const filterOptions = [
  { label: "Subject", key: "subject" },
  { label: "Live Classes", key: "classType" },
  { label: "Webinars", key: "webinarType" },
  { label: "Exams", key: "exam" },
];

export default function Page() {
  const [filters, setFilters] = useState({});

  // Get unique options for each dropdown
  const dropdownOptions = filterOptions.reduce((acc, opt) => {
    acc[opt.key] = getUnique(ourEducatorData, opt.key);
    return acc;
  }, {});

  // Filter educators based on selected filters
  const filteredEducators = ourEducatorData.filter((ed) =>
    filterOptions.every(
      (opt) => !filters[opt.key] || ed[opt.key] === filters[opt.key]
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-8">
        {filterOptions.map((opt) => (
          <div
            key={opt.key}
            className="relative focus-within:z-10 focus-within:ring-2 focus-within:ring-blue-400 focus-within:shadow-lg focus-within:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <select
              className="appearance-none border rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white pr-10 hover:border-blue-400 transition-all duration-200 cursor-pointer"
              value={filters[opt.key] || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [opt.key]: e.target.value || undefined,
                }))
              }
            >
              <option value="">{opt.label}</option>
              {dropdownOptions[opt.key].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            {/* Custom arrow */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              ▼
            </span>
          </div>
        ))}
      </div>

      <h1 className="text-4xl font-bold mb-8">Our Educators</h1>

      {/* Educator Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEducators.map((ed, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl flex flex-col shadow transition-all min-h-[320px] items-stretch hover:shadow-gray-300 hover:shadow-lg cursor-pointer"
          >
            {/* Top half image */}
            <div className="w-full h-44 md:h-56 lg:h-60 overflow-hidden rounded-t-2xl bg-gray-100">
              <Image
                src={ed.image}
                alt={ed.name}
                width={400}
                height={240}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            {/* Card content */}
            <div className="flex-1 flex flex-col items-start px-6 py-4">
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {ed.name}
              </div>
              <div className="text-sm text-gray-600 mb-2 line-clamp-2 text-ellipsis overflow-hidden min-h-[2.75em]">
                {ed.bio}
              </div>
            <div className="flex gap-2 mb-3">
              <span className="rounded-md text-xs font-medium text-gray-700 text-center bg-gray-200 py-1 px-3">
                {ed.experience}
              </span>
              <span className="rounded-md text-xs font-medium text-gray-700 text-center bg-gray-200 py-1 px-3">
                {ed.subject}
              </span>
              <span className="rounded-md text-xs font-medium text-gray-700 text-center bg-gray-200 py-1 px-3">
                {ed.degree}
              </span>
            </div>
              <button className="w-full bg-blue-600 text-white rounded px-3 py-2 text-xs font-semibold mt-auto hover:bg-blue-700 transition cursor-pointer">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
