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
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error fetching educators by subject:", error);
    return [];
  }
};
