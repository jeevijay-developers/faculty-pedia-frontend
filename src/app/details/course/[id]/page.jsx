import CourseDetails from "@/components/Details/CourseDetails";
import React from "react";
import { defaultCourses } from "@/Data/Courses/courses.data";

const Page = async ({ params }) => {
  const { id } = await params;
  
  // Find the course by ID, fallback to first course if not found
  const course = defaultCourses.find(c => c.id.toString() === id) || defaultCourses[0];
  
  return (
    <div>
      <CourseDetails course={course} />
    </div>
  );
};

export default Page;
