"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AllPostsSection from '../../components/Posts/AllPostsSection';

const PostsPage = () => {
  const searchParams = useSearchParams();
  const educatorId = searchParams.get("educator");

  return <AllPostsSection educatorId={educatorId} />;
};

export default PostsPage;
