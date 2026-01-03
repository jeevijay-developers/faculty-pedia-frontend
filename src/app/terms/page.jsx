"use client";

import React from "react";
import {
  FiShield,
  FiUsers,
  FiLock,
  FiShare2,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

const infoSections = [
  {
    title: "1. Information We Collect",
    icon: FiUsers,
    description:
      "At Facultypedia, we collect only the information we need to deliver a personalised learning experience.",
    subSections: [
      {
        label: "A. Information You Provide",
        bullets: [
          "Name",
          "Email address",
          "Mobile number",
          "Password (encrypted)",
          "Class or exam preference (CBSE 6-12, IIT JEE, NEET)",
          "Educator or Student profile details",
        ],
      },
      {
        label: "B. Activity Information",
        bullets: [
          "Courses you join",
          "Educators you follow",
          "Classes attended (live or recorded)",
          "Assignments, tests, and progress tracking",
        ],
      },
      {
        label: "C. Technical Information",
        bullets: [
          "Device type",
          "Browser details",
          "IP address",
          "Usage statistics and app performance data",
        ],
      },
    ],
    footer:
      "We do not collect unnecessary or sensitive information beyond what is required for educational use.",
  },
  {
    title: "2. How We Use Your Information",
    icon: FiShield,
    description:
      "Your data helps us keep your teaching and learning journey seamless and effective.",
    bullets: [
      "Create and manage your Facultypedia account",
      "Provide access to live classes, courses, and study materials",
      "Help educators connect with students and vice versa",
      "Improve teaching quality and platform performance",
      "Send important updates, notifications, and class reminders",
      "Prevent fraud, unauthorized access, or misuse of accounts",
    ],
    footer: "We never sell your personal data to third-party advertisers.",
  },
  {
    title: "3. How We Protect Your Information",
    icon: FiLock,
    bullets: [
      "Encrypted passwords",
      "Secure servers",
      "Access-restricted databases",
      "Regular security checks",
    ],
    footer:
      "While no online platform can guarantee absolute security, we take every reasonable step to safeguard your information.",
  },
  {
    title: "4. Sharing of Information",
    icon: FiShare2,
    bullets: [
      "With educators (limited to your name and academic information)",
      "With service providers who help us run the platform",
      "When required by law or authorised government requests",
    ],
    footer:
      "We do not share your information for marketing purposes outside Facultypedia.",
  },
  {
    title: "6. Children’s Data",
    icon: FiUsers,
    description:
      "Facultypedia is open to students from Class 6 to 12, IIT JEE, NEET, and droppers.",
    bullets: [
      "Students under 18 should use the platform with parental guidance, as required by Indian law.",
    ],
  },
  {
    title: "7. Changes to This Policy",
    icon: FiClock,
    bullets: [
      "We may update this Privacy Policy as our platform evolves.",
      'Whenever we make changes, we will update the "Last Updated" date at the top.',
    ],
  },
];

const TermsPage = () => {
  const lastUpdated = "December 11, 2025";

  return (
    <div className="bg-linear-to-b from-white via-blue-50/40 to-white">
      <header className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-white to-indigo-100" />
          <div className="absolute -top-24 left-[-12%] h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-12 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-5 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
            Privacy Policy
          </span>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-[56px]">
            Facultypedia Terms & Privacy Commitment
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            At Facultypedia, we are committed to protecting your personal
            information and ensuring that your experience on our platform is
            safe, transparent, and trustworthy. This Privacy Policy explains how
            we collect, use, store, and protect the data of students, educators,
            and visitors who use our services.
          </p>
          <p className="mt-4 text-base text-gray-600">
            By signing up, logging in, or accessing any part of Facultypedia,
            you agree to the practices described in this policy.
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {infoSections.map((section) => {
            const Icon = section.icon ?? FiAlertCircle;
            return (
              <section
                key={section.title}
                className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                </div>
                {section.description && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    {section.description}
                  </p>
                )}
                {section.subSections && (
                  <div className="mt-6 space-y-5">
                    {section.subSections.map((sub) => (
                      <div key={sub.label}>
                        <p className="text-sm font-semibold text-gray-900">
                          {sub.label}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          {sub.bullets.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="mt-6 space-y-2 text-sm text-gray-600">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.footer && (
                  <p className="mt-6 text-sm font-medium text-blue-700">
                    {section.footer}
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-16 rounded-3xl border border-blue-100 bg-blue-50/80 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-blue-900">
            Questions about our policy?
          </h2>
          <p className="mt-3 text-sm text-blue-800">
            Reach out to support@facultypedia.com and our compliance team will
            be happy to help.
          </p>
        </section>
      </main>
    </div>
  );
};

export default TermsPage;
