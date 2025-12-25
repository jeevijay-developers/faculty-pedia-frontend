"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiFileText } from "react-icons/fi";
import { getCourseById } from "@/components/server/course.routes";
import { getTestSeriesByCourse, getTestSeriesById } from "@/components/server/test-series.route";
import { getTestsBySeries, getTestById } from "@/components/server/test.route";

const sampleCoursePanel = {
  title: "Physics Crash Course Panel",
  subtitle: "A focused mini-course with quick concept breakdowns, bite-sized demos, and downloadable assets for revision.",
  tags: ["IIT-JEE", "Class 11-12", "English", "Quick Prep"],
  topics: [
    {
      name: "Mechanics",
      description: "Kinematics, Newton's laws, friction, work-energy basics",
      videos: [
        {
          title: "Projectile Motion in 15 minutes",
          url: "https://youtu.be/p9pPjASnnxw?si=CMyPuXnB9DnLOFYI",
          duration: "15:42",
          level: "Starter",
          description: "Quick visuals plus the 3 must-remember trajectory facts for exams.",
        },
        {
          title: "Friction with Intuition",
          url: "https://youtu.be/wUgYa5YLBbM?si=NYyld3uV2agvfCqH",
          duration: "12:18",
          level: "Core",
          description: "Static vs kinetic friction with everyday analogies and exam tips.",
        },
        {
          title: "Work-Energy Theorem Speedrun",
          url: "https://youtu.be/Usu9xZfabPM?si=3eDrq7w6IRuIkzO9",
          duration: "10:05",
          level: "Core",
          description: "One diagram, two formulas, and the most asked MCQ patterns.",
        },
      ],
    },
    {
      name: "Thermodynamics",
      description: "Heat, work, and the laws of thermodynamics in applied problems",
      videos: [
        {
          title: "Zeroth & First Law in Real Life",
          url: "https://youtu.be/Gx_T4Q3nq7g",
          duration: "11:09",
          level: "Starter",
          description: "Intuitive take with coffee mugs, kettles, and quick equilibrium checks.",
        },
        {
          title: "PV Graphs without Memorizing",
          url: "https://www.youtube.com/watch?v=fuFh6w1IrwU",
          duration: "13:27",
          level: "Core",
          description: "Isothermal vs adiabatic with simple slopes and shaded areas.",
        },
      ],
    },
    {
      name: "Waves & Sound",
      description: "Superposition, resonance, and Doppler with exam-style cases",
      videos: [
        {
          title: "Beats in 8 Minutes",
          url: "https://youtu.be/OLM6iCjq-0E",
          duration: "08:02",
          level: "Starter",
          description: "Beats frequency, why headphones leak, and quick numerical tricks.",
        },
        {
          title: "Doppler Effect: Moving Source vs Listener",
          url: "https://www.youtube.com/watch?v=Z5dQh5w7y5E",
          duration: "09:44",
          level: "Core",
          description: "Sirens, trains, and how to pick the right sign convention fast.",
        },
      ],
    },
  ],
  assets: [
    {
      title: "Mechanics Formula Sheet",
      type: "PDF",
      size: "1.2 MB",
      url: "https://example.com/mechanics-formulas.pdf",
      description: "One-page high-yield equations for kinematics, NLM, and energy.",
    },
    {
      title: "Thermo Flashcards",
      type: "Notion Page",
      size: "Online",
      url: "https://example.com/thermo-cards",
      description: "Micro flashcards covering laws, processes, and PV graph cues.",
    },
    {
      title: "Wave Interference Worksheet",
      type: "Worksheet",
      size: "800 KB",
      url: "https://example.com/wave-practice.pdf",
      description: "15 MCQs with annotated solutions on beats and resonance.",
    },
    {
      title: "Lab Audio Samples",
      type: "Audio Pack",
      size: "4.5 MB",
      url: "https://example.com/audio-pack.zip",
      description: "Downloadable tones to demo beats, resonance, and Doppler shifts.",
    },
  ],
  testSeries: [
    // Intentionally empty; avoid showing Test Series tab unless real data exists
  ],
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const idFromWatch = url.includes("watch?v=") ? url.split("v=")[1].split("&")[0] : null;
  const idFromShort = url.includes("youtu.be/") ? url.split("youtu.be/")[1].split("?")[0] : null;
  const videoId = idFromWatch || idFromShort;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const CoursePanelPage = ({ searchParams }) => {
  const courseId = searchParams?.courseId;
  const [courseData, setCourseData] = useState(sampleCoursePanel);
  const [activeTab, setActiveTab] = useState("videos");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseTests, setCourseTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [expandedSeriesId, setExpandedSeriesId] = useState(null);
  const [testsBySeries, setTestsBySeries] = useState({});
  const [seriesTestsLoading, setSeriesTestsLoading] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!courseId) {
        setSelectedVideoId(sampleCoursePanel.topics?.[0]?.videos?.[0]?.url || null);
        setCourseTests([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await getCourseById(courseId);
        if (data) {
          setCourseData(data);
          const first = data?.videos?.[0];
          setSelectedVideoId(first?.link || first?.url || null);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        setError(err?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  useEffect(() => {
    const resolvedCourseId = courseData?._id || courseData?.id || courseId;
    if (!resolvedCourseId) return;

    const initialSeries = Array.isArray(courseData?.testSeries)
      ? courseData.testSeries
      : [];

    if (initialSeries.length > 0) {
      setCourseTests(initialSeries);
      return;
    }

    let cancelled = false;
    const fetchTests = async () => {
      setTestsLoading(true);
      try {
        const res = await getTestSeriesByCourse(resolvedCourseId);
        const candidates = [
          res?.testSeries,
          res?.data?.testSeries,
          res?.data?.data?.testSeries,
          res?.data,
          res,
        ];
        const list = candidates.find(Array.isArray) || [];
        if (!cancelled) setCourseTests(list);
      } catch (err) {
        console.error("Failed to fetch course test series", err);
        if (!cancelled) setCourseTests([]);
      } finally {
        if (!cancelled) setTestsLoading(false);
      }
    };

    fetchTests();
    return () => {
      cancelled = true;
    };
  }, [courseData?._id, courseData?.id, courseData?.testSeries, courseId]);

  const allVideos = useMemo(() => {
    if (Array.isArray(courseData?.videos) && courseData.videos.length > 0) {
      return courseData.videos.map((video, index) => ({
        id: video._id || video.id || video.link || video.url || `video-${index}`,
        title: video.title || video.name || `Video ${index + 1}`,
        url: video.link || video.url,
        description: video.description,
        duration: video.duration,
        topic: video.topic || video.subject,
        level: video.level,
      }));
    }
    // fallback to sample topics flattened
    const fromSample = (sampleCoursePanel.topics || []).flatMap((topic) =>
      (topic.videos || []).map((video, index) => ({
        id: video.url || `sample-${topic.name}-${index}`,
        title: `${topic.name}: ${video.title}`,
        url: video.url,
        description: video.description,
        duration: video.duration,
        topic: topic.name,
        level: video.level,
      }))
    );
    return fromSample;
  }, [courseData]);

  const assets = useMemo(() => {
    if (Array.isArray(courseData?.studyMaterials) && courseData.studyMaterials.length > 0) {
      return courseData.studyMaterials.map((asset, index) => ({
        title: asset.title || `Asset ${index + 1}`,
        type: asset.fileType || "PDF",
        size: asset.size || "",
        url: asset.link,
        description: asset.description || "",
      }));
    }

    return sampleCoursePanel.assets;
  }, [courseData]);

  useEffect(() => {
    if (!allVideos || allVideos.length === 0) return;
    if (!selectedVideoId) {
      setSelectedVideoId(allVideos[0].id);
      return;
    }
    const stillExists = allVideos.some((v) => v.id === selectedVideoId);
    if (!stillExists) {
      setSelectedVideoId(allVideos[0].id);
    }
  }, [allVideos, selectedVideoId]);

  useEffect(() => {
    setShowVideoDropdown(false);
  }, [activeTab]);

  const currentVideo = useMemo(() => {
    if (!allVideos || allVideos.length === 0) return null;
    const found = allVideos.find((v) => v.id === selectedVideoId);
    return found || allVideos[0];
  }, [allVideos, selectedVideoId]);

  const hasCourseTests = useMemo(
    () => Array.isArray(courseTests) && courseTests.length > 0,
    [courseTests]
  );

  const getTestsCount = (series) => {
    if (Array.isArray(series?.tests) && series.tests.length > 0) return series.tests.length;
    if (Array.isArray(series?.liveTests) && series.liveTests.length > 0) return series.liveTests.length;
    if (typeof series?.numberOfTests === "number") return series.numberOfTests;
    if (typeof series?.noOfTests === "number") return series.noOfTests;
    return 0;
  };

  const hydrateTests = async (seriesId, tests) => {
    const needsHydration = tests.some(
      (t) => !t || !t.title || !t.description || (!t.slug && !t._id && !t.id)
    );

    if (!needsHydration) {
      setTestsBySeries((prev) => ({ ...prev, [seriesId]: tests }));
      return;
    }

    try {
      setSeriesTestsLoading((prev) => ({ ...prev, [seriesId]: true }));
      const enriched = await Promise.all(
        tests.map(async (t) => {
          const id = t?._id || t?.id || t;
          const alreadyHas = t && t.title && (t.slug || t._id || t.id);
          if (!id || alreadyHas) return t;
          try {
            const detail = await getTestById(id);
            return detail?.data || detail || t;
          } catch (err) {
            console.error("Failed to hydrate test", id, err);
            return t;
          }
        })
      );
      setTestsBySeries((prev) => ({ ...prev, [seriesId]: enriched }));
    } finally {
      setSeriesTestsLoading((prev) => ({ ...prev, [seriesId]: false }));
    }
  };

  const fetchSeriesTests = async (series) => {
    const seriesId = series?._id || series?.id || null;
    const stateKey = seriesId || series?.slug;
    if (!stateKey || testsBySeries[stateKey]) return;

    const embedded = Array.isArray(series?.tests)
      ? series.tests
      : Array.isArray(series?.liveTests)
      ? series.liveTests
      : null;

    if (embedded && embedded.length > 0) {
      hydrateTests(stateKey, embedded);
      return;
    }

    if (!seriesId) {
      setTestsBySeries((prev) => ({ ...prev, [stateKey]: [] }));
      return;
    }

    setSeriesTestsLoading((prev) => ({ ...prev, [stateKey]: true }));

    try {
      const detail = await getTestSeriesById(seriesId);
      const detailSeries = detail?.testSeries || detail?.data?.testSeries || detail?.data || detail;
      const fromDetail =
        (Array.isArray(detailSeries?.tests) && detailSeries.tests) ||
        (Array.isArray(detailSeries?.liveTests) && detailSeries.liveTests) ||
        [];
      if (fromDetail.length > 0) {
        hydrateTests(stateKey, fromDetail);
        return;
      }

      const res = await getTestsBySeries(seriesId, { limit: 50 });
      const tests = res?.tests || res?.data?.tests || res?.data || [];
      hydrateTests(stateKey, tests);
    } catch (err) {
      console.error("Failed to load tests for series", err);
      setTestsBySeries((prev) => ({ ...prev, [stateKey]: [] }));
    } finally {
      setSeriesTestsLoading((prev) => ({ ...prev, [stateKey]: false }));
    }
  };

  const handleToggleSeries = (series) => {
    const seriesId = series?._id || series?.id || null;
    const stateKey = seriesId || series?.slug;
    if (!stateKey) return;

    const nextExpanded = expandedSeriesId === stateKey ? null : stateKey;
    setExpandedSeriesId(nextExpanded);

    if (!nextExpanded) return;

    if (testsBySeries[stateKey]) return;

    fetchSeriesTests(series);
  };

  useEffect(() => {
    if (!hasCourseTests && activeTab === "tests") {
      setActiveTab("videos");
    }
  }, [hasCourseTests, activeTab]);

  // Preload tests/counts for all series so course-specific sets are hydrated without manual toggle
  useEffect(() => {
    if (!Array.isArray(courseTests) || courseTests.length === 0) return;
    courseTests.forEach((series) => {
      const key = series?._id || series?.id || series?.slug;
      if (!key || testsBySeries[key]) return;
      fetchSeriesTests(series);
    });
  }, [courseTests, testsBySeries]);

  const renderTests = () => {
    if (testsLoading && courseTests.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center text-slate-500">
          Loading test series...
        </div>
      );
    }

    if (!hasCourseTests) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center text-slate-500">
          No test series assigned to this course yet.
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Test Series</h2>
          <p className="text-sm text-slate-600">Course-specific tests and assessments.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courseTests.map((ts, index) => {
            const seriesKey = ts._id || ts.id || ts.slug;
            const seriesTests = testsBySeries[seriesKey];
            const testsCount = seriesTests?.length ?? getTestsCount(ts);
            const isExpanded = expandedSeriesId === seriesKey;

            return (
              <div
                key={ts._id || ts.id || index}
                className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
                      {ts.title || "Untitled Test Series"}
                    </h3>
                    <p className="text-sm text-slate-600 whitespace-pre-line line-clamp-3">
                      {ts.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                        <FiFileText className="w-4 h-4" />
                      </span>
                      <span className="font-medium">{testsCount} tests</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSeries(ts)}
                    aria-label={isExpanded ? "Hide tests" : "Show tests"}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700 transition-transform duration-200 shadow-sm"
                  >
                    <FiChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <div className="border border-slate-100 rounded-lg bg-slate-50 p-3 space-y-3">
                    {seriesTestsLoading[seriesKey] ? (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        <span>Loading tests...</span>
                      </div>
                    ) : seriesTests && seriesTests.length > 0 ? (
                      seriesTests.map((test) => {
                        const targetSlug = test?.slug || test?._id || test?.id;
                        const href = targetSlug ? `/test-panel/${encodeURIComponent(targetSlug)}` : "#";
                        return (
                          <div
                            key={test._id || test.id || test.slug}
                            className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                                {test.title || "Test"}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {test.description || "No description provided."}
                              </p>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-end w-full sm:w-auto">
                              <Link
                                href={href}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                              >
                                Start Test
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-500">No tests available for this series.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-10">
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm h-fit">
            <div className="p-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">Course Panel</p>
              <p className="text-xs text-slate-500">Previewed as a separate page</p>
            </div>
            <div className="flex md:flex-col">
              <div className="relative flex flex-1">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`flex-1 text-left px-4 py-3 text-sm font-medium border-b md:border-b-0 md:border-l-4 transition-colors ${
                    activeTab === "videos"
                      ? "bg-indigo-50 text-indigo-700 md:border-indigo-600"
                      : "text-slate-600 hover:text-slate-900 md:border-transparent"
                  }`}
                >
                  Videos
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoDropdown((prev) => !prev)}
                  className={`px-3 border-b md:border-b-0 border-l text-xs font-semibold transition-colors ${
                    activeTab === "videos"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "text-slate-500 hover:text-slate-900 border-slate-200"
                  }`}
                  aria-label="Select video"
                >
                  ▾
                </button>
                {showVideoDropdown && activeTab === "videos" && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-[1px] rounded-lg border border-slate-200 bg-white shadow-lg max-h-64 overflow-y-auto">
                    {allVideos.map((video) => (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => {
                          setSelectedVideoId(video.id);
                          setShowVideoDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 ${
                          selectedVideoId === video.id ? "bg-indigo-50 text-indigo-700" : "text-slate-700"
                        }`}
                      >
                        {video.title}
                      </button>
                    ))}
                    {allVideos.length === 0 && (
                      <div className="px-3 py-2 text-sm text-slate-500">No videos available</div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveTab("assets")}
                className={`flex-1 text-left px-4 py-3 text-sm font-medium border-b md:border-b-0 md:border-l-4 transition-colors ${
                  activeTab === "assets"
                    ? "bg-indigo-50 text-indigo-700 md:border-indigo-600"
                    : "text-slate-600 hover:text-slate-900 md:border-transparent"
                }`}
              >
                Assets
              </button>
              {hasCourseTests && (
                <button
                  onClick={() => setActiveTab("tests")}
                  className={`flex-1 text-left px-4 py-3 text-sm font-medium border-b md:border-b-0 md:border-l-4 transition-colors ${
                    activeTab === "tests"
                      ? "bg-indigo-50 text-indigo-700 md:border-indigo-600"
                      : "text-slate-600 hover:text-slate-900 md:border-transparent"
                  }`}
                >
                  Test Series
                </button>
              )}
            </div>
           
          </aside>

          <section className="lg:col-span-9 space-y-4">
            {activeTab === "videos" ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">Videos</h2>
                  <p className="text-sm text-slate-600">Use the sidebar dropdown to pick a video.</p>
                  
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    {currentVideo ? (
                      <iframe
                        src={getYouTubeEmbedUrl(currentVideo.url)}
                        title={currentVideo.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
                        Pick a video to start watching.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === "assets" ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Assets</h2>
                    <p className="text-sm text-slate-600">Downloadable resources shared for the course.</p>
                    <p className="text-xs text-slate-500 mt-1">Provided by the educator; PDFs open in a new tab.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assets.map((asset, index) => (
                    <a
                      key={`${asset.title}-${index}`}
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 line-clamp-2">{asset.title}</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{asset.description}</p>
                        <p className="text-xs text-slate-500">{asset.type}{asset.size ? ` • ${asset.size}` : ""}</p>
                      </div>
                      <span className="text-indigo-600 text-sm font-semibold">Download</span>
                    </a>
                  ))}
                  {assets.length === 0 && (
                    <div className="col-span-2 text-sm text-slate-500">No assets available yet.</div>
                  )}
                </div>
              </div>
            ) : (
              renderTests()
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CoursePanelPage;
