'use client';

import React, { useMemo, useState } from 'react';
import Banner from '@/components/Common/Banner';
import { pphData } from '@/Data/1To1PPHClass/pph.data';
import OneToOnePPHCard from '@/components/OneToOne/OneToOnePPHCard';

const getPphBySubject = (subject) => {
  return pphData.filter(item => item.subject === subject);
};

const OneToOnePPHPage = () => {
  const subjects = useMemo(() => Array.from(new Set(pphData.map(i => i.subject))), []);
  const [activeTab, setActiveTab] = useState(subjects[0] || '');

  const filtered = useMemo(() => {
    if (!activeTab) return pphData;
    return getPphBySubject(activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner title="1-1 Pay Per Hour" subtitle="Book expert 1-1 sessions by the hour across subjects." url="/images/placeholders/1.svg" />
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

        {/* Cards Grid */}
        <div className="mx-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const detailsHref = `/one-to-one-pph/${item.id}`;
              return (
                <OneToOnePPHCard key={item.id} item={item} detailsHref={detailsHref} />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No sessions found for {activeTab}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneToOnePPHPage;