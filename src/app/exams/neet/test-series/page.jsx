import Banner from '@/components/Common/Banner'
import AllTestSeries from '@/components/Exams/NEET/AllTestSeries'
import React from 'react'

const page = () => {
  return (
    <div>
      <Banner url="/images/placeholders/1.svg" title="NEET Test Series" subtitle="Choose from our comprehensive test series to excel in NEET" />
      <AllTestSeries />
    </div>
  )
}

export default page