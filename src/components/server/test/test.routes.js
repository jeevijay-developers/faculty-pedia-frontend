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
  const attemptNextFallback = async (originalError) => {
    // Fallback to Next.js route (same-origin) when backend route is missing
    if (typeof window === "undefined") throw originalError;
    try {
      const res = await fetch("/api/results/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      if (!res.ok) {
        throw new Error(`Fallback submit failed with status ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      return data;
    } catch (fallbackErr) {
      console.error("Fallback submit (Next API) failed:", fallbackErr);
      throw originalError;
    }
  };

  try {
    const response = await API_CLIENT.post(
      "/api/results/submit-test",
      resultData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting test result:", error);
    // If backend route is missing (404) or any network failure, try the local Next.js API route
    const status = error?.response?.status;
    if (status === 404 || status === 400 || status === 500 || !status) {
      return attemptNextFallback(error);
    }
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
