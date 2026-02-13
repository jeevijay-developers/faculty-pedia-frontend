"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EducatorCard from "../../components/Educator/EducatorCard";
import { getAllEducators } from "@/components/server/educators.routes";
import Loading from "@/components/Common/Loading";
import { Search } from "lucide-react";

const EducatorsPage = () => {
  const searchParams = useSearchParams();
  const specialization = searchParams.get('specialization');
  
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allEducators, setAllEducators] = useState([]);
  const [filteredEducators, setFilteredEducators] = useState([]);
  const [sortedEducators, setSortedEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("none");

  const subjects = ["All", "Physics", "Chemistry", "Biology", "Mathematics"];

  useEffect(() => {
    const fetchEducators = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllEducators({ limit: 200 });

        let educators = [];
        if (
          response?.data?.educators &&
          Array.isArray(response.data.educators)
        ) {
          educators = response.data.educators;
        } else if (response?.educators && Array.isArray(response.educators)) {
          educators = response.educators;
        } else if (Array.isArray(response)) {
          educators = response;
        } else {
          console.warn("Unexpected educators format:", response);
        }

        setAllEducators(educators);
        setFilteredEducators(educators);
      } catch (error) {
        console.error("Error fetching educators:", error);
        console.error("Error details:", error.response?.data);
        setError(
          error.response?.data?.message ||
            "Failed to load educators. Please try again later."
        );
        setAllEducators([]);
        setFilteredEducators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, []);

  useEffect(() => {
    let filtered = allEducators;

    // First filter by specialization if present in query params
    if (specialization) {
      filtered = filtered.filter((educator) => {
        const educatorSpecializations = Array.isArray(educator.specialization)
          ? educator.specialization
          : educator.specialization
          ? [educator.specialization]
          : [];

        return educatorSpecializations.some(
          (spec) => spec?.toLowerCase() === specialization.toLowerCase()
        );
      });
    }

    // Then filter by subject tab if not "All"
    if (activeTab !== "All") {
      const subjectKey = activeTab.toLowerCase();
      filtered = filtered.filter((educator) => {
        const subjectsList = Array.isArray(educator.subject)
          ? educator.subject
          : educator.subject
          ? [educator.subject]
          : [];

        return subjectsList.some(
          (subject) => subject?.toLowerCase() === subjectKey
        );
      });
    }

    setFilteredEducators(filtered);
  }, [activeTab, allEducators, specialization]);

  useEffect(() => {
    if (activeTab !== "All" && sortOption !== "none") {
      setSortOption("none");
    }
  }, [activeTab, sortOption]);

  useEffect(() => {
    const educatorsToSort = [...filteredEducators];

    if (activeTab === "All") {
      switch (sortOption) {
        case "rating":
          educatorsToSort.sort(
            (a, b) =>
              Number(b.rating?.average ?? b.rating ?? 0) -
              Number(a.rating?.average ?? a.rating ?? 0)
          );
          break;
        case "followers":
          educatorsToSort.sort(
            (a, b) =>
              Number(b.followers?.length ?? 0) -
              Number(a.followers?.length ?? 0)
          );
          break;
        case "experience":
          educatorsToSort.sort((a, b) => {
            const getExperience = (educator) => {
              return Number(
                educator.yearsOfExperience ??
                  educator.yoe ??
                  educator.yearsExperience ??
                  educator.experience ??
                  0
              );
            };
            return getExperience(b) - getExperience(a);
          });
          break;
        default:
          break;
      }
    }

    setSortedEducators(educatorsToSort);
  }, [filteredEducators, sortOption, activeTab]);

  // Filter educators by search query
  const searchFilteredEducators = sortedEducators.filter((educator) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = (educator.fullName || educator.name || "").toLowerCase();
    const subjects = Array.isArray(educator.subject)
      ? educator.subject.join(" ").toLowerCase()
      : (educator.subject || "").toLowerCase();
    return name.includes(query) || subjects.includes(query);
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative w-full bg-white">
          <div
            className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 px-4 md:py-24"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/images/Banner/1.png")',
            }}
          >
            <div className="flex flex-col gap-4 text-center items-center max-w-4xl mx-auto">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-sm">
                Our Expert Educators
              </h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full bg-white">
        <div
          className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat py-16 px-4 md:py-24"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/images/Banner/1.png")',
          }}
        >
          <div className="flex flex-col gap-4 text-center items-center max-w-4xl mx-auto">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-sm">
              {specialization ? `${specialization} Educators` : 'Our Expert Educators'}
            </h1>
            <h2 className="text-gray-200 text-base font-normal leading-normal md:text-lg max-w-2xl">
              {specialization 
                ? `Learn from expert ${specialization} educators across multiple subjects.` 
                : 'Learn from India\'s top educators across multiple subjects. Discover mentors who inspire and guide you to success.'}
            </h2>

            {/* Search Bar */}
            <div className="mt-6 flex w-full max-w-150 flex-col gap-2 md:flex-row">
              <label className="flex w-full items-center rounded-full bg-white p-2 shadow-lg focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
                <div className="flex items-center justify-center pl-4 text-gray-500">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="h-12 w-full min-w-0 flex-1 border-none bg-transparent px-4 text-base font-normal text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                  placeholder="Search for educators, subjects, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setSearchQuery(searchQuery.trim())}
                  className="h-12 rounded-full bg-blue-600 px-8 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Control Bar */}
        <div className="sticky top-0 z-40 -mx-4 md:mx-0 flex flex-col gap-4 bg-gray-50/95 backdrop-blur-sm p-4 md:rounded-2xl md:bg-white md:shadow-sm lg:flex-row lg:items-center lg:justify-between border-b md:border border-gray-200 transition-all mb-6">
          {/* Subject Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all ${
                  activeTab === subject
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Sorting & Results Count */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <p className="text-sm text-gray-600 lg:hidden">
              {searchFilteredEducators.length} Educators
            </p>
            <div className="flex gap-3">
              {activeTab === "All" && (
                <div className="relative group">
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    className="appearance-none h-10 rounded-full border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-0 cursor-pointer hover:bg-gray-50"
                  >
                    <option value="none">Sort by: Default</option>
                    <option value="rating">Sort by: Rating</option>
                    <option value="followers">Sort by: Followers</option>
                    <option value="experience">Sort by: Experience</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results count for desktop */}
        {searchFilteredEducators.length > 0 && (
          <p className="text-sm text-gray-600 mb-6 hidden lg:block">
            Found{" "}
            <span className="font-semibold text-blue-600">
              {searchFilteredEducators.length}
            </span>{" "}
            educator
            {searchFilteredEducators.length !== 1 ? "s" : ""}
            {specialization && <span> for {specialization}</span>}
            {activeTab !== "All" && <span> in {activeTab}</span>}
          </p>
        )}

        {/* Educators Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {searchFilteredEducators && searchFilteredEducators.length > 0 ? (
            searchFilteredEducators.map((educator, i) => (
              <EducatorCard key={educator._id || i} educator={educator} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-blue-50">
                <Search className="h-16 w-16 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                No educators found
              </h3>
              <p className="mt-2 max-w-sm text-gray-500">
                {searchQuery
                  ? "We couldn't find any educators matching your search. Try different keywords."
                  : specialization
                  ? `No educators found for ${specialization}${activeTab !== "All" ? " in " + activeTab : ""}. Try selecting another subject or specialization.`
                  : activeTab !== "All"
                  ? `No educators found for ${activeTab}. Try selecting another subject.`
                  : "We're constantly adding new educators. Please check back soon!"}
              </p>
              {(searchQuery || activeTab !== "All" || specialization) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("All");
                    if (specialization) {
                      window.location.href = "/educators";
                    }
                  }}
                  className="mt-6 rounded-full bg-white border border-gray-200 px-6 py-2.5 text-sm font-bold text-blue-600 shadow-sm hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorsPage;
