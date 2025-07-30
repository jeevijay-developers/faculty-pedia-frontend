'use client';

import Image from 'next/image';
import { FaStar, FaRegStar, FaStarHalfAlt, FaPlay } from 'react-icons/fa';

const ProfileHeader = ({ name, rating, reviewCount, image, bio }) => {
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

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
      {/* Profile Image */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
        <Image 
          src={image || "/images/placeholders/profile.jpg"} 
          alt={name} 
          fill 
          className="object-cover"
          onError={(e) => {
            e.target.src = "/images/placeholders/profile.jpg";
          }}
        />
      </div>
      
      <div className="flex-grow">
        {/* Name and Rating */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          <div className="flex items-center mt-1">
            <div className="flex">{renderStars(rating)}</div>
            <span className="ml-2 text-sm text-gray-600">{reviewCount}</span>
          </div>
        </div>
        
        {/* Bio */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {bio}
        </p>
      </div>
      
      {/* Video Preview */}
      <div className="w-full md:w-72 h-40 bg-gray-100 border border-gray-200 rounded-md overflow-hidden flex-shrink-0 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-md cursor-pointer hover:bg-white transition-colors duration-200">
            <FaPlay className="text-gray-800 ml-1" />
          </div>
        </div>
        <p className="absolute bottom-2 right-2 text-xs text-gray-700 bg-white/70 px-2 py-1 rounded">Introduction Video</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
