/**
 * Deployment environment detection and configuration utilities
 */

/**
 * Check if we're running in production
 */
export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

/**
 * Check if we're running in development
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

/**
 * Get the appropriate API URL based on environment
 */
export const getApiUrl = () => {
  // Check for production API URL first
  if (isProduction() && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fall back to base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Default fallback for development
  return "http://localhost:5000";
};

/**
 * Get the current environment name
 */
export const getEnvironment = () => {
  return process.env.NODE_ENV || "development";
};

/**
 * Check if we're running on the client side
 */
export const isClient = () => {
  return typeof window !== "undefined";
};

/**
 * Check if we're running on Vercel
 */
export const isVercel = () => {
  return process.env.VERCEL === "1";
};

/**
 * Check if we're running on Netlify
 */
export const isNetlify = () => {
  return process.env.NETLIFY === "true";
};

/**
 * Get deployment platform info
 */
export const getDeploymentPlatform = () => {
  if (isVercel()) return "vercel";
  if (isNetlify()) return "netlify";
  return "unknown";
};

/**
 * Debug information for troubleshooting
 */
export const getDebugInfo = () => {
  return {
    environment: getEnvironment(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    isClient: isClient(),
    platform: getDeploymentPlatform(),
    apiUrl: getApiUrl(),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    apiUrlEnv: process.env.NEXT_PUBLIC_API_URL,
    nodeEnv: process.env.NODE_ENV,
  };
};
