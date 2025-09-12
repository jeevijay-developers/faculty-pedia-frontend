/**
 * Authentication utility functions for token management
 */

const TOKEN_KEY = "faculty-pedia-auth-token";

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - true if token exists, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get user info from token (basic implementation)
 * Note: In production, you might want to decode JWT properly
 * @returns {object|null} - User info or null
 */
export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Basic implementation - in production, use proper JWT decode
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

/**
 * Logout user by removing token and redirecting
 * @param {string} redirectTo - URL to redirect after logout
 */
export const logout = (redirectTo = "/student-login") => {
  removeAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
};
