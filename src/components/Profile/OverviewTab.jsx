"use client";

import React from "react";
import Link from "next/link";
import { FiBookOpen, FiTarget, FiUsers, FiAward } from "react-icons/fi";
import StatCard from "./StatCard";

const OverviewTab = ({
  totalCourses,
  totalResults,
  followingEducatorsLength,
  tests,
  getSeries,
  getSeriesId,
  onTabChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiBookOpen}
          title="Enrolled Courses"
          value={totalCourses}
          bgColor="bg-blue-50"
          borderColor="border-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={FiTarget}
          title="Tests Taken"
          value={totalResults}
          bgColor="bg-green-50"
          borderColor="border-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={FiUsers}
          title="Following"
          value={followingEducatorsLength}
          bgColor="bg-purple-50"
          borderColor="border-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Tests
            </h3>
            {tests.length > 5 && (
              <button
                onClick={() => onTabChange("results")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {tests.length > 0 ? (
            <div className="space-y-4">
              {tests.slice(0, 5).map((test, index) => {
                const seriesId = getSeriesId(test);
                const series = getSeries(seriesId);

                return (
                  <div
                    key={test._id || index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                        <FiAward className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        {(() => {
                          const title =
                            series?.title ||
                            `Test Series #${seriesId || "N/A"}`;
                          const slug = series?.slug;
                          return slug ? (
                            <Link
                              href={`/live-test/series/${slug}`}
                              className="text-sm font-semibold text-blue-600 hover:underline"
                              title={title}
                            >
                              {title}
                            </Link>
                          ) : (
                            <p
                              className="text-sm font-semibold text-gray-900"
                              title={title}
                            >
                              {title}
                            </p>
                          );
                        })()}
                        {series && (
                          <div className="mt-1 flex items-center gap-2">
                            {series.subject && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-medium uppercase tracking-wide">
                                {series.subject}
                              </span>
                            )}
                            {series.specialization && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium uppercase tracking-wide">
                                {series.specialization}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {series?.noOfTests
                          ? `${series.noOfTests} Tests`
                          : "Test Series"}
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        {series?.price && (
                          <span className="text-green-600 font-medium">
                            ₹{series.price}
                          </span>
                        )}
                        {test.status && (
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                              test.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : test.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {test.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiAward className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No tests enrolled yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Enroll in test series to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
