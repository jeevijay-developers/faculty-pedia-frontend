'use client';

import React, { useState } from 'react';
import FilterSection from './FilterSection';
import ClassesList from './ClassesList';

const CBSEPageContent = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <>
      <FilterSection selectedClass={selectedClass} onChange={setSelectedClass} />
      <ClassesList selectedClass={selectedClass} />
    </>
  );
};

export default CBSEPageContent;


