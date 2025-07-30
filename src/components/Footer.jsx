'use client';

import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube 
} from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Exams', href: '/exams' },
    { name: 'Classes', href: '/classes' },
    { name: 'Courses', href: '/courses' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Educators', href: '/educators' },
  ];

  const examCategories = [
    { name: 'IIT JEE', href: '/exams/iitjee' },
    { name: 'NEET', href: '/exams/neet' },
    { name: 'CBSE', href: '/exams/cbse' },
    { name: 'ICSE', href: '/exams/icse' },
    { name: 'Other Exams', href: '/exams/others' },
  ];

  const classTypes = [
    { name: 'Live Classes', href: '/classes/live' },
    { name: '1:1 Classes', href: '/classes/one-to-one' },
    { name: 'Recorded Classes', href: '/classes/recorded' },
    { name: 'Group Classes', href: '/classes/group' },
  ];

  const companyInfo = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com/facultypedia', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com/facultypedia', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://instagram.com/facultypedia', label: 'Instagram' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com/company/facultypedia', label: 'LinkedIn' },
    { icon: FaYoutube, href: 'https://youtube.com/facultypedia', label: 'YouTube' },
  ];

return (
    <footer className="bg-gray-50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Faculty Pedia
              </span>
            </Link>

            <p className="text-sm text-gray-600 mb-6">
              Your trusted platform for educational resources, courses, and exam preparation from the best educators across India.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-sm">123 Education Street, Academic District, New Delhi 110001</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-blue-600 flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <IoMail className="text-blue-600 flex-shrink-0" />
                <span className="text-sm">contact@facultypedia.com</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Exam Categories</h3>
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

          {/* Class Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Class Types</h3>
            <ul className="space-y-3">
              {classTypes.map((link, index) => (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
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
              © {currentYear} Faculty Pedia. All rights reserved.
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;