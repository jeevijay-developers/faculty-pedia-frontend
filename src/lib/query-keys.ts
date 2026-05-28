// Centralised query key factory.
// Each key is a stable array so TanStack Query can correctly identify,
// deduplicate, and invalidate cache entries.

export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    byId: (id: string) => ["courses", id] as const,
    byEducator: (educatorId: string) => ["courses", "educator", educatorId] as const,
  },
  testSeries: {
    all: ["testSeries"] as const,
    byId: (id: string) => ["testSeries", id] as const,
    byCourse: (courseId: string) => ["testSeries", "course", courseId] as const,
    byEducator: (educatorId: string) => ["testSeries", "educator", educatorId] as const,
  },
  webinars: {
    all: ["webinars"] as const,
    byId: (id: string) => ["webinars", id] as const,
    byEducator: (educatorId: string) => ["webinars", "educator", educatorId] as const,
  },
  educators: {
    all: ["educators"] as const,
    byId: (id: string) => ["educators", id] as const,
    profile: (id: string) => ["educators", id, "profile"] as const,
  },
  student: {
    byId: (id: string) => ["student", id] as const,
    stats: (id: string) => ["student", id, "stats"] as const,
    notifications: (id: string) => ["student", id, "notifications"] as const,
  },
  reviews: {
    byEducator: (educatorId: string) => ["reviews", "educator", educatorId] as const,
    byCourse: (courseId: string) => ["reviews", "course", courseId] as const,
  },
};
