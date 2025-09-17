"use client";

import { FiX } from "react-icons/fi";
import Image from "next/image";

const ImageModal = ({ enlargedImage, setEnlargedImage }) => {
  // Helper function to get image URL and validate it
  const getImageUrl = (image) => {
    if (!image) return null;

    // If image is a string
    if (typeof image === "string") {
      return image.trim() !== "" ? image : null;
    }

    // If image is an object with url property
    if (typeof image === "object" && image.url) {
      return image.url.trim() !== "" ? image.url : null;
    }

    return null;
  };

  const imageUrl = getImageUrl(enlargedImage);

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={() => setEnlargedImage(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
        >
          <FiX className="w-6 h-6 text-gray-600" />
        </button>
        <div className="p-6">
          <Image
            src={imageUrl}
            alt="Enlarged question image"
            width={800}
            height={600}
            className="max-w-full max-h-[80vh] object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
