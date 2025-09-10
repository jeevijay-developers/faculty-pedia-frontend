// "use client";
import CourseDetails from "@/components/Details/CourseDetails";
import React from "react";

const Page = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <CourseDetails id={id} />
    </div>
  );
};

export default Page;
