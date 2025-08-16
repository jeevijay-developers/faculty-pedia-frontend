import React from "react";
import Banner from "@/components/Common/Banner";
import ExamDetails from "@/components/Details/ExamDetails";
import liveTestSeriesExample from "@/Data/Details/testSeries.data";
// import sampleExam from "@/Data/Details/testSeries.data";

const Page = async ({ params }) => {
  const { id } = params;
  return (
    <div>
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Test Series Details"}
        subtitle={
          "Comprehensive mock tests designed to enhance your preparation and knowledge."
        }
      />
      <ExamDetails examData={liveTestSeriesExample} />
    </div>
  );
};

export default Page;
