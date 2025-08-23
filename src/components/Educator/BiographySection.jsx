'use client';

const BiographySection = ({ bio }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Biography</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
          {bio || "No biography available."}
        </p>
      </div>
    </div>
  );
};

export default BiographySection;
