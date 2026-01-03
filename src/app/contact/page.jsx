"use client";

import React from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiGlobe,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const socialLinks = [
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://facebook.com/facultypedia",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://instagram.com/facultypedia",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    href: "https://youtube.com/facultypedia",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "https://linkedin.com/company/facultypedia",
  },
];

const contactCards = [
  {
    title: "Email Support",
    description:
      "For general inquiries, technical issues, or course information.",
    detail: "support@facultypedia.com",
    icon: FiMail,
    actions: [
      {
        label: "Send Email",
        href: "mailto:support@facultypedia.com",
        variant: "primary",
      },
    ],
  },
  {
    title: "Phone or WhatsApp Support",
    description: "Get quick help from our student support team.",
    detail: "+91 80007 93693",
    icon: FiPhone,
    actions: [
      {
        label: "Call Now",
        href: "tel:+918000793693",
        variant: "primary",
      },
      {
        label: "Chat on WhatsApp",
        href: "https://wa.me/918000793693",
        variant: "outline",
        icon: IoLogoWhatsapp,
        external: true,
      },
    ],
  },
  {
    title: "Office Address",
    description:
      "Visit us for counselling sessions or partnership discussions.",
    detail: "C304 Om Enclave, Anantpura, Kota, Rajasthan, 324005",
    icon: FiMapPin,
    actions: [
      {
        label: "View on Maps",
        href: "https://maps.google.com/?q=C304+Om+Enclave+Anantpura+Kota+Rajasthan+324005",
        variant: "outline",
        external: true,
      },
    ],
  },
  {
    title: "Follow and Connect",
    description:
      "Stay connected with updates, announcements, and educator activities.",
    detail: "www.facultypedia.com",
    icon: FiGlobe,
    actions: [
      {
        label: "Visit Website",
        href: "https://www.facultypedia.com",
        variant: "primary",
        external: true,
      },
    ],
    social: socialLinks,
  },
];

const supportTopics = [
  {
    title: "For Students",
    description:
      "If you are facing login issues, class access problems, or want help choosing the right course, our support team is ready for you.",
    icon: FiUsers,
  },
  {
    title: "For Educators",
    description:
      "Interested in joining as a teacher or mentor? Write to us and our onboarding team will reach out soon with next steps.",
    icon: FiBookOpen,
  },
];

const ContactPage = () => {
  return (
    <div className="bg-linear-to-b from-white via-blue-50/30 to-white">
      <section className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-100" />
          <div className="absolute -top-28 left-[-10%] h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-12 -right-8 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 text-gray-900 sm:px-6 lg:flex-row lg:items-start lg:px-8">
          <div className="space-y-6 lg:w-3/5">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-5 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
              We are here to help
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-[52px]">
              Have a question, need guidance, or want to know more about our
              courses?
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              We are here to help you every step of the way. At Facultypedia, we
              believe communication should be simple and quick, just like
              learning.
            </p>
            <p className="max-w-3xl text-base leading-relaxed text-gray-600">
              Whether you are a student preparing for IIT JEE, NEET, or CBSE
              (Classes 6-12), or an educator looking to join our platform, feel
              free to reach out to us anytime.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm shadow-blue-100">
                <FiClock className="text-blue-600" />
                Response within 24 hours (Mon-Sat)
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm shadow-blue-100">
                <FiPhone className="text-blue-600" />
                WhatsApp support 10 AM - 8 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{card.description}</p>
                <p className="mt-4 text-sm font-semibold text-blue-700">
                  {card.detail}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                  {card.actions?.map((action) => {
                    const ActionIcon = action.icon;
                    const baseClasses =
                      action.variant === "primary"
                        ? "inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
                        : "inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-blue-700 transition hover:border-blue-400 hover:text-blue-900";
                    return (
                      <a
                        key={action.label}
                        href={action.href}
                        target={action.external ? "_blank" : undefined}
                        rel={
                          action.external ? "noopener noreferrer" : undefined
                        }
                        className={baseClasses}
                      >
                        {ActionIcon && <ActionIcon className="h-4 w-4" />}
                        {action.label}
                      </a>
                    );
                  })}
                </div>
                {card.social && (
                  <div className="mt-6 flex items-center gap-3">
                    {card.social.map((social) => {
                      const SocialIcon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
                          aria-label={social.label}
                        >
                          <SocialIcon className="h-3.5 w-3.5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-gray-50/70 p-8 shadow-inner">
            <div className="grid gap-8 md:grid-cols-2">
              {supportTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div key={topic.title} className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {topic.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Facultypedia is here to make your journey simpler, smarter, and more
          connected.
        </h2>
        <p className="mt-4 text-gray-600">
          Reach out to us, follow our updates, and let us know how we can
          support your learning or teaching goals.
        </p>
      </section>
    </div>
  );
};

export default ContactPage;
