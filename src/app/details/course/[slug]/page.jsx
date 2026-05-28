import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import CourseLoader from "@/components/others/courseLoader";

// Code-split the heavy client component — 1100+ lines with many deps
const CourseDetails = dynamic(
  () => import("@/components/Details/CourseDetails"),
  { loading: () => <CourseLoader /> }
);

// Cache the server-rendered shell for 5 minutes; TanStack Query handles data freshness
export const revalidate = 300;

const Page = async ({ params }) => {
  const { slug } = await params;

  return (
    <div>
      <CourseDetails id={slug} />
    </div>
  );
};

export default Page;
