"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import WebinarDetails from "@/components/Details/WebinarDetails";
import WebinarLoader from "@/components/others/webinarLoader";
import AOS from "aos";
import "aos/dist/aos.css";
import { getWebinarById } from "@/components/server/webinars.routes";
import { queryKeys } from "@/lib/query-keys";
import Banner from "@/components/Common/Banner";
import Link from "next/link";

export default function WebinarDetailsPage({ params }) {
  const id = React.use(params).slug;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const {
    data: webinar = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.webinars.byId(id),
    queryFn: async () => {
      const response = await getWebinarById(id);
      const webinarData = response?.webinar || response?.data || response;
      if (!webinarData) throw new Error("Webinar not found");
      return webinarData;
    },
    enabled: !!id,
  });

  if (isLoading) return <WebinarLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Banner
          url={"/images/placeholders/card-16x9.svg"}
          title={"Webinar Details"}
          subtitle={"Unable to load webinar information"}
        />
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Failed to Load Webinar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {error?.message || "Failed to load webinar details"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Try Again
              </button>
              <Link
                href="/webinars"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
              >
                Back to Webinars
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Banner
          url={"/images/placeholders/card-16x9.svg"}
          title={"Webinar Not Found"}
          subtitle={"The webinar you're looking for doesn't exist"}
        />
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-6">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Webinar Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              The webinar with ID &quot;{id}&quot; could not be found. It may have been
              removed or the link is incorrect.
            </p>
            <Link
              href="/webinars"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Browse All Webinars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <WebinarDetails webinar={webinar} />;
}
