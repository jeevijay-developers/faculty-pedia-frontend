'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

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
        <div className='group font-bold text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-16 rounded-xl cursor-pointer hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl'
        onClick={() => handleCardClick('jee')}
        >
          <div className="text-center">
            <div className="mb-2">📚</div>
            <div>IIT JEE</div>
            <p className="text-sm font-normal mt-2 opacity-90">Joint Entrance Exam</p>
          </div>
        </div>
        <div className='group font-bold text-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white p-16 rounded-xl cursor-pointer hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl'
        onClick={() => handleCardClick('neet')}
        >
          <div className="text-center">
            <div className="mb-2">🎯</div>
            <div>NEET</div>
            <p className="text-sm font-normal mt-2 opacity-90">National Eligibility cum Entrance Test</p>
          </div>
        </div>
        
        <div 
        className='group font-bold text-2xl bg-gradient-to-br from-green-500 to-green-600 text-white p-16 rounded-xl cursor-pointer hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl'
        onClick={() => handleCardClick('cbse')}
        >
          <div className="text-center">
            <div className="mb-2">🏥</div>
            <div>CBSE</div>
            <p className="text-sm font-normal mt-2 opacity-90">Central Board of Secondary Education</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeExamMenu