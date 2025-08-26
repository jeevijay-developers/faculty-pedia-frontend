 'use client';

 import React, { useState, useMemo } from 'react';
 import Link from 'next/link';
 import { Swiper, SwiperSlide } from 'swiper/react';
 import { Navigation, Autoplay } from 'swiper/modules';
 import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
 import { pphData } from '@/Data/1To1PPHClass/pph.data';
 // Optional: if NEET/CBSE datasets exist, import and plug them here
 // import { neetOneToOneCourseCourses } from '@/Data/Exams/neet.data';
 // import { cbseOneToOneCourseCourses } from '@/Data/Exams/cbse.data';

 import 'swiper/css';
 import 'swiper/css/navigation';
import OneToOnePPHCard from './OneToOnePPHCard';

 /**
  * Props:
  * - title?: string
  * - specialization?: 'IIT-JEE' | 'NEET' | 'CBSE'
  * - viewMoreLink?: string
  */
 const OneToOnePPHCarousel = ({
   title = '1-1 Live Pay Per Hour',
   specialization = 'IIT-JEE',
   viewMoreLink = '/one-to-one-pph',
 }) => {
   const [swiperRef, setSwiperRef] = useState(null);

   const data = useMemo(() => {
     switch (specialization) {
       case 'NEET':
         // return neetOneToOneCourseCourses;
         return pphData; // fallback until NEET dataset available
       case 'CBSE':
         // return cbseOneToOneCourseCourses;
         return pphData; // fallback until CBSE dataset available
       case 'IIT-JEE':
       default:
         return pphData;
     }
   }, [specialization]);

   const prevSlide = () => {
     if (swiperRef) swiperRef.slidePrev();
   };

   const nextSlide = () => {
     if (swiperRef) swiperRef.slideNext();
   };

   return (
     <section className="py-12 bg-gray-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-row justify-between items-center gap-2 mb-8">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 truncate">{title}</h2>
          <Link
            href={viewMoreLink}
            className="bg-white text-gray-700 px-3 py-1 xs:px-4 xs:py-2 sm:px-6 sm:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
          >
            View More
          </Link>
         </div>

         <div className="relative">
           <button
             onClick={prevSlide}
             className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
             aria-label="Previous slide"
             style={{ left: '-1rem' }}
           >
             <RiArrowLeftSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
           </button>

           <button
             onClick={nextSlide}
             className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-transparent hover:bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
             aria-label="Next slide"
             style={{ right: '-1rem' }}
           >
             <RiArrowRightSLine className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
           </button>

           <Swiper
             modules={[Navigation, Autoplay]}
             onSwiper={setSwiperRef}
             spaceBetween={16}
             slidesPerView={1}
             autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
             loop={data.length > 1}
             className="one-to-one-carousel"
             breakpoints={{
               480: { slidesPerView: 1, spaceBetween: 16 },
               640: { slidesPerView: 2, spaceBetween: 20 },
               1024: { slidesPerView: 3, spaceBetween: 24 },
             }}
           >
             {data.map((item) => {
               const detailsHref = `/one-to-one-pph/${item.id}`;
               return (
                 <SwiperSlide key={item.id}>
                   <OneToOnePPHCard item={item} detailsHref={detailsHref} />
                 </SwiperSlide>
               );
             })}
           </Swiper>
         </div>
       </div>
     </section>
   );
 };

 export default OneToOnePPHCarousel;


