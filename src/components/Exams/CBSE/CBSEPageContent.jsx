"use client";

import React from "react";
import CourseCarousel from "@/components/Courses/CourseCarousal";

const CBSEPageContent = () => {
  return (
    <CourseCarousel
      title="Courses for CBSE"
      specialization="CBSE"
      viewMoreLink="/courses?specialization=CBSE"
    />
  );
};

export default CBSEPageContent;
