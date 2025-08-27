import CourseDetails from "@/components/Details/CourseDetails";
import React from "react";
import sampleCourse from "@/Data/Details/livecourse.data";
import Banner from "@/components/Common/Banner";

const Page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <Banner
        url={"/images/placeholders/1.svg"}
        title={"Welcome to Our Courses"}
        subtitle={
          "Explore a variety of Courses designed to help you learn and grow with expert faculty guidance."
        }
      />
      <CourseDetails course={sampleCourse} />
    </div>
  );
};

export default Page;
