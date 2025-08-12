import Banner from '@/components/Common/Banner'
import CourseCarousel from '@/components/Exams/NEET/CourseCarousal'
import EducatorSection from '@/components/Exams/NEET/EducatorSection'
import OneToOneCourseClasses from '@/components/Exams/NEET/OneToOneCourseClasses'
import OneToOnePPHClasses from '@/components/Exams/NEET/OneToOnePPHClasses'
import TestSeriesSection from '@/components/Exams/NEET/TestSeriesSection'
import UpcomingWebinarSection from '@/components/Exams/NEET/WebinarSection'
import PostSection from '@/components/Exams/NEET/PostSection'
import React from 'react'

const page = () => {
  return (
    <>
      <Banner
        url="/images/placeholders/1.svg"
        title="NEET"
        subtitle="Excel in your NEET preparation with specialized medical curriculum, expert coaching, and comprehensive study resources designed for future medical professionals."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />
      <EducatorSection />
      <CourseCarousel title='Online Courses for NEET' viewMoreLink='/courses/neet' />
      <OneToOneCourseClasses />
      <OneToOnePPHClasses />
      <UpcomingWebinarSection />
      <TestSeriesSection />
      <PostSection />
    </>
  )
}

export default page