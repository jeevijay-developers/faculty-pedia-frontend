import OneToOneLiveClassesCarousel from '@/components/OneToOne/OneToOneLiveClassesCarousel'
import Banner from '@/components/Common/Banner'
import CourseCarousel from '@/components/Courses/CourseCarousal'
import EducatorsCarousel from '@/components/Educator/EducatorsCarousel'
import OneToOnePPHCarousel from '@/components/OneToOne/OneToOnePPHCarousel'
import PostCarousel from '@/components/Posts/PostsCarousal'
import React from 'react'
import UpcomingWebinarCarousel from '@/components/Webinars/UpcomingWebinarCarousel'
import TestSeriesCarousel from '@/components/Exams/IIT-JEE/TestSeriesCarousel'

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
      <OneToOnePPHCarousel specialization='NEET' />
      <UpcomingWebinarCarousel specialization='NEET' />
      <TestSeriesCarousel specialization='NEET' />
      <PostCarousel subject='NEET' />
    </>
  )
}

export default page