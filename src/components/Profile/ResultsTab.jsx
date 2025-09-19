"use client";

import React from "react";
import Link from "next/link";
import { FiAward } from "react-icons/fi";
import TestResultRow from "./TestResultRow";

const ResultsTab = ({
  results,
  seriesLoading,
  resultsLoading,
  seriesError,
  resultsError,
  getSeries,
  getResult,
  getResultId,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Test Results</h3>
        <div className="flex items-center gap-4">
          {seriesLoading && (
            <span className="text-xs text-gray-500 animate-pulse">
              Loading series...
            </span>
          )}
          {resultsLoading && (
            <span className="text-xs text-gray-500 animate-pulse">
              Loading results...
            </span>
          )}
        </div>
      </div>
      {(seriesError || resultsError) && (
        <div className="mx-6 mt-4 mb-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-700">
          {seriesError && <div>Series: {seriesError}</div>}
          {resultsError && <div>Results: {resultsError}</div>}
        </div>
      )}
      <div className="overflow-hidden">
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Correct
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Incorrect
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => {
                  const resultId = getResultId(result);
                  const resolvedResult = getResult(resultId);

                  return (
                    <TestResultRow
                      key={index}
                      result={result}
                      index={index}
                      resolvedResult={resolvedResult}
                      getSeries={getSeries}
                      getResultId={getResultId}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiAward className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No test results available
            </h4>
            <p className="text-gray-500 mb-6">
              Take your first test to see detailed results and analytics
            </p>
            <Link
              href="/live-test"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take a Test
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTab;
