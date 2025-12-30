import API_CLIENT from "./config";

const isLikelyObjectId = (value) =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value.trim());

export const getCourseById = async (identifier, forceSlug = false) => {
  try {
    const normalized = String(identifier).trim();
    const encoded = encodeURIComponent(normalized);
    const looksLikeId = isLikelyObjectId(normalized);

    // Primary lookup: by ID when it looks like an ObjectId and slug was not forced
    if (looksLikeId && !forceSlug) {
      try {
        const res = await API_CLIENT.get(`/api/courses/${encoded}`);
        return res.data?.course || res.data;
      } catch (err) {
        // If not found, fall through to slug lookup for robustness
        if (err?.response?.status !== 404) throw err;
      }
    }

    // Fallback or slug-first lookup
    const slugRes = await API_CLIENT.get(`/api/courses/slug/${encoded}`);
    return slugRes.data?.course || slugRes.data;
  } catch (error) {
    console.error("Error fetching course by ID or slug:", error);
    throw error;
  }
};

export const getCourseBySubject = async (subject) => {
  try {
    const response = await API_CLIENT.post(`/api/course/by-subject`, subject);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by subject:", error);
    throw error;
  }
};

export const getCoursesBySpecialization = async (
  specialization,
  params = {}
) => {
  try {
    const response = await API_CLIENT.get(
      `/api/courses/specialization/${specialization}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by specialization:", error);
    throw error;
  }
};

export const getCourseBySubjectOneToOne = async (subject) => {
  try {
    const response = await API_CLIENT.get(
      `/api/course/available-oto-by-subject/${subject}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by subject:", error);
    throw error;
  }
};

export const getCoursesByIds = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await API_CLIENT.get(`/api/courses/${id}`);
          return res.data?.course || res.data; // support different response shapes
        } catch (err) {
          console.warn(
            "Failed to fetch course",
            id,
            err?.response?.status || err.message
          );
          return null;
        }
      })
    );
    return results.filter(Boolean);
  } catch (error) {
    console.error("Error fetching multiple courses:", error);
    return [];
  }
};

export const getAllCourses = async (params = {}) => {
  try {
    const response = await API_CLIENT.get(`/api/courses`, {
      params: { includePast: false, ...params },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

export const getCoursesByEducator = async (educatorId, params = {}) => {
  if (!educatorId) return { courses: [], pagination: { totalCourses: 0 } };
  try {
    const response = await API_CLIENT.get(
      `/api/courses/educator/${educatorId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by educator:", error);
    throw error;
  }
};
