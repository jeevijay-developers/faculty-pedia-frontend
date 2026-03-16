"use client";

import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const sections = [
  {
    number: "1",
    title: "Definitions",
    items: [
      { label: "Platform", text: "refers to FacultyPedia website, application, and services." },
      { label: "Educator", text: "means any teacher, instructor, or professional who publishes or conducts courses through FacultyPedia." },
      { label: "Student", text: "means any registered user enrolled in a course." },
      { label: "Course", text: "means any live, recorded, webinar, one-to-one, test series, or paid educational program listed on the Platform." },
    ],
    type: "definitions",
  },
  {
    number: "2",
    title: "Role of FacultyPedia",
    intro: "FacultyPedia operates as a technology platform that enables Educators to deliver educational services to Students.",
    subtitle: "FacultyPedia:",
    bullets: [
      "Does not act as an academic institution.",
      "Does not guarantee academic results.",
      "Is not responsible for course outcomes or performance of Students.",
    ],
  },
  {
    number: "3",
    title: "Educator Revenue & Payout Policy",
    ordered: [
      "Educators shall receive 90% (Ninety Percent) of the net revenue earned from their respective courses.",
      "FacultyPedia retains 10% platform service fee.",
      "Payouts shall be processed after 30 (Thirty) days from the official course starting date.",
    ],
    subSection: {
      intro: "FacultyPedia reserves the right to withhold, cancel, or reverse payout transfers in case of:",
      bullets: [
        "Student complaints",
        "Non-commencement of course",
        "Non-delivery of promised syllabus",
        "Breach of platform guidelines",
        "Fraudulent activity",
      ],
    },
  },
  {
    number: "4",
    title: "Refund Policy",
    children: [
      {
        subtitle: "4.1 Student Refund Rights",
        bullets: [
          "Students are eligible for 100% refund before the official date of course commencement.",
          "No refund shall be provided once the course has started, under any circumstances except legal order.",
        ],
      },
      {
        subtitle: "4.2 Educator Liability for Non-Completion",
        intro: "Once a course has commenced, the Educator is legally obligated to:",
        bullets: [
          "Complete the course within the promised duration.",
          "Deliver the complete syllabus as mentioned in the course description.",
          "Provide all services promised in the listing.",
        ],
        followUp: "If an Educator fails to fulfill these obligations:",
        followUpBullets: [
          "The Educator must refund the entire course fee to enrolled Students.",
          "Students may initiate legal proceedings directly against the Educator.",
          "FacultyPedia reserves the right to suspend or permanently disable the Educator account.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Intellectual Property Rights",
    ordered: [
      "All study materials, videos, notes, PDFs, test series, and content uploaded by Educators remain the sole intellectual property of the respective Educator.",
    ],
    children: [
      {
        subtitle: "FacultyPedia:",
        bullets: [
          "Does not claim ownership over Educator content.",
          "Shall not use, sell, reproduce, or promote such content without written consent of the Educator.",
        ],
      },
      {
        subtitle: "Students are prohibited from:",
        bullets: [
          "Recording, copying, distributing, or reselling course content.",
          "Sharing login credentials with others.",
        ],
      },
    ],
    footer: "Legal action may be taken for intellectual property violations.",
  },
  {
    number: "6",
    title: "Educator Obligations",
    intro: "Educators agree that they shall:",
    bullets: [
      "Deliver the course as described in the listing.",
      "Maintain professional behavior.",
      "Avoid abusive, defamatory, misleading, or objectionable content.",
      "Not upload illegal, copyrighted (without authorization), obscene, or harmful material.",
      "Conduct sessions as per scheduled timelines.",
      "Maintain academic integrity.",
    ],
    footer: "Failure to comply may result in immediate account suspension.",
  },
  {
    number: "7",
    title: "Student Conduct Policy",
    children: [
      {
        subtitle: "Students agree to:",
        bullets: [
          "Maintain discipline during live classes.",
          "Not use abusive language.",
          "Not disrupt sessions.",
          "Not misuse platform tools.",
        ],
      },
      {
        subtitle: "FacultyPedia and/or Educator reserve full rights to:",
        bullets: [
          "Remove access of any Student on disciplinary grounds.",
          "Block or permanently disable accounts violating policies.",
        ],
      },
    ],
    footer: "No refund shall be issued in case of removal due to misconduct.",
  },
  {
    number: "8",
    title: "Reviews & Ratings",
    bullets: [
      "Only enrolled Students may post reviews.",
      "Reviews must be genuine and based on actual course experience.",
      "Fake reviews, defamatory comments, or manipulated ratings are strictly prohibited.",
      "FacultyPedia reserves the right to remove inappropriate reviews.",
    ],
  },
  {
    number: "9",
    title: "Account Suspension & Termination",
    intro: "FacultyPedia has full discretionary rights to:",
    bullets: [
      "Disable or suspend Educator or Student accounts.",
      "Remove course listings.",
      "Cancel payouts.",
      "Restrict access for policy violations.",
    ],
    footer: "Such decisions may be taken without prior notice in serious cases.",
  },
  {
    number: "10",
    title: "Limitation of Liability",
    intro: "FacultyPedia shall not be liable for:",
    bullets: [
      "Academic results of Students.",
      "Technical issues beyond reasonable control.",
      "Disputes between Educator and Student (except platform mediation).",
      "Indirect or consequential damages.",
    ],
  },
  {
    number: "11",
    title: "Payment Disputes & Amount Reversal",
    intro: "FacultyPedia reserves the right to:",
    bullets: [
      "Cancel transfer of amounts.",
      "Request refund from Educators.",
      "Withhold payouts.",
    ],
    followUp: "In case of verified Student complaint that:",
    followUpBullets: [
      "Course has not started.",
      "Educator is not teaching.",
      "Services promised are not delivered.",
    ],
  },
  {
    number: "12",
    title: "Governing Law & Jurisdiction",
    intro: "All disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in:",
    highlight: "Kota, Rajasthan, India",
  },
  {
    number: "13",
    title: "Amendments",
    bullets: [
      "FacultyPedia reserves the right to modify these Terms at any time.",
      "Continued use of the Platform constitutes acceptance of revised Terms.",
    ],
  },
];

const BulletList = ({ items, className = "" }) => (
  <ul className={`space-y-2 ${className}`}>
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TermsPage = () => {
  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 font-semibold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            Legal
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
            Terms & Conditions
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
            FacultyPedia &ndash; Educator & Student Platform Agreement
          </p>

          <p className="max-w-2xl mx-auto text-base text-gray-500 leading-relaxed mb-6">
            Welcome to FacultyPedia, an online educational marketplace platform enabling Educators to conduct live courses, one-to-one sessions, webinars, test series, and recorded programs for Students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
              Effective: 26-02-2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
              www.facultypedia.com
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
              Jurisdiction: Kota, Rajasthan, India
            </span>
          </div>
        </div>
      </section>

      {/* AGREEMENT NOTICE */}
      <section className="bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-white text-sm md:text-base font-medium leading-relaxed">
            By accessing or using the FacultyPedia Platform, you agree to be legally bound by these Terms & Conditions. If you do not agree with any part of these Terms, you must not use the Platform.
          </p>
        </div>
      </section>

      {/* TERMS SECTIONS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {sections.map((section) => (
            <div
              key={section.number}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
            >
              {/* section header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold shrink-0">
                  {section.number}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>

              {/* intro text */}
              {section.intro && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{section.intro}</p>
              )}

              {/* subtitle */}
              {section.subtitle && (
                <p className="text-gray-800 text-sm font-semibold mb-3">{section.subtitle}</p>
              )}

              {/* definitions type */}
              {section.type === "definitions" && section.items && (
                <div className="space-y-3">
                  {section.items.map((def) => (
                    <div key={def.label} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="shrink-0 font-bold text-gray-900">&ldquo;{def.label}&rdquo;</span>
                      <span>{def.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ordered list */}
              {section.ordered && (
                <ol className="space-y-2 mb-4">
                  {section.ordered.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                      <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              )}

              {/* bullet list */}
              {section.bullets && <BulletList items={section.bullets} />}

              {/* sub section with its own intro + bullets */}
              {section.subSection && (
                <div className="mt-5 rounded-xl bg-red-50/50 border border-red-100 p-5">
                  <p className="text-gray-700 text-sm font-semibold mb-3">{section.subSection.intro}</p>
                  <BulletList items={section.subSection.bullets} />
                </div>
              )}

              {/* children sub-sections */}
              {section.children && (
                <div className="space-y-5 mt-4">
                  {section.children.map((child, idx) => (
                    <div key={idx} className="rounded-xl bg-gray-50 border border-gray-100 p-5">
                      {child.subtitle && (
                        <p className="text-gray-800 text-sm font-semibold mb-3">{child.subtitle}</p>
                      )}
                      {child.intro && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{child.intro}</p>
                      )}
                      {child.bullets && <BulletList items={child.bullets} />}
                      {child.followUp && (
                        <div className="mt-4 rounded-xl bg-red-50/50 border border-red-100 p-4">
                          <p className="text-gray-700 text-sm font-semibold mb-3">{child.followUp}</p>
                          {child.followUpBullets && <BulletList items={child.followUpBullets} />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* follow up (top-level) */}
              {section.followUp && (
                <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 p-5">
                  <p className="text-gray-700 text-sm font-semibold mb-3">{section.followUp}</p>
                  {section.followUpBullets && <BulletList items={section.followUpBullets} />}
                </div>
              )}

              {/* jurisdiction highlight */}
              {section.highlight && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-5 py-3">
                  <FiMapPin className="text-blue-600 w-4 h-4 shrink-0" />
                  <span className="text-blue-700 font-bold text-sm">{section.highlight}</span>
                </div>
              )}

              {/* footer note */}
              {section.footer && (
                <p className="mt-5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                  {section.footer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Section 14</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Contact Information</h2>
            <p className="mt-3 text-gray-500 text-sm">For any issues, complaints, or legal communication:</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="mailto:facultypedia02@gmail.com"
              className="flex items-center gap-4 rounded-2xl bg-gray-50 border border-gray-100 p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm text-gray-900 font-semibold">facultypedia02@gmail.com</p>
              </div>
            </a>
            <a
              href="tel:+919509933693"
              className="flex items-center gap-4 rounded-2xl bg-gray-50 border border-gray-100 p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Call</p>
                <p className="text-sm text-gray-900 font-semibold">+91-9509933693</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* DECLARATION */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
            Declaration
          </h2>
          <p className="text-white/90 text-lg font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
            By registering as an Educator or Student on FacultyPedia, you acknowledge that:
          </p>
          <div className="space-y-4 max-w-2xl mx-auto text-left">
            <div className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/20 px-5 py-4">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </span>
              <p className="text-white font-medium text-sm">You have read and understood these Terms & Conditions.</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/20 px-5 py-4">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </span>
              <p className="text-white font-medium text-sm">You agree to be legally bound by them.</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/20 px-5 py-4">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </span>
              <p className="text-white font-medium text-sm">You accept the jurisdiction of Kota, Rajasthan courts.</p>
            </div>
          </div>

          <div className="mt-12">
            <span className="inline-block px-6 py-3 rounded-full bg-white/10 text-white font-semibold tracking-wide text-sm border border-white/20">
              Empowering Educators | Educating India
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TermsPage;