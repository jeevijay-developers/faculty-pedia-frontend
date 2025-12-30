const ProfileSkeleton = () => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-[#111a21] text-gray-900 flex flex-col animate-pulse">
      <div className="flex-none h-20 w-full px-6 md:px-10 flex items-center justify-between bg-white dark:bg-[#1a2632] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
          <div className="h-5 w-28 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gray-200" />
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-72 flex-col p-6 h-full">
          <div className="flex flex-col gap-3 bg-white dark:bg-[#1a2632] h-full rounded-2xl shadow-sm p-4">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-100/60 dark:bg-gray-800/60"
              >
                <div className="w-5 h-5 bg-gray-300 rounded" />
                <div className="h-4 w-28 bg-gray-300 rounded" />
              </div>
            ))}
            <div className="mt-auto">
              <div className="h-24 bg-gray-200/80 dark:bg-gray-800/80 rounded-xl" />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
          <div className="max-w-8xl mx-auto space-y-6">
            <div className="space-y-2">
              <div className="h-7 w-60 bg-gray-200 rounded" />
              <div className="h-4 w-96 bg-gray-200 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm p-5 border border-gray-100/60 dark:border-gray-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-6 w-12 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-10 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm p-6 space-y-4">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100/60 dark:border-gray-800/60 space-y-2"
                  >
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
