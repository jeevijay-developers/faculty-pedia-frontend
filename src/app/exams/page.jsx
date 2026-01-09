import IITJEESection from '@/components/Exams/IITJEESection'
import CBSESection from '@/components/Exams/CBSESection'
import React from 'react'
import Banner from '@/components/Common/Banner'
import NEETExamSection from '@/components/Exams/NEETExamSection'

const page = () => {
  return (
    <>
      <Banner
        url="/images/Banner/exam-Front.jpg"
        title="Welcome to Our Exams"
        subtitle="Explore a variety of exams designed to help you learn and grow with expert faculty guidance."
      />
      <IITJEESection />
      <NEETExamSection />
      <CBSESection />
    </>
  );
}

export default page