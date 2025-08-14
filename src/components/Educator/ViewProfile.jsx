import React from "react";
import CoursesSection from "./CoursesSection";
import ReviewSection from "./ReviewSection";
import { educatorData } from "@/Data/educator.data";
import ProfileHeader from "./ProfileHeader";
import QualificationSection from "./QualificationSection";

const ViewProfile = ({ userId }) => {
  // educatorData uses numeric id, so ensure userId is a number
  const educator = educatorData.find((edu) => edu.id === Number(userId));
  if (!educator) return null;

  // Map educatorData fields to component props
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProfileHeader
        name={educator.name}
        rating={educator.rating}
        reviewCount={educator.reviewCount}
        image={educator.image}
        bio={educator.bio}
      />
      {/* assds */}
      {/* You may want to create a stats object if needed, or pass individual stats */}
      {/* <StatsSection stats={educator.stats} /> */}
      {/* <ReviewSection reviews={educator.reviews || []} /> */}
      <QualificationSection
        education={educator.qualifications}
        experience={educator.workExperience}
      />
      <CoursesSection courses={educator.courses} />
    </div>
  );
};

export default ViewProfile;
