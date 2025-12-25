"use client";

import React from "react";
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
  onTabChange,
}) => {
  const normalizedResults = (results || []).map((r) => {
    const testId = r.testId || r.test?._id || r.test || r._id;
    const testTitle = r.testTitle || r.title || r.name;
    const totalScore = r.totalScore ?? r.totalMarks ?? r.total ?? 0;
    const obtainedScore = r.obtainedScore ?? r.obtained ?? r.score ?? 0;
    const totalCorrect = r.totalCorrect ?? r.correct ?? 0;
    const totalIncorrect = r.totalIncorrect ?? r.incorrect ?? 0;
    const percentage = totalScore ? Math.round((obtainedScore / totalScore) * 100) : 0;
    const submittedAt = r.createdAt || r.submittedAt || r.date || null;

    return {
      raw: r,
      testId,
      testTitle,
      totalScore,
      obtainedScore,
      totalCorrect,
      totalIncorrect,
      percentage,
      submittedAt,
    };
  });

  // Deduplicate by testId (fallback to title) keeping the latest attempt
  const dedupedByTest = Array.from(
    normalizedResults.reduce((map, entry) => {
      const key = entry.testId || entry.testTitle || `unknown-${map.size}`;
      const entryTime = entry.submittedAt ? Date.parse(entry.submittedAt) : 0;
      if (!map.has(key)) {
        map.set(key, entry);
        return map;
      }

      const current = map.get(key);
      const currentTime = current.submittedAt ? Date.parse(current.submittedAt) : 0;

      if (entryTime > currentTime) {
        map.set(key, entry);
      }
      return map;
    }, new Map()).values()
  ).sort((a, b) => {
    const tsA = a.submittedAt ? Date.parse(a.submittedAt) : 0;
    const tsB = b.submittedAt ? Date.parse(b.submittedAt) : 0;
    return tsB - tsA;
  });

  const stats = (() => {
    if (!dedupedByTest.length) {
      return {
        attempts: 0,
        avgPercent: 0,
        avgScore: 0,
        bestPercent: 0,
      };
    }

    const attempts = dedupedByTest.length;
    const sumPercent = dedupedByTest.reduce((sum, r) => sum + (r.percentage || 0), 0);
    const sumScore = dedupedByTest.reduce((sum, r) => sum + (r.obtainedScore || 0), 0);
    const bestPercent = Math.max(...dedupedByTest.map((r) => r.percentage || 0));
    return {
      attempts,
      avgPercent: Math.round(sumPercent / attempts),
      avgScore: Math.round(sumScore / attempts),
      bestPercent,
    };
  })();

  const sparkData = dedupedByTest.slice(0, 8);

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

      {dedupedByTest.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Attempts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.attempts}</p>
              <p className="text-xs text-gray-500">Total submissions</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Avg %</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgPercent}%</p>
              <p className="text-xs text-gray-500">Average accuracy</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgScore}</p>
              <p className="text-xs text-gray-500">Per test</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Best %</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.bestPercent}%</p>
              <p className="text-xs text-gray-500">Top performance</p>
            </div>
          </div>

          {/* <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800">Recent performance</p>
              <p className="text-xs text-gray-500">Last {sparkData.length} attempts</p>
            </div>
            <div className="flex items-end gap-2 h-24">
              {sparkData.map((r, idx) => {
                const height = Math.max(8, Math.min(100, r.percentage));
                const dateLabel = r.submittedAt
                  ? new Date(r.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : `#${idx + 1}`;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full">
                    <div
                      className="w-full max-w-[20px] rounded-t-md bg-emerald-500"
                      style={{ height: `${height}%`, minHeight: "8px" }}
                      title={`${r.percentage}% on ${dateLabel}`}
                    />
                    <span className="text-[10px] text-gray-500" title={dateLabel}>
                      {r.percentage}%
                    </span>
                  </div>
                );
              })}
              {sparkData.length === 0 && (
                <div className="text-xs text-gray-500">No attempts yet</div>
              )}
            </div>
          </div> */}
        </div>
      )}
      <div className="overflow-hidden">
        {dedupedByTest.length > 0 ? (
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
                {dedupedByTest.map((entry, index) => {
                  const result = entry.raw;
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
            <button
              type="button"
              onClick={() => onTabChange?.("testseries")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take a Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTab;
