import Banner from "@/components/Common/Banner";
import CourseCarousel from "@/components/Courses/CourseCarousal";
import EducatorsCarousel from "@/components/Educator/EducatorsCarousel";
import PostCarousel from "@/components/Posts/PostsCarousal";
import React from "react";
import OneToOneLiveClassesCarousel from "@/components/OneToOne/OneToOneLiveClassesCarousel";
import OneToOnePPHCarousel from "@/components/OneToOne/OneToOnePPHCarousel";
import UpcomingWebinarCarousel from "@/components/Webinars/UpcomingWebinarCarousel";
import TestSeriesCarousel from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
// import { fetchIITJEEEducators } from "@/components/server/exams/iit-jee/routes";

const page = async () => {
  return (
    <>
      <Banner
        url="/images/Banner/iit-jee.png"
        title="IIT JEE"
        subtitle="Unlock your potential with expert IIT JEE preparation, curated study material, and personalized guidance from top educators."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />

      <EducatorsCarousel specialization="IIT-JEE" />
      <CourseCarousel
        title="One to All Live Courses"
        viewMoreLink="/courses"
        specialization="IIT-JEE"
        courseType="one-to-all"
        bgColor="bg-gray-50"
      />
      <CourseCarousel
        title="One to One Live Courses"
        viewMoreLink="/courses"
        specialization="IIT-JEE"
        courseType="one-to-one"
        bgColor="bg-white"
      />
      {/* <OneToOneLiveClassesCarousel specialization="IIT-JEE" /> */}
     
      <UpcomingWebinarCarousel specialization="IIT-JEE" />
      <TestSeriesCarousel specialization="IIT-JEE" />
      <PostCarousel subject="IIT-JEE" />
    </>
  );
};

export default page;
