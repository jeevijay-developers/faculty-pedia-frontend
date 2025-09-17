import API_CLIENT from "./config";

export const getCourseById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course by ID:", error);
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
          const res = await API_CLIENT.get(`/api/course/${id}`);
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
