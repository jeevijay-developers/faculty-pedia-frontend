"use client";
import Banner from "@/components/Common/Banner";
import React from "react";
import dynamic from "next/dynamic";
import EducatorsCarousel from "@/components/Educator/EducatorsCarousel";
import CourseCarousel from "@/components/Courses/CourseCarousal";
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
        url="/images/Banner/cbse.png"
        title="CBSE"
        subtitle="Prepare for your CBSE exams with comprehensive study materials, expert guidance, and personalized coaching."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />
      <EducatorsCarousel specialization="CBSE" />

      <CBSEPageContent />

      <CourseCarousel
        title="One to All Live Courses"
        viewMoreLink="/courses"
        specialization="CBSE"
        courseType="one-to-all"
        bgColor="bg-gray-50"
      />
      <CourseCarousel
        title="One to One Live Courses"
        viewMoreLink="/courses"
        specialization="CBSE"
        courseType="one-to-one"
        bgColor="bg-white"
      />     

      <UpcomingWebinarCarousel specialization="CBSE" />
      <TestSeriesCarousel specialization="CBSE" />
      <PostCarousel subject="CBSE" />
    </>
  );
};

export default page;
