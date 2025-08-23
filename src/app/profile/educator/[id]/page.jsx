"use client";
import React, { useEffect } from "react";
import ViewProfile from "@/components/Educator/ViewProfile";
import { educatorProfile } from "@/Data/profile.data";
import AOS from "aos";
import "aos/dist/aos.css";

const Page = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewProfile educatorData={educatorProfile} />
    </div>
  );
};

export default Page;
