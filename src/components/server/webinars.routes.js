import API_CLIENT from "./config";

export const getWebinarById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/webinars/webinar-by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching webinar by ID:", error);
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
