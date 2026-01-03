"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FiPhone, FiMapPin } from "react-icons/fi";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Exams", href: "/exams" },
    { name: "Classes", href: "/classes" },
    { name: "Courses", href: "/courses" },
    { name: "Webinars", href: "/webinars" },
    { name: "Educators", href: "/educators" },
    { name: "Posts", href: "/posts" },
  ];

  const examCategories = [
    { name: "IIT JEE", href: "/exams/iit-jee" },
    { name: "NEET", href: "/exams/neet" },
    { name: "CBSE", href: "/exams/cbse" },
  ];

  const companyInfo = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com/facultypedia",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/facultypedia",
      label: "Instagram",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/facultypedia",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-gray-50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="shrink-0 flex items-center justify-center mb-5">
              <Link href="/" className="flex items-center space-x-2 group">
                <Image
                  src={"/logo/logo-blue.png"}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </Link>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Your trusted platform for educational resources, courses, and exam
              preparation from the best educators across India.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-blue-600 mt-1 shrink-0" />

                <span className="text-sm">
                  {" "}
                  C304 om enclave, Anantpura, Kota, Rajasthan, 324005
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-blue-600 shrink-0" />
                <span className="text-sm">+91 80007 93693 </span>
              </div>
              <div className="flex items-center space-x-3">
                <IoMail className="text-blue-600 shrink-0" />
                <span className="text-sm">nucleonorder@gmail.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Exam Categories
            </h3>
            <ul className="space-y-3">
              {examCategories.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {companyInfo.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-center text-gray-500 mb-4 md:mb-0">
            © {currentYear} Facultypedia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
