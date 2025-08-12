'use client';

import React from 'react';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * FilterSection
 * Props:
 * - selectedClass: number | null
 * - onChange: (value: number | null) => void
 */
const FilterSection = ({ selectedClass = null, onChange = () => {} }) => {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-end">
          <div className="flex items-center gap-3">
            <select
              id="cbse-class"
              value={selectedClass ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onChange(value === '' ? null : Number(value));
              }}
              className="min-w-[180px] bg-white border border-gray-300 text-gray-800 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            >
              <option value="">All Classes (1 - 12)</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{`Class ${cls}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;


