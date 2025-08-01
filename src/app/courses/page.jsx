import Banner from '@/components/Common/Banner'
import CompetitiveSection from '@/components/Courses/CompetitiveSection'
import JEEAdvanceSection from '@/components/Courses/JEEAdvanceSection'
import JEEMainSection from '@/components/Courses/JEEMainSection'
import NEETSection from '@/components/Courses/NEETSection'
import React from 'react'

function page() {
  return (
    <div>
       <Banner 
             url="/images/placeholders/1.svg" 
             title="Explore Our Top Courses" 
             subtitle="Explore a variety of classes designed to help you learn and grow with expert faculty guidance." />
     <JEEMainSection />
     <NEETSection />
     <JEEAdvanceSection />
     <CompetitiveSection />
    </div>
  )
}

export default page
