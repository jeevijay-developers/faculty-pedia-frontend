import React, { use } from 'react';
import TestSeriesDetails from '@/components/TestSeries/TestSeriesDetails';

// Page for IIT-JEE-specific test series

const IITJEETestSeriesDetailsPage = ({ params }) => {
  const { id } = use(params);
  return <TestSeriesDetails testSeriesId={id} examType="iit-jee" />;
};

export default IITJEETestSeriesDetailsPage;
