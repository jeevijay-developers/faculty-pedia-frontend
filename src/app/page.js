import Banner from "../components/Home/Banner";
import CommonCarousel from "../components/Home/CourseCarousal";
import WebinarCarousel from "../components/Home/WebinarCarousel";
import ClassesCarousel from "../components/Home/ClassesCarousel";
import ExamCarousel from "@/components/Home/ExamCarousel";
import MobileAppAdSection from "@/components/Home/MobileAppAdSection";
import TrustedBy from "@/components/Home/TrustedBy";
import OurPosts from "@/components/Home/OurPosts";

export default function Home() {

  return (
    <div className="min-h-screen">
      <Banner />
      <CommonCarousel /> 
      <WebinarCarousel /> 
      <ClassesCarousel />
      <ExamCarousel />
      <MobileAppAdSection />
      <TrustedBy />
      <OurPosts />
    </div>
  );
}
