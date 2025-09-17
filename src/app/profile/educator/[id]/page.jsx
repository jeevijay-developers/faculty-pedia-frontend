"use client";
import React, { useEffect, useState } from "react";
import ViewProfile from "@/components/Educator/ViewProfile";
import { getEducatorById } from "@/Data/Educator/educator-profile.data";
import AOS from "aos";
import "aos/dist/aos.css";
import { notFound } from "next/navigation";
import Loading from "@/components/Common/Loading";
import { getEducatorProfile } from "@/components/server/educators.routes";

const Page = ({ params }) => {
  const resolvedParams = React.use(params);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // const educator = getEducatorById(resolvedParams.id);

  const [educatorData, setEducatorData] = useState(null);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchEducators = async () => {
      try {
        const data = await getEducatorProfile(resolvedParams.id);
        // setFilteredEducators([...data.educators]);
        // console.log(data);
        setEducatorData(data.educator);
      } catch (error) {
        console.error("Error fetching educators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [resolvedParams.id]);

  if (loading) {
    return <Loading />;
  }

  // if (!educatorData) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewProfile educatorData={educatorData} />
    </div>
  );
};

export default Page;
