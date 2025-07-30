import React from 'react'
import Banner from '../../components/Classes/Banner'
import OnlineClasses from '@/components/Classes/OnlineClasses'
import LiveClasses from '@/components/Classes/LiveClasses'
import OfflineClasses from '@/components/Classes/OfflineClasses'

function page() {
  return (
    <div>
      <Banner />
      <OnlineClasses />
      <LiveClasses />
      <OfflineClasses />
    </div>
  )
}

export default page
