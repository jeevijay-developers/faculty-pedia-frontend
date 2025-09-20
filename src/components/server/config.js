"use client";
import axios from "axios";

// Get base URL with fallbacks for deployment
const getBaseURL = () => {
  // Production URL (replace with your actual backend URL)
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

const API_CLIENT = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 second timeout for deployment
  withCredentials: true,
});

API_CLIENT.interceptors.request.use(
  (config) => {

    if (typeof window !== "undefined") {
      // Check if in browser
      const TOKEN = localStorage.getItem("faculty-pedia-auth-token");
      const DATA = localStorage.getItem("faculty-pedia-student-data");

      // Don't require auth for login/signup routes
      const isAuthRoute =
        config.url?.includes("/login") ||
        config.url?.includes("/signup") ||
        config.url?.includes("/forgot-password");

      // Only add auth token if we have one and it's not an auth route
      if (TOKEN && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${TOKEN}`;
      }

      // Don't redirect on auth routes or if we're already on login page
      const currentPath = window.location.pathname;
      const isOnLoginPage =
        currentPath.includes("/login") || currentPath.includes("/signup");

      // Only redirect if not on auth route, not already on login page, and no token
      if (!TOKEN && !isAuthRoute && !isOnLoginPage) {
        console.log("No token found, redirecting to login");
        window.location.href = "/student-login";
        return Promise.reject(new Error("No authentication token"));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API_CLIENT.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.status, error.message);

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isOnLoginPage =
        currentPath.includes("/login") || currentPath.includes("/signup");

      // Only redirect on 401 if we're not already on a login page
      if (error.response?.status === 401 && !isOnLoginPage) {
        console.log("401 Unauthorized, redirecting to login");
        localStorage.removeItem("faculty-pedia-auth-token");
        localStorage.removeItem("faculty-pedia-student-data");
        window.location.href = "/student-login";
      }
    }
    return Promise.reject(error);
  }
);

export default API_CLIENT;
