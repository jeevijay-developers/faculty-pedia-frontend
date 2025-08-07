'use client';

// import { useEffect, useState, useRef } from 'react';
// import { motion } from 'framer-motion';
import Link from 'next/link';

const TrustedBy = () => {
  // const statsRef = useRef(null);
  // const [isVisible, setIsVisible] = useState(false);
  
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setIsVisible(true);
  //         observer.unobserve(entry.target);
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );
    
  //   if (statsRef.current) {
  //     observer.observe(statsRef.current);
  //   }
    
  //   return () => {
  //     if (statsRef.current) {
  //       observer.unobserve(statsRef.current);
  //     }
  //   };
  // }, []);

  // Statistics data
  // const stats = [
  //   { value: '1,200+', label: 'Registered Learners', color: 'bg-amber-50 text-amber-800', highlightColor: 'text-amber-600' },
  //   { value: '80+', label: 'Expert Educators', color: 'bg-rose-50 text-rose-800', highlightColor: 'text-rose-600' },
  //   { value: '150+', label: 'Courses & Classes', color: 'bg-sky-50 text-sky-800', highlightColor: 'text-sky-600' },
  //   { value: '300+', label: 'Assessments & Quizzes', color: 'bg-purple-50 text-purple-800', highlightColor: 'text-purple-600' },
  // ];

  // Animation variants
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: { 
  //     opacity: 1,
  //     transition: { 
  //       staggerChildren: 0.2,
  //       delayChildren: 0.3,
  //     }
  //   }
  // };
  
  // const itemVariants = {
  //   hidden: { y: 20, opacity: 0 },
  //   visible: { 
  //     y: 0, 
  //     opacity: 1,
  //     transition: { duration: 0.6, ease: "easeOut" }
  //   }
  // };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Growing With Our Learners</h2>
          <p className="text-lg text-gray-600">
            Faculty Pedia is building a vibrant learning community—join us as we grow, improve, and empower education together!
          </p>
        </div>

        <motion.div 
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${stat.color} rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300`}
              variants={itemVariants}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-4xl sm:text-5xl font-bold ${stat.highlightColor}`}>{stat.value}</span>
                <span className="mt-2 text-lg font-medium">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div> */}
        
        <div className="mt-8">
          <div className="bg-blue-600 rounded-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-1">Become a FacultyPedia Educator</h3>
              <p className="text-md text-blue-100">Share your expertise, inspire learners, and earn for your impact. Join our growing network of passionate educators today!</p>
            </div>
            <Link 
              href="/join-as-educator" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 inline-block"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
