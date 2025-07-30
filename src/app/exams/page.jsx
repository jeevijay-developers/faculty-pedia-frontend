import IITJEESection from '@/components/Exams/IITJEESection'
import NEETExamSection from '@/components/Exams/NEETExam'
import CBSESection from '@/components/Exams/CBSESection'
import React from 'react'
import OfflineExamSection from '@/components/Exams/OfflineSections'

const page = () => {
  return (
    <>
    <IITJEESection />
    <NEETExamSection />
    <CBSESection />
    <OfflineExamSection />
    </>
  )
}

export default page