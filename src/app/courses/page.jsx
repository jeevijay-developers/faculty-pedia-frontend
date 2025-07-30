import Banner from '@/components/Courses/Banner'
import CompetitiveSection from '@/components/Courses/CompetitiveSection'
import JEEAdvanceSection from '@/components/Courses/JEEAdvanceSection'
import JEEMainSection from '@/components/Courses/JEEMainSection'
import NEETSection from '@/components/Courses/NEETSection'
import React from 'react'

function page() {
  return (
    <div>
     <Banner />
     <JEEMainSection />
     <NEETSection />
     <JEEAdvanceSection />
     <CompetitiveSection />
    </div>
  )
}

export default page
