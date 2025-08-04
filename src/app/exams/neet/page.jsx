import Banner from '@/components/Common/Banner'
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
    
    </>
  )
}

export default page