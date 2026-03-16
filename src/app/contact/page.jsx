"use client";

import React from "react";
import { FiMail, FiPhone, FiGlobe, FiUsers, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const contactMethods = [
  {
    emoji: "📞",
    icon: FiPhone,
    title: "Call Us",
    detail: "+91 9509933693",
    description: "Available for educator onboarding, technical support, and partnership inquiries.",
    actions: [
      { label: "Call Now", href: "tel:+919509933693", variant: "primary" },
      {
        label: "WhatsApp",
        href: "https://wa.me/919509933693",
        variant: "outline",
        icon: IoLogoWhatsapp,
        external: true,
      },
    ],
  },
  {
    emoji: "📧",
    icon: FiMail,
    title: "Email Us",
    detail: "facultypedia02@gmail.com",
    description: "We typically respond within 24 hours.",
    actions: [
      { label: "Send Email", href: "mailto:facultypedia02@gmail.com", variant: "primary" },
    ],
  },
  {
    emoji: "🌐",
    icon: FiGlobe,
    title: "Website",
    detail: "www.FacultyPedia.com",
    description: "Explore courses, educators, and everything FacultyPedia.",
    actions: [
      { label: "Visit Website", href: "https://www.FacultyPedia.com", variant: "primary", external: true },
    ],
  },
];

const educatorServices = [
  "Launching live courses",
  "Creating test series",
  "Offering 1-to-1 paid mentorship",
  "Hosting webinars",
  "Uploading recorded courses",
];

const commitments = [
  "Fast response",
  "Transparent communication",
  "Dedicated educator support",
  "Secure & professional platform assistance",
];

const socialLinks = [
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com/facultypedia" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/facultypedia" },
  { icon: FaYoutube, label: "YouTube", href: "https://youtube.com/facultypedia" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com/company/facultypedia" },
];

const ContactPage = () => {
  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 font-semibold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            Contact Us
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
            Let&apos;s Build the Future
            <br />
            of Education Together
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
            Whether you&apos;re an educator ready to start your digital journey or a student seeking expert guidance &mdash; we&apos;re here to help.
          </p>
          <p className="max-w-2xl mx-auto text-base text-gray-500 leading-relaxed">
            At FacultyPedia, we believe in strong communication and long-term partnerships. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Get In Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Reach Out To Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(37,99,235,0.12)] transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 mb-5 group-hover:bg-blue-100 transition-colors duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-2">{method.detail}</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{method.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {method.actions.map((action) => {
                        const ActionIcon = action.icon;
                        return (
                          <a
                            key={action.label}
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            rel={action.external ? "noopener noreferrer" : undefined}
                            className={
                              action.variant === "primary"
                                ? "inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                                : "inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            }
                          >
                            {ActionIcon && <ActionIcon className="w-4 h-4" />}
                            {action.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOR EDUCATORS + PARTNERSHIPS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* For Educators */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600">
                  <FiBookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Educators</h3>
              </div>
              <p className="text-gray-600 text-sm mb-5">Interested in:</p>
              <ul className="space-y-3 mb-6">
                {educatorServices.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200/70 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-sm font-medium bg-white rounded-xl px-4 py-3 border border-blue-100">
                Our onboarding team will guide you step-by-step.
              </p>
            </div>

            {/* Partnerships */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600">
                  <FiUsers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Partnerships & Collaborations</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                For institute tie-ups, academic partnerships, or growth collaborations, please email us with subject line:
              </p>
              <div className="rounded-xl bg-white border border-gray-200 px-5 py-4 mb-6">
                <p className="text-blue-600 font-bold text-sm">&ldquo;Partnership Inquiry &ndash; FacultyPedia&rdquo;</p>
              </div>
              <a
                href="mailto:facultypedia02@gmail.com?subject=Partnership%20Inquiry%20%E2%80%93%20FacultyPedia"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <FiMail className="w-4 h-4" />
                Send Partnership Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* OUR COMMITMENT */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-4">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our Commitment</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
            What You Can Expect
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((item) => (
              <div
                key={item}
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(37,99,235,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 mx-auto mb-4">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-6">Follow Us</p>
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social) => {
              const SocialIcon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                  aria-label={social.label}
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Have a question? Have an idea?
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-200 leading-tight mb-10">
            Ready to scale your teaching?
          </h2>
          <p className="text-white/80 text-lg font-medium mb-10">
            We&apos;re just one call or email away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="tel:+919509933693"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-blue-700 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <FiPhone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="mailto:facultypedia02@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3.5 text-white font-bold hover:bg-white/20 transition-all"
            >
              <FiMail className="w-5 h-5" />
              Send Email
            </a>
          </div>

          <span className="inline-block px-6 py-3 rounded-full bg-white/10 text-white font-semibold tracking-wide text-sm border border-white/20">
            Empowering Educators | Educating India
          </span>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;