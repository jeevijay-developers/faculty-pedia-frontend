"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const offerings = [
  {
    title: "Live, interactive classes",
    description:
      "Guided sessions for IIT JEE, NEET, and CBSE (6th–12th) with real-time doubt solving.",
  },
  {
    title: "Structured learning pathways",
    description:
      "Curated study plans, exam-focused preparation, and progress tracking tools.",
  },
  {
    title: "Verified educator profiles",
    description:
      "Follow, track, and learn from trusted educators dedicated to your success.",
  },
  {
    title: "Personalized student accounts",
    description:
      "Secure sign-up, saved progress, and insights that adapt to every learner.",
  },
  {
    title: "Mentorship & doubt support",
    description:
      "One-to-one help and community guidance that keeps your preparation smooth.",
  },
];

const AboutPage = () => {
  const [showCtas, setShowCtas] = useState(true);

  useEffect(() => {
    const syncVisibility = () => {
      if (typeof window === "undefined") return;
      const role = localStorage.getItem("user-role");
      const hasStudent = localStorage.getItem("faculty-pedia-student-data");
      const hasEducator = localStorage.getItem("faculty-pedia-educator-data");
      setShowCtas(!(role === "student" && hasStudent) && !(role === "educator" && hasEducator));
    };

    syncVisibility();
    window.addEventListener("storage", syncVisibility);
    window.addEventListener("student-data-updated", syncVisibility);
    window.addEventListener("educator-data-updated", syncVisibility);
    return () => {
      window.removeEventListener("storage", syncVisibility);
      window.removeEventListener("student-data-updated", syncVisibility);
      window.removeEventListener("educator-data-updated", syncVisibility);
    };
  }, []);

  return (
    <div className="bg-linear-to-b from-white via-blue-50/40 to-white">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-100" />
          <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute -bottom-12 -right-8 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
          <div className="absolute top-40 left-1/2 hidden h-56 w-56 -translate-x-1/2 rounded-full border border-blue-200/40 sm:block" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[3fr,2fr] lg:items-center">
            <div className="space-y-7 text-gray-900">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-5 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                Built for ambitious learners
              </span>
              <h1 className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-700 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl lg:text-[56px]">
                Preparing smarter for IIT JEE, NEET, and CBSE starts here
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                Facultypedia is a learning platform created for students from
                Classes 6th to 12th and droppers pursuing IIT JEE or NEET. We
                connect you with exceptional educators, clear guidance, and a
                vibrant academic community that keeps you motivated every step
                of the way.
              </p>
              {showCtas && (
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/join-as-student"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                  >
                    Join as Student
                  </Link>
                  <Link
                    href="/join-as-educator"
                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:text-blue-900"
                  >
                    Become an Educator
                  </Link>
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-white/60 bg-white p-8 shadow-2xl shadow-blue-100">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6">
                  <p className="text-4xl font-bold text-blue-700">10K+</p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-800/80">
                    Practice questions and tests curated with exam patterns in
                    mind.
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50 to-white p-6">
                  <p className="text-4xl font-bold text-indigo-700">500+</p>
                  <p className="mt-2 text-sm leading-relaxed text-indigo-800/80">
                    Handpicked educators verified for expertise and teaching
                    quality.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-white p-6 sm:col-span-2">
                  <p className="text-4xl font-bold text-purple-700">
                    Community-first
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-purple-800/80">
                    Students and educators follow each other, interact, and grow
                    together inside a safe academic space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Empowering learning journeys with clarity, confidence, and
              consistency
            </h2>
            <p className="text-gray-600">
              Facultypedia is built for one purpose — helping every learner
              prepare smarter. Whether you are stepping into middle school or
              pushing for a top rank as a dropper, we pair you with the right
              educators and resources to make progress feel achievable.
            </p>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-gray-900">
                "We believe great learning happens when students connect with
                the right educators."
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Our community-driven ecosystem lets students and educators
                follow each other, interact, and stay connected — just like a
                social platform, but designed entirely around academics.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-8 shadow-inner">
            <h3 className="text-xl font-semibold text-blue-900">
              Our Platform Offers:
            </h3>
            <ul className="mt-6 space-y-5">
              {offerings.map((item) => (
                <li key={item.title} className="flex gap-4">
                  
                  <div>
                    <p className="text-base font-semibold text-blue-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-blue-800/80">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* <section className="bg-blue-600 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 text-white sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Your goals deserve the right guidance
            </h2>
            <p className="text-blue-50/80">
              We are not just building another coaching platform. We are
              creating a digital space where learners feel supported, heard, and
              empowered — every feature is crafted to bring you closer to
              quality teaching and help unlock your true potential.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:justify-end">
            <Link
              href="/join-as-student"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-900/30 transition hover:bg-blue-50"
            >
              Start Learning
            </Link>
            <Link
              href="/educators"
              className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Educators
            </Link>
          </div>
        </div>
      </section> */}

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Facultypedia is here to make your journey simpler, smarter, and more
          connected.
        </h3>
        <p className="mt-4 text-gray-600">
          Let us help you find the mentorship, study material, and supportive
          community you need to achieve your dream results.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
