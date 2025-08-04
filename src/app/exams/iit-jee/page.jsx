import Banner from '@/components/Common/Banner'
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
    </>
  )
}

export default page