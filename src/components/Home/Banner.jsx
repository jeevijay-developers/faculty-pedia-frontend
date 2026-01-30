"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Banner = () => {
  return (
    <div className="relative h-[80vh] min-h-112.5 w-full overflow-hidden ">
      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop={true}
        speed={1000}
        className="h-full w-full"
        allowTouchMove={false}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className={`relative h-full w-full`}>
              {/* Banner Image */}
              <Image
                src={banner.image}
                alt={banner.title}
                height={600}
                width={1200}
                className="object-cover w-full h-full"
              />
              {/* Dark overlay for better text visibility */}
              {/* <div className="absolute inset-0 bg-black/40 z-5 pointer-events-none" /> */}

              {/* Content Overlay for each slide */}
              <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 z-10 bg-black/40">
                <div className="text-center text-white max-w-4xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed max-w-2xl mx-auto">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export const banners = [
  {
    image: "/images/Banner/2.png",
    title: "Meet your favorite educators",
    subtitle:
      "Join live classes and webinars with top educators to enhance your learning experience",
  },
  {
    image: "/images/Banner/3.png",
    title: "Start teaching online",
    subtitle:
      "Become an educator and share your knowledge with students worldwide through our platform",
  },
];
export default Banner;
