const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Image Skeleton */}
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>

            {/* Profile Info Skeleton */}
            <div className="flex-1">
              <div className="h-8 bg-gray-300 rounded w-64 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-24 bg-gray-300 rounded-t"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Card Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
