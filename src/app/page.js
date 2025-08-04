import Banner from "../components/Home/Banner";
import ClassesCarousel from "../components/Home/ClassesCarousel";
import ExamCarousel from "@/components/Home/ExamCarousel";
import MobileAppAdSection from "@/components/Home/MobileAppAdSection";
import TrustedBy from "@/components/Home/TrustedBy";
import OurPosts from "@/components/Home/OurPosts";
import CourseCarousel from "../components/Home/CourseCarousal";
import OneToOneWebinar from "../components/Webinars/OneToOneWebinar";
import LiveWebinarSection from "../components/Webinars/LiveWebinarSection";
import HomeExamMenu from "@/components/Home/HomeExamMenu";
import FeaturesMenu from "@/components/Home/FeaturesMenu";

export default function Home() {

  return (
    <div className="min-h-screen">
      <Banner />
      <HomeExamMenu />
      {/* <CourseCarousel /> 
      <LiveWebinarSection />
      <OneToOneWebinar /> 
      <ClassesCarousel />
      <ExamCarousel /> */}
      <FeaturesMenu />
      <MobileAppAdSection />
      <TrustedBy />
      {/* <OurPosts /> */}
    </div>
  );
}
