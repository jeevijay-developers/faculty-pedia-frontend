"use client";

import React, { useEffect, useState } from "react";
import EducatorCard from "../../components/Educator/EducatorCard";
import { getEducatorBySubject } from "../../Data/Educator/educator-profile.data";
import Banner from "@/components/Common/Banner";
import { getEducatorsBySubject } from "@/components/server/educators.routes";
import Loading from "@/components/Common/Loading";

const EducatorsPage = () => {
  const [activeTab, setActiveTab] = useState("Physics");

  const subjects = ["Physics", "Chemistry", "Biology", "Mathematics"];

  // const filteredEducators = getEducatorBySubject(activeTab);
  const [filteredEducators, setFilteredEducators] = useState(
    getEducatorBySubject(activeTab)
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchEducators = async () => {
      try {
        const data = await getEducatorsBySubject({
          subject: activeTab.toLocaleLowerCase(),
        });
        setFilteredEducators([...data.educators]);
      } catch (error) {
        console.error("Error fetching educators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [activeTab]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner
        title="Our Expert Educators"
        subtitle="Learn from the best teachers across different subjects"
        url="/images/placeholders/1.svg"
      />
      <div className="">
        {/* Subject Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 justify-center">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveTab(subject)}
                  className={`py-2 px-1 border-b-2 font-medium text-md transition-colors ${
                    activeTab === subject
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Educators Grid */}
        <div className="mx-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEducators.length > 0 ? (
            filteredEducators.map((educator, i) => (
              <EducatorCard key={i} educator={educator} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No educators found for {activeTab}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorsPage;
