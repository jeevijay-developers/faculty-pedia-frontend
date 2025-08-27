import React from "react";
import Banner from "@/components/Common/Banner";
import WebinarDetails from "@/components/Webinars/WebinarDetails";
import webinarDetails from "@/Data/Webinar/webinardetails.data";

const Page = async ({ params }) => {
  const { id } = params;

  return (
    <div>
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Webinar Details"}
        subtitle={
          "Join our expert-led webinars to enhance your knowledge and skills with interactive learning experiences."
        }
      />
      <WebinarDetails webinarData={webinarDetails} />
    </div>
  );
};

export default Page;
