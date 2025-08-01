import IITJEESection from '@/components/Exams/IITJEESection'
import NEETExamSection from '@/components/Exams/NEETExam'
import CBSESection from '@/components/Exams/CBSESection'
import React from 'react'
import OfflineExamSection from '@/components/Exams/OfflineSections'
import Banner from '@/components/Common/Banner'

const page = () => {
  return (
    <>
      <Banner
        url="/images/placeholders/1.svg"
        title="Welcome to Our Exams"
        subtitle="Explore a variety of exams designed to help you learn and grow with expert faculty guidance."
      />
      <IITJEESection />
      <NEETExamSection />
      <CBSESection />
      <OfflineExamSection />
    </>
  )
}

export default page