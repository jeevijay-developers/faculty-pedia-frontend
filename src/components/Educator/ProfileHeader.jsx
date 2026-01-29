"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaPlay,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaFlag,
  FaGraduationCap,
  FaBriefcase,
  FaBook,
  FaUsers,
} from "react-icons/fa";

const EDUCATOR_FALLBACK_IMAGE = "/images/placeholders/educatorFallback.svg";

const ProfileHeader = ({ 
  firstName, 
  lastName, 
  rating, 
  reviewCount, 
  image, 
  bio, 
  socials, 
  qualification, 
  workExperience, 
  specialization, 
  classes, 
  exams, 
  mobileNumber, 
  introVideoLink, 
  demoVideoLink 
}) => {
  const resolveImage = () => {
    if (image && typeof image === "object") {
      return image.url || EDUCATOR_FALLBACK_IMAGE;
    }
    return image || EDUCATOR_FALLBACK_IMAGE;
  };

  const [profileImageSrc, setProfileImageSrc] = useState(resolveImage);

  useEffect(() => {
    setProfileImageSrc(resolveImage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-500" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-500" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-500" />);
    }
    
    return stars;
  };

  // Calculate total teaching experience
  const calculateExperience = () => {
    if (!workExperience || workExperience.length === 0) return "0 years";
    
    let totalMonths = 0;
    workExperience.forEach(exp => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += months;
    });
    
    const years = Math.floor(totalMonths / 12);
    return `${years} years`;
  };

  // Get highest qualification
  const getHighestQualification = () => {
    if (!qualification || qualification.length === 0) return "Not specified";
    return qualification[0]?.title || "Not specified";
  };

  const renderSocialIcons = () => {
    if (!socials) return null;
    
    const socialLinks = [
      { platform: 'facebook', url: socials.facebook, icon: FaFacebook, color: 'text-blue-600' },
      { platform: 'instagram', url: socials.instagram, icon: FaInstagram, color: 'text-pink-600' },
      { platform: 'linkedin', url: socials.linkedin, icon: FaLinkedin, color: 'text-blue-700' },
      { platform: 'youtube', url: socials.youtube, icon: FaYoutube, color: 'text-red-600' },
      { platform: 'twitter', url: socials.twitter, icon: FaTwitter, color: 'text-blue-400' },
    ];

    return (
      <div className="flex gap-2 sm:gap-3 mb-4">
        {socialLinks.map(({ platform, url, icon: Icon, color }) => 
          url && (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${color} hover:scale-110 transition-transform duration-200`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative">
      {/* Report Profile Button */}
      <button className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
        <FaFlag className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Report Profile</span>
        <span className="sm:hidden">Report</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Left Section - Profile Image and Basic Info */}
        <div className="flex flex-col items-center lg:items-start">
          {/* Profile Image */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-4">
            <Image 
              src={profileImageSrc} 
              alt="Educator Profile" 
              fill 
              className="object-cover"
              onError={() => setProfileImageSrc(EDUCATOR_FALLBACK_IMAGE)}
            />
          </div>
          
          {/* WhatsApp Contact */}
          {mobileNumber && (
            <a
              href={`https://wa.me/91${mobileNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto justify-center"
            >
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          )}
        </div>

        {/* Middle Section - Name, Rating, Details */}
        <div className="flex-1">
          {/* Name and Rating */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center lg:text-left">
              {firstName} {lastName}
            </h1>
            <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
              <div className="flex">{renderStars(rating)}</div>
              <span className="text-base sm:text-lg font-semibold text-gray-800">{rating}</span>
              <span className="text-sm sm:text-base text-gray-600">({reviewCount} reviews)</span>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex justify-center lg:justify-start">
              {renderSocialIcons()}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaGraduationCap className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm text-gray-500 block">Qualification</span>
                <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{getHighestQualification()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaBriefcase className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm text-gray-500 block">Experience</span>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{calculateExperience()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaBook className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm text-gray-500 block">Specialization</span>
                <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{specialization || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaUsers className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm text-gray-500 block">Classes</span>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{classes ? classes.join(', ') : "XI, XII"}</p>
              </div>
            </div>
          </div>

          {/* Exams */}
          {exams && (
            <div className="mb-4">
              <span className="text-xs sm:text-sm text-gray-500 block mb-2">Exams:</span>
              <div className="flex flex-wrap gap-2">
                {exams.map((exam, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Videos */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-72 xl:w-80">
          {/* Intro Video */}
          {introVideoLink && (
            <div className="relative h-40 sm:h-44 md:h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-1 lg:flex-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors duration-200">
                  <FaPlay className="text-gray-800 ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-xs sm:text-sm text-white bg-black/70 px-2 sm:px-3 py-1 rounded">
                Introduction Video
              </p>
            </div>
          )}

          {/* Demo Video */}
          {demoVideoLink && (
            <div className="relative h-40 sm:h-44 md:h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-1 lg:flex-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors duration-200">
                  <FaPlay className="text-gray-800 ml-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-xs sm:text-sm text-white bg-black/70 px-2 sm:px-3 py-1 rounded">
                Demo Video
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
