import Banner from "../components/Home/Banner";
import CommonCarousel from "../components/Home/CourseCarousal";
import WebinarCarousel from "../components/Home/WebinarCarousel";
import ClassesCarousel from "../components/Home/ClassesCarousel";

export default function Home() {
  // Example course data for the course carousel
  const topCourses = [
    {
      id: 1,
      title: "JEE Maths Foundation Course",
      instructor: "Meera Sharma",
      duration: "6 months starting from 8 Aug 2025",
      price: "7999",
      originalPrice: "9999",
      image: "/images/courses/course-1.jpg",
      description: "This is a comprehensive math foundation course designed for JEE preparation with expert guidance.",
      enrollLink: "/courses/jee-maths",
      profileLink: "/instructors/meera-sharma"
    },
    {
      id: 2,
      title: "NEET Biology Masterclass",
      instructor: "Dr. Rajesh Kumar",
      duration: "8 months starting from 15 Aug 2025",
      price: "8999",
      originalPrice: "11999",
      image: "/images/courses/course-2.jpg",
      description: "Complete biology preparation for NEET with detailed concepts and practice sessions.",
      enrollLink: "/courses/neet-biology",
      profileLink: "/instructors/rajesh-kumar"
    },
    {
      id: 3,
      title: "Physics for Engineering",
      instructor: "Prof. Anita Singh",
      duration: "5 months starting from 1 Sep 2025",
      price: "6999",
      originalPrice: "8999",
      image: "/images/courses/course-3.jpg",
      description: "Advanced physics concepts for engineering entrance exams with practical applications.",
      enrollLink: "/courses/physics-engineering",
      profileLink: "/instructors/anita-singh"
    }
  ];

  return (
    <div className="min-h-screen">
      <Banner />
      
      {/* Course Carousel - Vertical card layout */}
      <CommonCarousel 
        title="Our Top Courses"
        viewMoreLink="/courses"
        autoplay={false}
        slidesPerView={3}
        spaceBetween={24}
      />

      {/* Webinar Carousel - Horizontal card layout */}
      <WebinarCarousel 
        title="Featured Webinars"
        viewMoreLink="/webinars"
        autoplay={true}
        slidesPerView={2}
        spaceBetween={32}
      />

      {/* Classes Carousel - Compact card layout with progress bars */}
      <ClassesCarousel 
        title="Popular Classes"
        viewMoreLink="/classes"
        autoplay={false}
        slidesPerView={4}
        spaceBetween={20}
      />
    </div>
  );
}
