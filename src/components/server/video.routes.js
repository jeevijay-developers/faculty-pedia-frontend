import API_CLIENT from "./config";

const pickVideosArray = (payload) => {
  if (!payload) return [];
  const candidates = [
    payload.videos,
    payload.data?.videos,
    payload.data?.data?.videos,
    payload.data,
  ];
  const found = candidates.find((entry) => Array.isArray(entry));
  return Array.isArray(found) ? found : [];
};

export const getVideos = async (params = {}) => {
  const normalizedCourseId =
    typeof params?.courseId === "string" ? params.courseId.trim() : "";

  if (typeof window !== "undefined") {
    const role = window.localStorage.getItem("user-role");
    if (role && role !== "educator" && normalizedCourseId) {
      const { courseId: _omitCourseId, ...restParams } = params;
      const response = await API_CLIENT.get(
        `/api/videos/course/${encodeURIComponent(normalizedCourseId)}`,
        { params: restParams }
      );
      return pickVideosArray(response?.data || response);
    }
  }

  try {
    const response = await API_CLIENT.get(`/api/videos`, { params });
    return pickVideosArray(response?.data || response);
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      return [];
    }
    throw error;
  }
};

const videoRoutes = {
  getVideos,
};

export default videoRoutes;
