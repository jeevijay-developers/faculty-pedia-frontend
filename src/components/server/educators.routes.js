import API_CLIENT from "./config";

const EDUCATORS_BASE_PATH = "/api/educators";
const EDUCATOR_UPDATE_BASE_PATH = "/api/educator-update";

export const getAllEducators = async (params = {}) => {
  try {
    const response = await API_CLIENT.get(`${EDUCATORS_BASE_PATH}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching all educators:", error);
    throw error;
  }
};

export const getEducatorsBySubject = async (subject, params = {}) => {
  try {
    const response = await API_CLIENT.get(
      `${EDUCATORS_BASE_PATH}/subject/${subject}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching educators by subject:", error);
    throw error;
  }
};

export const getEducatorsBySpecialization = async (specialization, params = {}) => {
  try {
    const response = await API_CLIENT.get(
      `${EDUCATORS_BASE_PATH}/specialization/${specialization}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching educators by specialization:", error);
    throw error;
  }
};

export const getEducatorProfile = async (id) => {
  try {
    const response = await API_CLIENT.get(`${EDUCATORS_BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching educator profile:", error);
    throw error;
  }
};

export const createEducatorProfile = async (payload) => {
  try {
    const response = await API_CLIENT.post(EDUCATORS_BASE_PATH, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating educator profile:", error);
    throw error;
  }
};

// Update educator profile image
export const updateEducatorImage = async (educatorId, formData) => {
  try {
    const response = await API_CLIENT.put(
      `${EDUCATOR_UPDATE_BASE_PATH}/update-image/${educatorId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating educator image:", error);
    throw error;
  }
};

// Update educator basic details
export const updateEducatorProfile = async (educatorId, formData) => {
  try {
    const response = await API_CLIENT.put(
      `${EDUCATOR_UPDATE_BASE_PATH}/update-name-email-number-bio-ivlink/${educatorId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating educator profile:", error);
    throw error;
  }
};
