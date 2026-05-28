import React, { use } from 'react';
import TestSeriesDetails from '@/components/TestSeries/TestSeriesDetails';

// Page for NEET-specific test series
const NEETTestSeriesDetailsPage = ({ params }) => {
  const { slug } = use(params);

  return <TestSeriesDetails testSeriesId={slug} examType="neet" />;
};

export default NEETTestSeriesDetailsPage;
