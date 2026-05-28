import React, { use } from 'react';
import TestSeriesDetails from '@/components/TestSeries/TestSeriesDetails';
import { getTestSeriesBySlug, getTestSeriesById } from '@/components/server/test-series.route';
import Banner from '@/components/Common/Banner';

const IITJEETestSeriesDetailsPage = async ({ params }) => {
  const { slug } = await params;

  let testSeriesData = null;
  let error = null;

  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    const raw = isObjectId
      ? await getTestSeriesById(slug)
      : await getTestSeriesBySlug(slug);
    testSeriesData = raw?.testSeries || raw?.data || raw;
  } catch (err) {
    console.error('Error fetching IIT-JEE test series:', err);
    error = err.message || 'Failed to load test series';
  }

  if (error || !testSeriesData) {
    return (
      <div>
        <Banner
          url="/images/placeholders/card-16x9.svg"
          title="Test Series Not Found"
          subtitle="The test series you're looking for could not be found."
        />
      </div>
    );
  }

  return <TestSeriesDetails testSeriesData={testSeriesData} />;
};

export default IITJEETestSeriesDetailsPage;
