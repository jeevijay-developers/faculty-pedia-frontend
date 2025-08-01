import ViewProfile from '@/components/Educator/ViewProfile';
import React from 'react';

const Page = async ({ params }) => {
  const { id } = await params;

  return (
    <>
      <ViewProfile userId={id} />
    </>
  );
};

export default Page;
