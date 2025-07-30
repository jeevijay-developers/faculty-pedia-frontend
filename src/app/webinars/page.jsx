import Banner from '@/components/Classes/Banner'
import Footer from '@/components/Footer'
import LiveWebinarSection from '@/components/Webinars/LiveWebinarSection'
import OneToOneWebinar from '@/components/Webinars/OneToOneWebinar'
import UpcomingWebinarSection from '@/components/Webinars/UpcomingWebinarSection'
import React from 'react'

const page = () => {
    return (
        <>
            <Banner
                url="/images/placeholders/1.svg"
                title="Welcome to Our Webinars"
                subtitle="Explore a variety of webinars designed to help you learn and grow with expert faculty guidance."
            />
            <OneToOneWebinar />
            <LiveWebinarSection />
            <UpcomingWebinarSection />
        </>
    )
}

export default page