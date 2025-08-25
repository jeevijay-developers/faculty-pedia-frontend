'use client';

import React, { useState } from 'react';
import Banner from '@/components/Common/Banner';
import { defaultCourses } from '@/Data/Courses/courses.data';
import CourseCard from '@/components/Courses/CourseCard';

export const getCoursesBySubject = (subject) => {
  return defaultCourses.filter(course => course.subject === subject);
}

const CoursesPage = () => {
    const [activeTab, setActiveTab] = useState('Physics');
    
    const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];

    const filteredCourses = getCoursesBySubject(activeTab);

    return (
        <div className="min-h-screen bg-gray-50">
              <Banner title="Our Courses" subtitle="Learn from the best courses across different subjects" url="/images/placeholders/1.svg" />
            <div>

                {/* Subject Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 justify-center">
                            {subjects.map((subject) => (
                                <button
                                    key={subject}
                                    onClick={() => setActiveTab(subject)}
                                    className={`py-2 px-1 border-b-2 font-medium text-md transition-colors ${
                                        activeTab === subject
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {subject}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="mx-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, i) => (
                            <CourseCard key={i} course={course} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No courses found for {activeTab}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;