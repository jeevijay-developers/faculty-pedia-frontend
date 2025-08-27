'use client';

import React, { useMemo } from 'react';
import { testData, getTestsByClass } from '@/Data/Tests/test.data';
import { TestSeriesCard } from '../IIT-JEE/TestSeriesCarousel';

const ClassesList = ({ selectedClass = null }) => {
  const filtered = useMemo(() => {
    if (selectedClass == null) return testData;
    return getTestsByClass(selectedClass);
  }, [selectedClass]);

  if (!filtered.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600">No tests available for the selected class filter.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedClass && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Class {selectedClass} Test Series
            </h2>
            <p className="text-gray-600">
              {filtered.length} test series available for Class {selectedClass}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((testItem, i) => (
            <TestSeriesCard key={i} testSeries={testItem} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesList;