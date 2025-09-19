"use client";

import React from "react";
import Link from "next/link";
import { FiAward } from "react-icons/fi";

const TestResultRow = ({
  result,
  index,
  resolvedResult,
  getSeries,
  getResultId,
}) => {
  const resultId = getResultId(result);
  const currentResult = resolvedResult || result;

  const percentage = currentResult.totalScore
    ? ((currentResult.obtainedScore / currentResult.totalScore) * 100).toFixed(
        1
      )
    : 0;

  const performanceColor =
    percentage >= 80
      ? "text-green-600"
      : percentage >= 60
      ? "text-yellow-600"
      : "text-red-600";

  const performanceBg =
    percentage >= 80
      ? "bg-green-100"
      : percentage >= 60
      ? "bg-yellow-100"
      : "bg-red-100";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <FiAward className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {currentResult.testId?.title ||
                currentResult.testTitle ||
                `Test #${
                  currentResult.testId?._id || currentResult.testId || index + 1
                }`}
            </p>
            {(() => {
              const series = getSeries(currentResult.seriesId);
              const title =
                series?.title ||
                currentResult.seriesId?.title ||
                `Series #${
                  currentResult.seriesId?._id || currentResult.seriesId || "N/A"
                }`;
              const slug = series?.slug || currentResult.seriesId?.slug;
              return slug ? (
                <Link
                  href={`/live-test/series/${slug}`}
                  className="text-xs text-blue-600 hover:underline"
                  title={title}
                >
                  {title}
                </Link>
              ) : (
                <p className="text-xs text-gray-500" title={title}>
                  {title}
                </p>
              );
            })()}
            {(() => {
              const series = getSeries(currentResult.seriesId);
              if (!series) return null;
              return (
                <div className="mt-1 flex flex-wrap gap-1">
                  {series.subject && (
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                      {series.subject}
                    </span>
                  )}
                  {series.specialization && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium">
                      {series.specialization}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">
          {currentResult.obtainedScore || 0}/{currentResult.totalScore || 0}
        </div>
        <div className="text-xs text-gray-500">{percentage}% scored</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {currentResult.totalCorrect || 0}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {currentResult.totalIncorrect || 0}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(
          currentResult.createdAt || currentResult.date || Date.now()
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${performanceBg} ${performanceColor}`}
        >
          {percentage >= 80
            ? "Excellent"
            : percentage >= 60
            ? "Good"
            : "Needs Improvement"}
        </span>
      </td>
    </tr>
  );
};

export default TestResultRow;
