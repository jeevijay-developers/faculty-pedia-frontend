"use client";

import { useRouter } from "next/navigation";
import { BookOpen, TestTube, Calendar, FileQuestion } from "lucide-react";

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const STAT_BTN =
  "bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center gap-1 hover:border-[#231fe5]/30 dark:hover:border-indigo-400/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#231fe5]/50 dark:focus-visible:ring-indigo-400/50";

const StatButton = ({ onClick, iconBg, iconColor, Icon, value, label }) => (
  <button type="button" onClick={onClick} className={STAT_BTN}>
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${iconBg} ${iconColor}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-2xl font-bold text-[#111118] dark:text-gray-100">{value}</p>
    <p className="text-xs text-[#636388] dark:text-gray-400 font-medium uppercase tracking-wide">
      {label}
    </p>
  </button>
);

export function EducatorStatsGrid({
  educatorId,
  isLoadingSummary,
  summaryCounts,
  courseDetails,
  webinarDetails,
  testSeriesDetails,
  postCount,
}) {
  const router = useRouter();
  const loading = "...";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatButton
        onClick={() => router.push(`/courses?educator=${educatorId}`)}
        iconBg="bg-orange-50 dark:bg-orange-900/20"
        iconColor="text-orange-600"
        Icon={BookOpen}
        value={
          isLoadingSummary
            ? loading
            : safeNumber(summaryCounts?.courses ?? courseDetails?.length, 0)
        }
        label="Courses"
      />

      <StatButton
        onClick={() => router.push(`/test-series?educator=${educatorId}`)}
        iconBg="bg-purple-50 dark:bg-purple-900/20"
        iconColor="text-purple-600"
        Icon={TestTube}
        value={
          isLoadingSummary
            ? loading
            : safeNumber(
                summaryCounts?.testSeries ?? testSeriesDetails?.length,
                0,
              )
        }
        label="Test Series"
      />

      <StatButton
        onClick={() => router.push(`/webinars?educator=${educatorId}`)}
        iconBg="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600"
        Icon={Calendar}
        value={
          isLoadingSummary
            ? loading
            : safeNumber(summaryCounts?.webinars ?? webinarDetails?.length, 0)
        }
        label="Webinars"
      />

      <StatButton
        onClick={() => router.push(`/posts?educator=${educatorId}`)}
        iconBg="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600"
        Icon={FileQuestion}
        value={safeNumber(postCount, 0).toLocaleString()}
        label="Posts"
      />
    </div>
  );
}
