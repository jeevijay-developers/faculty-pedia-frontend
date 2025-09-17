import API_CLIENT from "./config";

// Fetch a test series by ID
export const getTestSeriesById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/test-series/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test series by ID:", error);
    throw error;
  }
};

// Fetch all test series (optionally could accept query params later)
export const getTestSeries = async () => {
  try {
    const response = await API_CLIENT.get(`/api/test-series`);
    console.log(response.data);
    
    return response.data; // Expecting array or wrapped object { testSeries: [...] }
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};
