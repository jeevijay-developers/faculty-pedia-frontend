import React from "react";
import Banner from "@/components/Common/Banner";
import TestSeriesDetails from "@/components/TestSeries/TestSeriesDetails";
import testSeriesDetails from "@/Data/TestSeries/testSeriesDetails";

const Page = async ({ params }) => {
  const { id } = params;
  
  return (
    <div>
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Test Series Details"}
        subtitle={
          "Comprehensive test series designed to evaluate and enhance your preparation with expert-crafted questions."
        }
      />
      <TestSeriesDetails testSeriesData={testSeriesDetails} />
    </div>
  );
};

export default Page;
