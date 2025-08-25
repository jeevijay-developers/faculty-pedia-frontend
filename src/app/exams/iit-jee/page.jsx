import Banner from '@/components/Common/Banner'
import CourseCarousel from '@/components/Exams/IIT-JEE/CourseCarousal'
import EducatorsCarousel from '@/components/Educator/EducatorsCarousel'
import OneToOneCourseClasses from '@/components/Exams/IIT-JEE/OneToOneCourseClasses'
import OneToOnePPHClasses from '@/components/Exams/IIT-JEE/OneToOnePPHClasses'
import TestSeriesSection from '@/components/Exams/IIT-JEE/TestSeriesSection'
import UpcomingWebinarSection from '@/components/Exams/IIT-JEE/WebinarSection'
import PostCarousel from '@/components/Posts/PostsCarousal'
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

      <EducatorsCarousel specialization='IIT-JEE' />
      <CourseCarousel title='Online Courses for IIT-JEE' viewMoreLink='/courses'  />
      <OneToOneCourseClasses />
      <OneToOnePPHClasses />
      <UpcomingWebinarSection />
      <TestSeriesSection />
      <PostCarousel subject='IIT-JEE' />
    </>
  )
}

export default page