"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const EDUCATOR_FALLBACK_IMAGE = "/images/placeholders/educatorFallback.svg";

// Props: { item: { title, educatorName, postImage, qualification, subject, fee }, detailsHref?: string }
const OneToOnePPHCard = ({ item, detailsHref = "#" }) => {
  const computeImageSrc = () =>
    item.postImage && item.postImage.trim() !== ""
      ? item.postImage
      : EDUCATOR_FALLBACK_IMAGE;

  const [imageSrc, setImageSrc] = useState(computeImageSrc);

  useEffect(() => {
    setImageSrc(computeImageSrc());
  }, [item.postImage]);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative h-40 bg-gray-200 overflow-hidden flex-shrink-0">
        <Image 
          src={imageSrc} 
          alt={item.educatorName || 'Educator'} 
          fill 
          className="object-cover"
          onError={() => setImageSrc(EDUCATOR_FALLBACK_IMAGE)}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight overflow-hidden">{item.title}</h3>
        <h4 className="text-base font-semibold text-blue-600 mb-1">{item.educatorName}</h4>
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">Qualification: </span>
          {item.qualification}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">Subject: </span>
          {item.subject}
        </div>
        {item.specialization && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-medium">Specialization: </span>
            {item.specialization}
          </div>
        )}
        <div className="mb-4 text-xl font-bold text-black">
          ₹{Number(item.fee).toLocaleString()}<span className="mb-4 font-medium text-sm text-gray-700"> per hour</span>
        </div>
        <div className="mt-auto">
          <Link
            href={detailsHref}
            className="w-full border border-gray-300 bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 text-center block"
          >
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OneToOnePPHCard;


