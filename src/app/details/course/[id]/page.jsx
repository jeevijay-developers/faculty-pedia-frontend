import CourseDetails from "@/components/Details/CourseDetails";
import React from "react";
import { defaultCourses } from "@/Data/Courses/courses.data";
import Banner from "@/components/Common/Banner";

const Page = async ({ params }) => {
  const { id } = await params;
  
  // Find the course by ID, fallback to first course if not found
  const course = defaultCourses.find(c => c.id.toString() === id) || defaultCourses[0];
  
  return (
    <div>
      <Banner
        url={course.image?.url || "/images/placeholders/1.svg"}
        title={course.title || "Welcome to Our Courses"}
        subtitle={
          course.description?.shortDesc || "Explore a variety of Courses designed to help you learn and grow with expert faculty guidance."
        }
      />
      <CourseDetails course={course} />
    </div>
  );
};

export default Page;
