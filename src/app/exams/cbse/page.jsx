"use client";
import Banner from "@/components/Common/Banner";
import React from "react";
import dynamic from "next/dynamic";
import EducatorsCarousel from "@/components/Educator/EducatorsCarousel";
import OneToOnePPHCarousel from "@/components/OneToOne/OneToOnePPHCarousel";
import UpcomingWebinarCarousel from "@/components/Webinars/UpcomingWebinarCarousel";
import TestSeriesCarousel from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import PostCarousel from "@/components/Posts/PostsCarousal";

const CBSEPageContent = dynamic(
  () => import("@/components/Exams/CBSE/CBSEPageContent"),
  { ssr: false }
);

const page = () => {
  return (
    <>
      <Banner
        url="/images/placeholders/1.svg"
        title="CBSE"
        subtitle="Prepare for your CBSE exams with comprehensive study materials, expert guidance, and personalized coaching."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />
      <CBSEPageContent />
      <EducatorsCarousel specialization="CBSE" />
      {/* <CourseCarousel
        title="Online Courses for NEET"
        viewMoreLink="/courses"
        specialization="NEET"
      /> */}
      {/* <OneToOneLiveClassesCarousel specialization="NEET" /> */}
      <OneToOnePPHCarousel specialization="CBSET" />
      <UpcomingWebinarCarousel specialization="CBSE" />
      <TestSeriesCarousel specialization="CBSE" />
      <PostCarousel subject="CBSE" />
    </>
  );
};

export default page;
