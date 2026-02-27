"use client";

import React from "react";

const services = [
  {
    emoji: "🚀",
    title: "One-to-All Live Courses",
    description:
      "Teach hundreds of students simultaneously with interactive live sessions built for scale.",
  },
  {
    emoji: "🎯",
    title: "1-to-1 Live Mentorship",
    description:
      "Offer personalised pay-per-hour mentorship sessions directly to eager learners.",
  },
  {
    emoji: "📚",
    title: "Recorded Courses",
    description:
      "Upload and sell high-quality video courses that students can access anytime, anywhere.",
  },
  {
    emoji: "📝",
    title: "Test Series Creation",
    description:
      "Build, manage, and sell full test series tailored to IIT JEE, NEET, and beyond.",
  },
  {
    emoji: "🎤",
    title: "Webinars & Masterclasses",
    description:
      "Host live webinars and masterclasses to grow your audience and authority.",
  },
  {
    emoji: "💳",
    title: "Automated & Transparent Payments",
    description:
      "Get paid instantly with zero confusion — full financial visibility at every step.",
  },
];

const limitations = [
  "Geography",
  "Infrastructure",
  "Marketing budgets",
  "Technical complexity",
];

const beliefs = [
  "Ownership",
  "Visibility",
  "Fair earnings",
  "National reach",
];

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-24 lg:pt-32 lg:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 font-semibold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            About FacultyPedia
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
            Built for Educators.
            <br />
            Powered by Vision.
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            FacultyPedia is a modern digital platform designed to help educators teach smarter, scale faster, and earn without limits.
          </p>
        </div>
      </section>

      {/* BRAND IDENTITY */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-6">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our DNA</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
            We&apos;re not just another EdTech company.
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2 text-left max-w-2xl mx-auto rounded-r-xl bg-blue-50/40">
            &ldquo;We&apos;re building a teacher-first ecosystem where educators become brands.&rdquo;
          </p>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">What We Do</h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
              FacultyPedia gives IIT JEE, NEET, school, and coaching teachers everything they need to go digital — without tech stress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(37,99,235,0.12)] transition-all duration-300 cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-3xl mb-5 group-hover:bg-blue-100 transition-colors duration-300 shadow-sm">
                    {service.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-block rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-10 py-10 shadow-xl shadow-blue-600/25">
              <p className="text-3xl md:text-4xl font-black text-white leading-snug">
                You focus on teaching.
              </p>
              <p className="text-3xl md:text-4xl font-black text-blue-200 leading-snug mt-1">
                We handle the technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY FACULTYPEDIA EXISTS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our Purpose</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Why FacultyPedia Exists
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
              <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-500 text-xs font-black shrink-0">
                  ✕
                </span>
                Great teachers should not be limited by:
              </h3>
              <ul className="space-y-3">
                {limitations.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-red-200/70 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-red-500" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M2 2l6 6M8 2l-6 6" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8">
              <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-black shrink-0">
                  ✓
                </span>
                We believe educators deserve:
              </h3>
              <ul className="space-y-3">
                {beliefs.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200/70 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
              FacultyPedia turns educators into{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                digital entrepreneurs.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-8">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our Vision</span>
          </div>

          <div className="relative rounded-3xl bg-gray-900 text-white overflow-hidden p-12 lg:p-20">
            <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full border border-white/5" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full border border-white/5" />

            <p className="relative text-sm font-bold uppercase tracking-widest text-blue-400 mb-6">
              Our Vision
            </p>
            <h2 className="relative text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-white">
              To build India&apos;s most trusted platform where teachers grow their brand, income, and impact
              {" "}&mdash;{" "}
              <span className="text-blue-400">all in one place.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl md:text-2xl lg:text-4xl font-black text-white leading-tight mb-4">
            The Future of Teaching Is Independent.
          </h2>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-black text-blue-200 leading-tight mb-12">
            The Future of Teaching Is FacultyPedia.
          </h2>

          <div className="mb-8">
            <a
              href="https://www.FacultyPedia.com"
              className="inline-block text-white/80 hover:text-white font-semibold text-lg underline underline-offset-4 transition-colors"
            >
              www.FacultyPedia.com
            </a>
          </div>

          <span className="inline-block px-6 py-3 rounded-full bg-white/10 text-white font-semibold tracking-wide text-sm border border-white/20">
            Empowering Educators | Educating India
          </span>
        </div>
      </section>

    </div>
  );
}