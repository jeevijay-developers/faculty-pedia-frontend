import Banner from '@/components/Common/Banner'
import React from 'react'

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
    </>
  )
}

export default page