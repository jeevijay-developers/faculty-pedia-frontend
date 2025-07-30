'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const ReviewSection = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  
  const loadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 3, reviews.length));
  };
  
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
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Student Reviews</h2>
      
      {reviews.length > 0 ? (
        <>
          <div className="space-y-6">
            {reviews.slice(0, visibleReviews).map((review, index) => (
              <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image 
                      src={review.userAvatar || "/images/placeholders/avatar.jpg"} 
                      alt={review.userName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/images/placeholders/avatar.jpg";
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{review.userName}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    
                    <div className="flex mt-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.courseName && (
                      <p className="text-sm text-gray-600 mb-2">
                        Course: {review.courseName}
                      </p>
                    )}
                    
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {visibleReviews < reviews.length && (
            <div className="text-center mt-6">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={loadMore}
              >
                Load More Reviews
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reviews available for this educator yet.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
