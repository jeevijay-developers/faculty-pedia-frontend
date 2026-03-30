"use client";
import axios from "axios";

const normalizeUrl = (value) => value?.trim()?.replace(/\/+$/, "") || "";

// Get API base URL with environment-aware fallbacks
const getBaseURL = () => {
  const BASE_URL = normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL);
  const WEB_URL = normalizeUrl(process.env.NEXT_PUBLIC_WEB_URL);
  const EDUCATOR_DASHBOARD_URL = normalizeUrl(
    process.env.NEXT_PUBLIC_EDUCATOR_DASHBOARD_URL
  );
  const SUPER_DASHBOARD_URL = normalizeUrl(
    process.env.NEXT_PUBLIC_SUPER_DASHBOARD_URL
  );
  const DEVELOPMENT_URL = "http://localhost:5000";
  const isProduction = process.env.NODE_ENV === "production";
  const frontendUrls = [WEB_URL, EDUCATOR_DASHBOARD_URL, SUPER_DASHBOARD_URL].filter(
    Boolean
  );
  const hasLocalhostFrontend = frontendUrls.some((url) =>
    /localhost|127\.0\.0\.1/i.test(url)
  );
  const hasFacultypediaFrontend = frontendUrls.some((url) =>
    /facultypedia\.com/i.test(url)
  );
  const inferredApiFromHost =
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("facultypedia.com")
      ? "https://api.facultypedia.com"
      : null;

  if (BASE_URL) return BASE_URL;

  if (!isProduction && hasLocalhostFrontend) {
    return DEVELOPMENT_URL;
  }

  if (isProduction && (hasFacultypediaFrontend || inferredApiFromHost)) {
    return "https://api.facultypedia.com";
  }

  if (isProduction && inferredApiFromHost) {
    console.warn(
      "NEXT_PUBLIC_BASE_URL is not set in production; using inferred API URL"
    );
    return inferredApiFromHost;
  }

  if (isProduction) {
    const sameOriginFallback =
      typeof window !== "undefined" ? window.location.origin : null;
    if (sameOriginFallback) {
      console.warn(
        "NEXT_PUBLIC_BASE_URL is not set in production; falling back to same-origin API"
      );
      return sameOriginFallback;
    }
  }

  return DEVELOPMENT_URL;
};

const getRequestTimeout = () => {
  const timeoutFromEnv = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS);
  if (Number.isFinite(timeoutFromEnv) && timeoutFromEnv > 0) {
    return timeoutFromEnv;
  }

  return 30000;
};

const API_CLIENT = axios.create({
  baseURL: getBaseURL(),
  timeout: getRequestTimeout(),
  withCredentials: true,
});

API_CLIENT.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Check if in browser
      const TOKEN = localStorage.getItem("faculty-pedia-auth-token");

      // Always add auth token if we have one (for optional auth endpoints)
      if (TOKEN) {
        config.headers.Authorization = `Bearer ${TOKEN}`;
      }

      // Note: We no longer redirect to login here since browsing should be allowed without auth
      // Authentication requirements are now handled per-endpoint by the backend
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API_CLIENT.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || /timeout/i.test(error.message || "")) {
      const configuredBaseUrl = API_CLIENT.defaults.baseURL || "(not set)";
      error.message = `Request timed out. Check API availability and NEXT_PUBLIC_BASE_URL. Current base URL: ${configuredBaseUrl}`;
    }

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isOnLoginPage =
        currentPath.includes("/login") || currentPath.includes("/signup");
      const isEnrollmentAuth = error.response?.data?.requiresAuth;
      const isCriticalAuthFailure =
        error.response?.status === 401 &&
        localStorage.getItem("faculty-pedia-auth-token") && // Had a token
        !isEnrollmentAuth; // Not an enrollment action

      if (isCriticalAuthFailure && !isOnLoginPage) {
        console.log(
          "Critical auth failure - token expired or invalid, redirecting to login"
        );
        localStorage.removeItem("faculty-pedia-auth-token");
        localStorage.removeItem("faculty-pedia-student-data");
        localStorage.removeItem("faculty-pedia-educator-data");
        localStorage.removeItem("user-role");
        window.location.href =
          "/login?message=Session expired. Please login again.";
      }
    }
    return Promise.reject(error);
  }
);

export default API_CLIENT;
