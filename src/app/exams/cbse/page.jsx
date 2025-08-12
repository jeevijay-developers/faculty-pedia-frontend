'use client'
import Banner from '@/components/Common/Banner'
import React from 'react'
import dynamic from 'next/dynamic'

const CBSEPageContent = dynamic(() => import('@/components/Exams/CBSE/CBSEPageContent'), { ssr: false });

const page = () => {
  return (
    <>
      <Banner
        url="/images/placeholders/1.svg"
        title="CBSE"
        subtitle="Prepare for your CBSE exams with comprehensive study materials, expert guidance, and personalized coaching."
        btnTitle={" Join as Educator"}
        btnUrl={"/join-as-educator"}
      />
      <CBSEPageContent />
    </>
  )
}

export default page