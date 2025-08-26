import Banner from '@/components/Common/Banner'
import CourseCarousel from '@/components/Courses/CourseCarousal'
import EducatorsCarousel from '@/components/Educator/EducatorsCarousel'
import PostCarousel from '@/components/Posts/PostsCarousal'
import React from 'react'
import OneToOneLiveClassesCarousel from '@/components/OneToOne/OneToOneLiveClassesCarousel'
import OneToOnePPHCarousel from '@/components/OneToOne/OneToOnePPHCarousel'
import UpcomingWebinarCarousel from '@/components/Webinars/UpcomingWebinarCarousel'
import TestSeriesCarousel from '@/components/Exams/IIT-JEE/TestSeriesCarousel'

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
      <CourseCarousel title='Online Courses for IIT-JEE' viewMoreLink='/courses' specialization='IIT-JEE' />
      <OneToOneLiveClassesCarousel specialization='IIT-JEE' />
      <OneToOnePPHCarousel specialization='IIT-JEE' />
      <UpcomingWebinarCarousel specialization='IIT-JEE' />
      <TestSeriesCarousel specialization='IIT-JEE' />
      <PostCarousel subject='IIT-JEE' />
    </>
  )
}

export default page