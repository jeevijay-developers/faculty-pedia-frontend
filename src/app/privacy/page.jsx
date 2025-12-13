"use client";

import React from "react";
import {
  FiCheckCircle,
  FiUserCheck,
  FiShield,
  FiUsers,
  FiLock,
  FiBell,
  FiSlash,
  FiRepeat,
} from "react-icons/fi";

const sections = [
  {
    id: "acceptance",
    icon: FiCheckCircle,
    title: "1. Acceptance",
    body: [
      "By creating an account or using Faculty Pedia, you agree to follow these Terms & Conditions.",
      "If you do not agree, please stop using the platform.",
    ],
  },
  {
    id: "who-can-use",
    icon: FiUsers,
    title: "2. Who Can Use the Platform",
    body: [
      "Faculty Pedia is designed for CBSE students (Classes 6-12), IIT JEE and NEET aspirants (including droppers), and educators teaching these categories.",
      "Users under 18 should use the platform with parental guidance.",
    ],
  },
  {
    id: "account-rules",
    icon: FiUserCheck,
    title: "3. Account Rules",
    body: [
      "Provide accurate information during registration.",
      "Keep login details private.",
      "Avoid sharing passwords or account access.",
      "Faculty Pedia may suspend accounts showing suspicious or unsafe activity.",
    ],
  },
  {
    id: "allowed-not-allowed",
    icon: FiShield,
    title: "4. Allowed & Not Allowed",
    body: [
      "Users must not disrupt or misuse live classes.",
      "Recording, distributing, or sharing content without permission is prohibited.",
      "Do not upload abusive, harmful, or illegal material.",
      "Never impersonate others.",
      "Do not attempt to hack, modify, or interfere with the platform.",
      "Violations may result in content removal or account termination.",
    ],
  },
  {
    id: "content-rights",
    icon: FiLock,
    title: "5. Content Usage & Rights",
    body: [
      "The platform provides live and recorded classes, assignments, tests, notes, and study materials, along with educator profiles and updates.",
      "All content is protected by copyright and may only be accessed for personal learning.",
      "Sharing, selling, or redistributing content without written permission is prohibited.",
    ],
  },
  {
    id: "educator-responsibilities",
    icon: FiUsers,
    title: "6. Educator Responsibilities",
    body: [
      "Provide accurate academic information and maintain professionalism.",
      "Avoid promoting external coaching or paid services.",
      "Ensure high-quality teaching.",
      "Violations may result in suspension or removal.",
    ],
  },
  {
    id: "communication",
    icon: FiBell,
    title: "7. Communication & Notifications",
    body: [
      "By creating an account, you agree to receive class reminders, important announcements, security alerts, and educator updates.",
      "Notification settings can be changed anytime in your profile.",
    ],
  },
  {
    id: "suspension",
    icon: FiSlash,
    title: "8. Account Suspension & Termination",
    body: [
      "We may suspend or terminate accounts if users violate these Terms, misuse the platform, interfere with classes, content, or data, or engage in harmful or abusive behaviour.",
      "Account deletion requests can be emailed to support@facultypedia.com.",
    ],
  },
  {
    id: "liability",
    icon: FiShield,
    title: "9. Limitation of Liability",
    body: [
      "Faculty Pedia is not responsible for user-side network or device issues, third-party service interruptions, or exam results and academic performance.",
      "We provide learning support — actual outcomes depend on individual effort.",
    ],
  },
  {
    id: "updates",
    icon: FiRepeat,
    title: "10. Updates to Terms",
    body: [
      "These Terms may be updated periodically. The \"Last Updated\" date will always reflect the latest version.",
      "Continued use of the platform indicates acceptance of updated terms.",
    ],
  },
];

const lastUpdated = "January 2025";

const PrivacyPage = () => {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white">
      <header className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-indigo-100" />
          <div className="absolute -top-24 left-[-12%] h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute bottom-[-4rem] right-[-3rem] h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-5 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
            Faculty Pedia – Terms & Conditions
          </span>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-[54px]">
            Designed for a Safe and Fair Learning Community
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            These Terms & Conditions outline the rules every student and educator agrees to when using Faculty Pedia. We keep the platform respectful, secure, and focused on meaningful learning.
          </p>
          <p className="mt-4 text-base text-gray-600">
            Last Updated: <span className="font-semibold text-blue-700">{lastUpdated}</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr]">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <article
                key={section.id}
                className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                      {section.body.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-16 rounded-3xl border border-blue-100 bg-blue-50/80 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-blue-900">Need help or have questions?</h2>
          <p className="mt-3 text-sm text-blue-800">
            Email support@facultypedia.com and our team will respond as quickly as possible.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
