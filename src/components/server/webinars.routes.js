import API_CLIENT from "./config";

export const getWebinarById = async (id) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id || "");
    const endpoint = isObjectId
      ? `/api/webinars/${id}`
      : `/api/webinars/slug/${id}`;

    const response = await API_CLIENT.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching webinar by ID/slug:", error);
    throw error;
  }
};

export const fetchEducatorById = async (id) => {
  if (!id) return null;
  try {
    const response = await API_CLIENT.get(`/api/educators/${id}`);
    return response.data?.data?.educator || response.data?.educator || null;
  } catch (error) {
    console.error("Error fetching educator by ID:", error);
    return null;
  }
};

export const getWebinarsByEducator = async (educatorId, params = {}) => {
  if (!educatorId) return { data: { webinars: [], pagination: { totalWebinars: 0 } } };
  try {
    const response = await API_CLIENT.get(
      `/api/webinars/educator/${educatorId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching webinars by educator:", error);
    throw error;
  }
};
export const getWebinarBySubject = async (subject) => {
  try {
    const response = await API_CLIENT.post(`/api/webinars/by-subject`, subject);
    return response.data;
  } catch (error) {
    console.error("Error fetching webinar by ID:", error);
    throw error;
  }
};
