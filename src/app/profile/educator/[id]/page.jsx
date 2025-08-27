"use client";
import React, { useEffect } from "react";
import ViewProfile from "@/components/Educator/ViewProfile";
import { getEducatorById } from "@/Data/Educator/educator-profile.data";
import AOS from "aos";
import "aos/dist/aos.css";
import { notFound } from 'next/navigation';

const Page = ({ params }) => {
  const resolvedParams = React.use(params);
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const educator = getEducatorById(resolvedParams.id);
  
  if (!educator) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewProfile educatorData={educator} />
    </div>
  );
};

export default Page;
