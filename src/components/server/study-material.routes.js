import API_CLIENT from "./config";

const pickStudyMaterials = (payload) => {
  if (!payload) return [];
  const candidates = [
    payload.studyMaterials,
    payload.data?.studyMaterials,
    payload.data?.data?.studyMaterials,
    payload.data,
    payload,
  ];
  const found = candidates.find((entry) => Array.isArray(entry));
  return Array.isArray(found) ? found : [];
};

export const getStudyMaterialsByCourse = async (courseId, params = {}) => {
  if (!courseId) return [];
  const response = await API_CLIENT.get(`/api/study-materials/course/${courseId}`, {
    params,
  });
  return pickStudyMaterials(response?.data || response);
};

const studyMaterialRoutes = {
  getStudyMaterialsByCourse,
};

export default studyMaterialRoutes;
