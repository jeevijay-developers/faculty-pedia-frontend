import React from "react";
import Banner from "@/components/Common/Banner";
import TestSeriesDetails from "@/components/TestSeries/TestSeriesDetails";
import { getTestSeriesBySlug, getTestSeriesById } from "@/components/server/test-series.route";

// Cache server-rendered output for 5 minutes, then revalidate in background
export const revalidate = 300;

const Page = async ({ params }) => {
  const { slug } = params;

  // Fetch test series data from backend
  let testSeriesData = null;
  let error = null;

  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    testSeriesData = isObjectId
      ? await getTestSeriesById(slug)
      : await getTestSeriesBySlug(slug);
  } catch (err) {
    console.error("Error fetching test series:", err);
    error = err.message || "Failed to load test series";
  }

  // If there's an error or no data, show error message
  if (error || !testSeriesData) {
    return (
      <div>
        <Banner
          url={"/images/placeholders/card-16x9.svg"}
          title={"Test Series Not Found"}
          subtitle={"The test series you're looking for could not be found."}
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Test Series Not Found"}
          </h2>
          <p className="text-gray-600">
            Please check the URL or go back to browse other test series.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Banner
        url={testSeriesData.image?.url || "/images/placeholders/card-16x9.svg"}
        title={"Test Series Details"}
        subtitle={
          testSeriesData.description?.short || 
          "Comprehensive test series designed to evaluate and enhance your preparation with expert-crafted questions."
        }
      />
      <TestSeriesDetails testSeriesData={testSeriesData} />
    </div>
  );
};

export default Page;
