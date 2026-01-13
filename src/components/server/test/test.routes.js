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
  const submitViaNextApi = async () => {
    const res = await fetch("/api/results/submit-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
    });

    if (!res.ok) {
      throw new Error(`Next API submit failed with status ${res.status}`);
    }

    return res.json().catch(() => ({}));
  };

  // Prefer the Next.js API route first to avoid backend 404s
  if (typeof window !== "undefined") {
    try {
      return await submitViaNextApi();
    } catch (nextErr) {
      console.warn("Next API submit failed, retrying backend:", nextErr);
    }
  }

  // Fallback to backend API; if it still fails, bubble up the original error
  const response = await API_CLIENT.post("/api/results/submit-test", resultData);
  return response.data;
};

// Get test results by student ID
export const getTestResults = async (studentId) => {
  try {
    const response = await API_CLIENT.get(`/api/results/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test results:", error);
    throw error;
  }
};
