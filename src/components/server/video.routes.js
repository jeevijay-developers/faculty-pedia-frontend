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
  const response = await API_CLIENT.get(`/api/videos`, { params });
  return pickVideosArray(response?.data || response);
};

const videoRoutes = {
  getVideos,
};

export default videoRoutes;
