import API_CLIENT from "./config";

// Helper function to get base URL for server-side fetch
const getBaseURL = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DEVELOPMENT_URL = "http://localhost:5000";
  const isProduction = process.env.NODE_ENV === "production";

  if (BASE_URL) return BASE_URL;

  if (isProduction) {
    console.warn(
      "NEXT_PUBLIC_BASE_URL is not set in production; defaulting to localhost"
    );
  }

  return DEVELOPMENT_URL;
};

// Fetch a test series by ID (works in both server and client components)
export const getTestSeriesById = async (id) => {
  try {
    // Validate ID
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid test series ID");
    }

    const trimmedId = id.trim();

    // Check if we're in a server component (no window object)
    const isServer = typeof window === "undefined";

    if (isServer) {
      // Use native fetch for server components
      const baseURL = getBaseURL();
      const response = await fetch(`${baseURL}/api/test-series/${trimmedId}`, {
        cache: "no-store", // Always get fresh data
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test series: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data; // Handle both {data: ...} and direct response formats
    } else {
      // Use axios for client components
      const response = await API_CLIENT.get(`/api/test-series/${trimmedId}`);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching test series by ID:", error);
    throw error;
  }
};

// Fetch all test series (optionally could accept query params later)
export const getTestSeries = async () => {
  try {
    const response = await API_CLIENT.get(`/api/test-series`);
    return response.data; // Expecting array or wrapped object { testSeries: [...] }
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};

export const getTestSeriesByEducator = async (educatorId, params = {}) => {
  if (!educatorId)
    return { testSeries: [], pagination: { totalTestSeries: 0 } };
  try {
    const response = await API_CLIENT.get(
      `/api/test-series/educator/${educatorId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching test series by educator:", error);
    throw error;
  }
};

export const getTestSeriesByCourse = async (courseId, params = {}) => {
  if (!courseId) return { testSeries: [], pagination: { totalTestSeries: 0 } };
  try {
    const response = await API_CLIENT.get(
      `/api/test-series/course/${courseId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching test series by course:", error);
    throw error;
  }
};

// Fetch a test series by slug
export const getTestSeriesBySlug = async (slug) => {
  if (!slug) return null;
  try {
    const response = await API_CLIENT.get(`/api/test-series/slug/${slug}`);
    return response.data?.testSeries || response.data;
  } catch (error) {
    console.error("Error fetching test series by slug:", error);
    throw error;
  }
};
