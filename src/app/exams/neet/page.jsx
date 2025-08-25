import OneToOneLiveClassesCarousel from '@/components/Classes/OneToOneLiveClassesCarousel'
import Banner from '@/components/Common/Banner'
import CourseCarousel from '@/components/Courses/CourseCarousal'
import EducatorsCarousel from '@/components/Educator/EducatorsCarousel'
import OneToOnePPHClasses from '@/components/Exams/NEET/OneToOnePPHClasses'
import TestSeriesSection from '@/components/Exams/NEET/TestSeriesSection'
import UpcomingWebinarSection from '@/components/Exams/NEET/WebinarSection'
import PostCarousel from '@/components/Posts/PostsCarousal'
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
     <EducatorsCarousel specialization='NEET' />
      <CourseCarousel title='Online Courses for NEET' viewMoreLink='/courses' specialization='NEET' />
      <OneToOneLiveClassesCarousel specialization='NEET' />
      <OneToOnePPHClasses />
      <UpcomingWebinarSection />
      <TestSeriesSection />
      <PostCarousel subject='NEET' />
    </>
  )
}

export default page