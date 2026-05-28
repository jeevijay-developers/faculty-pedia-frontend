import React, { use } from 'react';
import TestSeriesDetails from '@/components/TestSeries/TestSeriesDetails';

// Page for IIT-JEE-specific test series

const IITJEETestSeriesDetailsPage = ({ params }) => {
  const { slug } = use(params);
  return <TestSeriesDetails testSeriesId={slug} examType="iit-jee" />;
};

export default IITJEETestSeriesDetailsPage;
