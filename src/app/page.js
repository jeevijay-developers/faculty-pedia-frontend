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

      {/* Course Carousel - Vertical card layout */}
      <CommonCarousel />

      {/* Webinar Carousel - Horizontal card layout */}
      <WebinarCarousel />

      {/* Classes Carousel - Compact card layout with progress bars */}
      <ClassesCarousel />

      <ExamCarousel />

      <MobileAppAdSection />

      <TrustedBy />

      <OurPosts />

    </div>
  );
}
