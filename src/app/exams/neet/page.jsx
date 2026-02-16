"use client";

import { useEffect, useState } from "react";
import OneToOneLiveClassesCarousel from "@/components/OneToOne/OneToOneLiveClassesCarousel";
import Banner from "@/components/Common/Banner";
import CourseCarousel from "@/components/Courses/CourseCarousal";
import EducatorsCarousel from "@/components/Educator/EducatorsCarousel";
import OneToOnePPHCarousel from "@/components/OneToOne/OneToOnePPHCarousel";
import PostCarousel from "@/components/Posts/PostsCarousal";
import UpcomingWebinarCarousel from "@/components/Webinars/UpcomingWebinarCarousel";
import TestSeriesCarousel from "@/components/Exams/IIT-JEE/TestSeriesCarousel";
import ExamLoader from "@/components/others/examLoader";

const NeetPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <ExamLoader />;

  return (
    <>
      <Banner
        url="/images/Banner/NEET 1.jpg"
        title="NEET"
        subtitle="Excel in your NEET preparation with specialized medical curriculum, expert coaching, and comprehensive study resources designed for future medical professionals."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />
      <EducatorsCarousel specialization="NEET" />
      <CourseCarousel
        title="One to All Live Courses"
        viewMoreLink="/courses"
        specialization="NEET"
        courseType="one-to-all"
        bgColor="bg-gray-50"
      />
      <CourseCarousel
        title="One to One Live Courses"
        viewMoreLink="/courses"
        specialization="NEET"
        courseType="one-to-one"
        bgColor="bg-white"
      />
      {/* <OneToOneLiveClassesCarousel specialization="NEET" /> */}
      <OneToOnePPHCarousel specialization="NEET" />
      <UpcomingWebinarCarousel specialization="NEET" />
      <TestSeriesCarousel specialization="NEET" />
      <PostCarousel subject="NEET" />
    </>
  );
};

export default NeetPage;