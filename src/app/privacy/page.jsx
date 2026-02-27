"use client";

import React from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiDatabase,
  FiSettings,
  FiDollarSign,
  FiLock,
  FiShare2,
  FiEye,
  FiShield,
  FiCoffee,
  FiClock,
  FiUsers,
  FiGlobe,
  FiRefreshCw,
  FiUserCheck,
} from "react-icons/fi";

const sections = [
  {
    number: "01",
    icon: FiDatabase,
    title: "Information We Collect",
    subsections: [
      {
        label: "1.1 Personal Information",
        items: [
          "Full name",
          "Email address",
          "Mobile number",
          "Profile photo",
          "Address (if provided)",
          "Government ID (if required for verification)",
          "Bank account details (for Educator payouts)",
        ],
      },
      {
        label: "1.2 Educational Information",
        items: [
          "Courses enrolled",
          "Academic preferences",
          "Course progress",
          "Test results",
        ],
      },
      {
        label: "1.3 Payment Information",
        items: [
          "Transaction details",
          "Billing details",
          "UPI / Card transaction reference",
        ],
      },
      {
        label: "1.4 Technical Data",
        items: [
          "IP address",
          "Device type",
          "Browser type",
          "Login time and activity",
          "Cookies and usage analytics",
        ],
      },
    ],
    callout: {
      type: "warning",
      text: "FacultyPedia does not store debit/credit card details directly. Payments are processed via secure third-party payment gateways.",
    },
  },
  {
    number: "02",
    icon: FiSettings,
    title: "How We Use Your Information",
    intro: "We use collected data for:",
    items: [
      "Creating and managing user accounts",
      "Processing course enrollments and payments",
      "Issuing Educator payouts",
      "Providing customer support",
      "Sending course notifications and updates",
      "Improving platform functionality",
      "Preventing fraud and unauthorized access",
      "Legal compliance",
    ],
    callout: {
      type: "info",
      text: "We do not sell personal data to third parties.",
    },
  },
  {
    number: "03",
    icon: FiDollarSign,
    title: "Educator Financial Data",
    intro: "Educators provide bank details for payout processing.",
    items: [
      "Bank information is stored securely.",
      "Payouts are issued as per Terms & Conditions (after 30 days of course start date).",
      "FacultyPedia may temporarily hold payouts in case of disputes or student complaints.",
    ],
  },
  {
    number: "04",
    icon: FiLock,
    title: "Intellectual Property & Content Ownership",
    items: [
      "Study materials, videos, and tests uploaded by Educators remain their intellectual property.",
      "FacultyPedia does not claim ownership.",
      "FacultyPedia will not use or sell such content for promotional purposes without written consent of the Educator.",
    ],
  },
  {
    number: "05",
    icon: FiShare2,
    title: "Data Sharing & Disclosure",
    intro: "We may share information only in the following cases:",
    items: [
      "With payment gateways for transaction processing",
      "With government authorities if legally required",
      "To comply with court orders",
      "To prevent fraud or illegal activity",
    ],
    callout: {
      type: "info",
      text: "We do not share personal information with advertisers for commercial sale.",
    },
  },
  {
    number: "06",
    icon: FiEye,
    title: "Student Conduct & Monitoring",
    intro: "To maintain discipline and quality:",
    items: [
      "Live sessions may be monitored for safety and compliance.",
      "Chat records may be reviewed in case of complaints.",
      "Accounts may be suspended for misconduct.",
    ],
  },
  {
    number: "07",
    icon: FiShield,
    title: "Data Security",
    intro: "We implement reasonable administrative, technical, and physical safeguards to protect your information.",
    paragraph: "However, no digital platform can guarantee 100% security. Users are advised to:",
    items: [
      "Keep login credentials confidential.",
      "Not share OTPs.",
      "Use strong passwords.",
    ],
  },
  {
    number: "08",
    icon: FiCoffee,
    title: "Cookies Policy",
    intro: "FacultyPedia uses cookies to:",
    items: [
      "Improve user experience",
      "Store login sessions",
      "Analyze traffic",
    ],
    callout: {
      type: "info",
      text: "Users may disable cookies via browser settings, but some features may not function properly.",
    },
  },
  {
    number: "09",
    icon: FiClock,
    title: "Data Retention",
    intro: "We retain user data:",
    items: [
      "As long as the account is active",
      "As required for legal or financial compliance",
      "For dispute resolution",
    ],
    callout: {
      type: "info",
      text: "Users may request account deletion subject to legal obligations.",
    },
  },
  {
    number: "10",
    icon: FiUsers,
    title: "Minor Users",
    intro: "If a Student is under 18 years:",
    items: [
      "Registration must be done under parental supervision.",
      "Parent/guardian consent may be required.",
    ],
  },
  {
    number: "11",
    icon: FiGlobe,
    title: "Jurisdiction & Legal Compliance",
    intro: "This Privacy Policy shall be governed by:",
    items: [
      "Laws of India",
      "Information Technology Act, 2000",
      "Applicable data protection regulations",
    ],
    highlight: "Kota, Rajasthan, India",
  },
  {
    number: "12",
    icon: FiRefreshCw,
    title: "Changes to Privacy Policy",
    items: [
      "FacultyPedia reserves the right to modify this Privacy Policy at any time.",
      "Users will be notified of significant changes via email or platform notification.",
      "Continued use of the Platform constitutes acceptance of updated policies.",
    ],
  },
  {
    number: "13",
    icon: FiUserCheck,
    title: "Your Rights",
    intro: "You have the right to:",
    items: [
      "Access your personal data",
      "Correct inaccurate data",
      "Request deletion (subject to legal compliance)",
      "Withdraw consent",
    ],
    callout: {
      type: "info",
      text: "For any privacy-related concerns, contact us using the details below.",
    },
  },
];

const PrivacyPage = () => {
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
            Privacy & Data Protection
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
            Privacy Policy
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-3">
            FacultyPedia &ndash; Data Protection & Privacy Statement
          </p>

          <p className="max-w-2xl mx-auto text-base text-gray-500 leading-relaxed mb-6">
            FacultyPedia is committed to protecting the privacy and personal data of all users including Students and Educators. This Privacy Policy explains how we collect, use, disclose, process, and safeguard your information.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
              www.facultypedia.com
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
              <FiMapPin className="w-3 h-3" /> Kota, Rajasthan, India
            </span>
          </div>
        </div>
      </section>

      {/* CONSENT NOTICE */}
      <section className="bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 text-center">
          <p className="text-white text-sm md:text-base font-medium leading-relaxed">
            By accessing or using the Platform, you consent to the practices described in this Privacy Policy.
          </p>
        </div>
      </section>

      {/* QUICK NAV */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {sections.map((s) => (
              <a
                key={s.number}
                href={`#section-${s.number}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <span className="text-blue-500 font-bold">{s.number}</span>
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.title.split(" ").slice(0, 2).join(" ")}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.number}
                id={`section-${section.number}`}
                className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
              >
                {/* card header with accent bar */}
                <div className="flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500 text-sm font-bold">{section.number}</span>
                    <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                  </div>
                </div>

                {/* card body */}
                <div className="px-8 py-6 space-y-4">
                  {section.intro && (
                    <p className="text-gray-600 text-sm leading-relaxed">{section.intro}</p>
                  )}

                  {section.paragraph && (
                    <p className="text-gray-600 text-sm leading-relaxed">{section.paragraph}</p>
                  )}

                  {/* subsections (for section 1) */}
                  {section.subsections && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {section.subsections.map((sub) => (
                        <div key={sub.label} className="rounded-xl bg-gray-50 border border-gray-100 p-5">
                          <p className="text-sm font-semibold text-gray-800 mb-3">{sub.label}</p>
                          <ul className="space-y-1.5">
                            {sub.items.map((item) => (
                              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* regular items list */}
                  {section.items && !section.subsections && (
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* jurisdiction highlight */}
                  {section.highlight && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-5 py-3 mt-2">
                      <FiMapPin className="text-blue-600 w-4 h-4 shrink-0" />
                      <span className="text-blue-700 font-bold text-sm">{section.highlight}</span>
                    </div>
                  )}

                  {/* callout */}
                  {section.callout && (
                    <div className={`rounded-xl px-5 py-4 text-sm font-medium ${
                      section.callout.type === "warning"
                        ? "bg-amber-50 border border-amber-200 text-amber-800"
                        : "bg-blue-50 border border-blue-100 text-blue-700"
                    }`}>
                      {section.callout.type === "warning" && <span className="mr-1.5">&#9888;&#65039;</span>}
                      {section.callout.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Section 14</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Contact Information</h2>
            <p className="mt-3 text-gray-500 text-sm">For any privacy-related issues or data requests:</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            <a
              href="mailto:support@facultypedia.com"
              className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Email</p>
                <p className="text-sm text-gray-900 font-semibold">support@facultypedia.com</p>
              </div>
            </a>
            <a
              href="tel:+919509933693"
              className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Phone</p>
                <p className="text-sm text-gray-900 font-semibold">+91- 9509933693</p>
              </div>
            </a>
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Address</p>
                <p className="text-sm text-gray-900 font-semibold">Kota, Rajasthan, India</p>
              </div>
            </div>
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
            By using FacultyPedia, you acknowledge that:
          </p>
          <div className="space-y-4 max-w-2xl mx-auto text-left">
            <div className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/20 px-5 py-4">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </span>
              <p className="text-white font-medium text-sm">You have read and understood this Privacy Policy.</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/20 px-5 py-4">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </span>
              <p className="text-white font-medium text-sm">You consent to the collection and processing of your data as described.</p>
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

export default PrivacyPage;