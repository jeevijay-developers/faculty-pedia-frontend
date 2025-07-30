import React from 'react'
import Banner from '../../components/Banner'
import OnlineClasses from '@/components/Classes/OnlineClasses'
import LiveClasses from '@/components/Classes/LiveClasses'
import OfflineClasses from '@/components/Classes/OfflineClasses'

function page() {
  return (
    <div>
      <Banner 
        url="/images/placeholders/1.svg" 
        title="Welcome to Our Classes" 
        subtitle="Explore a variety of classes designed to help you learn and grow with expert faculty guidance." />
      <OnlineClasses />
      <LiveClasses />
      <OfflineClasses />
    </div>
  )
}

export default page
