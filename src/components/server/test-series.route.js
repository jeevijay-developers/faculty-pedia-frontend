import API_CLIENT from "./config";

// Helper function to get base URL for server-side fetch
const getBaseURL = () => {
  // Production URL
  const PRODUCTION_URL =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

  // Development URL
  const DEVELOPMENT_URL = "http://localhost:5000";

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === "production";

  // Return appropriate URL
  if (isProduction && PRODUCTION_URL) {
    return PRODUCTION_URL;
  }

  return DEVELOPMENT_URL;
};

// Fetch a test series by ID (works in both server and client components)
export const getTestSeriesById = async (id) => {
  try {
    // Check if we're in a server component (no window object)
    const isServer = typeof window === "undefined";

    if (isServer) {
      // Use native fetch for server components
      const baseURL = getBaseURL();
      const response = await fetch(`${baseURL}/api/test-series/by-id/${id}`, {
        cache: 'no-store', // Always get fresh data
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test series: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data; // Handle both {data: ...} and direct response formats
    } else {
      // Use axios for client components
      const response = await API_CLIENT.get(`/api/test-series/by-id/${id}`);
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
  if (!educatorId) return { testSeries: [], pagination: { totalTestSeries: 0 } };
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
