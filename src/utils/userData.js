// Utility functions for user data management

/**
 * Get user data from localStorage
 * @returns {Object|null} Parsed user data or null if not found
 */
export const getUserData = () => {
  try {
    if (typeof window === "undefined") return null; // Server-side check

    const userData = localStorage.getItem("faculty-pedia-student-data");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

/**
 * Set user data in localStorage
 * @param {Object} userData - User data object to store
 */
export const setUserData = (userData) => {
  try {
    if (typeof window === "undefined") return; // Server-side check
    localStorage.setItem("user_data", JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data to localStorage:", error);
  }
};

/**
 * Get user ID from localStorage
 * @returns {string|null} User ID or null if not found
 */
export const getUserId = () => {
  const userData = getUserData();
  return userData?._id || null;
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user data exists in localStorage
 */
export const isUserLoggedIn = () => {
  const userData = getUserData();
  return userData && userData._id;
};

/**
 * Clear user data from localStorage
 */
export const clearUserData = () => {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem("user_data");
  } catch (error) {
    console.error("Error clearing user data from localStorage:", error);
  }
};
export const getUserProperty = (property) => {
  const userData = getUserData();
  return userData?.[property] || null;
};
