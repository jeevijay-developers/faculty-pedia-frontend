import React, { use } from 'react';
import TestSeriesDetails from '@/components/TestSeries/TestSeriesDetails';

// Page for NEET-specific test series
const NEETTestSeriesDetailsPage = ({ params }) => {
  const { id } = use(params);
  
  return <TestSeriesDetails testSeriesId={id} examType="neet" />;
};

export default NEETTestSeriesDetailsPage;
