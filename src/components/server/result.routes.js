import API_CLIENT from "./config";

export const getResultById = async (id) => {
  try {
    const response = await API_CLIENT.get(
      `/api/results/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching result by ID:", error);
    throw error;
  }
};
