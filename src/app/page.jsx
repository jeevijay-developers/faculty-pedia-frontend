import Banner from "../components/Home/Banner";
import MobileAppAdSection from "@/components/Home/MobileAppAdSection";
import TrustedBy from "@/components/Home/TrustedBy";
import HomeExamMenu from "@/components/Home/HomeExamMenu";
import FeaturesMenu from "@/components/Home/FeaturesMenu";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Banner />
      <HomeExamMenu />
      <FeaturesMenu />
      <MobileAppAdSection />
      <TrustedBy />
    </div>
  );
}
