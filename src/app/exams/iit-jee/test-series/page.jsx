import Banner from '@/components/Common/Banner'
import AllTestSeries from '@/components/Exams/NEET/AllTestSeries'
import React from 'react'

const page = () => {
  return (
    <div>
  <Banner url="/images/placeholders/1.svg" title="IIT JEE Test Series" subtitle="Prepare for IIT JEE with our comprehensive test series." />
  <AllTestSeries exam="IIT-JEE" />
    </div>
  )
}

export default page