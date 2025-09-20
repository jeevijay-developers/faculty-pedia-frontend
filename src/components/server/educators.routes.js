import API_CLIENT from "./config";

export const getEducatorsBySubject = async (subject) => {
  try {
    const response = await API_CLIENT.post(`/api/educator/by-subject`, subject);
    return response.data;
  } catch (error) {
    console.error("Error fetching educators by subject:", error);
    return [];
  }
};
export const getEducatorProfile = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/educator/by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching educators by subject:", error);
    return [];
  }
};

// Update educator profile image
export const updateEducatorImage = async (educatorId, formData) => {
  try {
    const response = await API_CLIENT.put(
      `/api/educator/update-image/${educatorId}`,
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
      `/api/educator/update-name-email-number-bio-ivlink/${educatorId}`,
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
