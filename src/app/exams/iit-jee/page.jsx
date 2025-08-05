import Banner from '@/components/Common/Banner'
import CourseCarousel from '@/components/Exams/IIT-JEE/CourseCarousal'
import EducatorSection from '@/components/Exams/IIT-JEE/EducatorSection'
import OneToOneCourseClasses from '@/components/Exams/IIT-JEE/OneToOneCourseClasses'
import OneToOnePPHClasses from '@/components/Exams/IIT-JEE/OneToOnePPHClasses'
import React from 'react'

const page = () => {
  return (
    <>
    <Banner
        url="/images/placeholders/1.svg"
        title="IIT JEE"
        subtitle="Unlock your potential with expert IIT JEE preparation, curated study material, and personalized guidance from top educators."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />

      <EducatorSection />
      <CourseCarousel title='Top Courses for IIT JEE' viewMoreLink='/courses/iit-jee'  />
      <OneToOneCourseClasses />
      <OneToOnePPHClasses />
    </>
  )
}

export default page