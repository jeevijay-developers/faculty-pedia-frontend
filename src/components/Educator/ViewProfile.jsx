import React from "react";
import CoursesSection from "./CoursesSection";
import ReviewSection from "./ReviewSection";
import QualificationSection from "./QualificationSection";
import ProfileHeader from "./ProfileHeader";
import WebinarsSection from "./WebinarsSection";
import TestSeriesSection from "./TestSeriesSection";
import BiographySection from "./BiographySection";
import WorkExperienceSection from "./WorkExperienceSection";
import EnhancedCoursesSection from "./EnhancedCoursesSection";
import educatorProfile from "@/Data/profile.data";
const ViewProfile = ({ userId }) => {
  // educatorData uses numeric id, so ensure userId is a number
  const educator = educatorProfile;
  if (!educator) return null;

  // Map educatorData fields to component props
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 space-y-6 sm:space-y-8">
        {/* Enhanced Profile Header */}
        <ProfileHeader
        firstName={educator.firstName}
        lastName={educator.lastName}
        rating={educator.rating}
        reviewCount={educator.reviewCount || 120}
        image={educator.profileImage.url}
        bio={educator.bio}
        socials={educator.socials}
        qualification={educator.qualification}
        workExperience={educator.workExperience}
        specialization={educator.specialization}
        classes={["XI", "XII"]} // Add to data if needed
        exams={["IIT-JEE", "NEET"]} // Add to data if needed
        mobileNumber={educator.mobileNumber}
        introVideoLink={educator.introVideoLink}
        demoVideoLink={educator.demoVideoLink}
      />

      {/* Biography Section */}
      <BiographySection bio={educator.bio} />

      {/* Work Experience Section */}
      <WorkExperienceSection workExperience={educator.workExperience} />

      {/* Enhanced Courses Section with Carousel */}
      <EnhancedCoursesSection 
        courses={educator.courses} 
        educatorName={`${educator.firstName} ${educator.lastName}`}
      />

      {/* Additional Sections */}
      {/* Test Series Section */}
      <TestSeriesSection testSeries={educator.testSeries} />

      {/* Webinars Section */}
      <WebinarsSection webinars={educator.webinars} />

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <ReviewSection reviews={educator.reviews || []} />
      </div>

      {/* Qualification Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Education & Qualifications</h2>
        <QualificationSection
          education={educator.qualification}
          experience={educator.workExperience}
        />
      </div>
      </div>
    </div>
  );
};

export default ViewProfile;
