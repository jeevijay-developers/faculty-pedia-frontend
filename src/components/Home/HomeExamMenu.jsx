'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

const HomeExamMenu = () => {
  const router = useRouter();

  const handleCardClick = (exam) => {
    router.push(`/exams/${exam}`);
  };

  return (
    <section className="my-20 px-4">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Choose Your Exam
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your target exam and get access to specialized courses, expert guidance, and comprehensive study materials
        </p>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div 
        className='group font-bold text-2xl text-white p-10 rounded-xl cursor-pointer hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden'
        onClick={() => handleCardClick('iit-jee')}
        style={{
          backgroundImage: 'url("/others/iit-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/50 bg-opacity-40"></div>
          
          <div className="text-center relative z-10">
           <div className='w-15 h-15 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-md'>
              <Image src="/logo/iit-logo.png" alt="IIT Icon" width={40} height={40} />
            </div>
            <div>IIT JEE</div>
            <p className="text-sm font-normal mt-2 opacity-90">Indian Institute of Technology</p>
          </div>
        </div>
        <div 
        className='group font-bold text-2xl text-white p-10 rounded-xl cursor-pointer hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden'
        onClick={() => handleCardClick('neet')}
        style={{
          backgroundImage: 'url("/others/neet-bg.avif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/50 bg-opacity-40"></div>
          
          <div className="text-center relative z-10">
           <div className='w-15 h-15 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-md'>
              <Image src="/logo/neet-logo.png" alt="NEET Icon" width={40} height={40} />
            </div>
            <div>NEET</div>
            <p className="text-sm font-normal mt-2 opacity-90">National Eligibility cum Entrance Test</p>
          </div>
        </div>
        
        <div 
        className='group font-bold text-2xl text-white p-10 rounded-xl cursor-pointer hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden'
        onClick={() => handleCardClick('cbse')}
        style={{
          backgroundImage: 'url("/others/cbse-bg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/50 bg-opacity-40"></div>
          
          <div className="text-center relative z-10">
           <div className='w-15 h-15 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-md'>
              <Image src="/logo/cbse-logo.png" alt="CBSE Icon" width={40} height={40} />
            </div>
            <div>CBSE</div>
            <p className="text-sm font-normal mt-2 opacity-90">Central Board of Secondary Education</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeExamMenu