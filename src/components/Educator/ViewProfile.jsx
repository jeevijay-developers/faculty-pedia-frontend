import React from "react";
import CoursesSection from "./CoursesSection";
import ReviewSection from "./ReviewSection";
import QualificationSection from "./QualificationSection";
import ProfileHeader from "./ProfileHeader";
import WebinarsSection from "./WebinarsSection";
import TestSeriesSection from "./TestSeriesSection";
import educatorProfile from "@/Data/profile.data";
const ViewProfile = ({ userId }) => {
  // educatorData uses numeric id, so ensure userId is a number
  const educator = educatorProfile;
  if (!educator) return null;

  // Map educatorData fields to component props
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProfileHeader
        firstName={educator.firstName}
        lastName={educator.lastName}
        rating={educator.rating}
        reviewCount={educator.reviewCount}
        image={educator.profileImage.url}
        bio={educator.bio}
      />
      {/* assds */}
      {/* You may want to create a stats object if needed, or pass individual stats */}
      {/* <StatsSection stats={educator.stats} /> */}
      {/* <ReviewSection reviews={educator.reviews || []} /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Left Column */}
        <div className="space-y-8">
          <QualificationSection
            education={educator.qualification}
            experience={educator.workExperience}
          />
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-12">
          <CoursesSection courses={educator.courses} />
          <TestSeriesSection testSeries={educator.testSeries} />
          <WebinarsSection webinars={educator.webinars} />
          <ReviewSection reviews={[]} /> {/* Add reviews data when available */}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
