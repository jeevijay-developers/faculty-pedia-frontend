// import { API_CLIENT } from "../config";

import API_CLIENT from "../config";

// Fetch live test by ID
export const getLiveTestById = async (testId) => {
  try {
    const response = await API_CLIENT.get(
      `/api/live-test/livetest-by-id/${testId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching live test:", error);
    throw error;
  }
};

// Submit test results
export const submitTestResult = async (resultData) => {
  try {
    const response = await API_CLIENT.post(
      "/api/results/submit-test",
      resultData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting test result:", error);
    throw error;
  }
};

// Get test results by student ID
export const getTestResults = async (studentId) => {
  try {
    const response = await API_CLIENT.get(`/api/test/results/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test results:", error);
    throw error;
  }
};
