import React from "react";
import { testSeriesData } from "@/Data/TestSeries/testseries.data";
import ExamDetails from "@/components/Details/ExamDetails";
// import sampleExam from "@/Data/Details/testSeries.data";

const Page = async ({ params }) => {
  const { id } = await params;

  // Convert id to number and find the specific test series by id, fallback to first one if not found
  const numericId = parseInt(id, 10);
  const selectedTestSeries =
    testSeriesData.find((series) => series._id === numericId) ||
    testSeriesData[0];

  return (
    <div>
      <ExamDetails examData={selectedTestSeries} />
    </div>
  );
};

export default Page;
