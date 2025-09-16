const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image Skeleton */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 bg-gray-300 rounded-full border-4 border-white shadow-xl ring-4 ring-gray-100"></div>
              </div>

              {/* Profile Info Skeleton */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-8 bg-gray-300 rounded w-64"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-200 rounded-lg mr-3">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-40"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-200 rounded-lg mr-3">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
              <div className="h-10 bg-gray-300 rounded-lg w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center py-4 px-2">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-gray-200 border border-gray-200">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Card Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-200 border border-gray-300">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 bg-gray-300 rounded w-16 mb-1"></div>
                      <div className="flex items-center space-x-4">
                        <div className="h-3 bg-gray-300 rounded w-12"></div>
                        <div className="h-3 bg-gray-300 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
