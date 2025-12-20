"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCourseById } from "@/components/server/course.routes";

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

  useEffect(() => {
    const load = async () => {
      if (!courseId) {
        setSelectedVideoId(sampleCoursePanel.topics?.[0]?.videos?.[0]?.url || null);
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
            ) : (
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CoursePanelPage;
