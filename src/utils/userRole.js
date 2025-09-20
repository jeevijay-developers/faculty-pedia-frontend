// Utility functions for handling user roles and data

/**
 * Get the current user's role from localStorage
 * @returns {'student' | 'educator' | null}
 */
export const getUserRole = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user-role');
};

/**
 * Get the current user's data from localStorage based on their role
 * @returns {Object | null} User data object or null if not found
 */
export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  const role = getUserRole();
  if (!role) return null;

  const storageKey = role === 'student' 
    ? 'faculty-pedia-student-data' 
    : 'faculty-pedia-educator-data';
    
  const userData = localStorage.getItem(storageKey);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isUserLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  
  const role = getUserRole();
  const userData = getUserData();
  
  return !!(role && userData);
};

/**
 * Check if current user is a student
 * @returns {boolean}
 */
export const isStudent = () => {
  return getUserRole() === 'student';
};

/**
 * Check if current user is an educator
 * @returns {boolean}
 */
export const isEducator = () => {
  return getUserRole() === 'educator';
};

/**
 * Clear all user data from localStorage
 */
export const clearUserData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user-role');
  localStorage.removeItem('faculty-pedia-student-data');
  localStorage.removeItem('faculty-pedia-educator-data');
  localStorage.removeItem('token'); // Clear auth token as well
};

/**
 * Get the appropriate dashboard URL for the current user
 * @returns {string} Dashboard URL
 */
export const getDashboardUrl = () => {
  const role = getUserRole();
  switch (role) {
    case 'student':
      return '/exams';
    case 'educator':
      return '/educator/dashboard';
    default:
      return '/';
  }
};

/**
 * Get the appropriate profile URL for the current user
 * @returns {string} Profile URL
 */
export const getProfileUrl = () => {
  const role = getUserRole();
  switch (role) {
    case 'student':
      return '/profile';
    case 'educator':
      return '/educator/profile';
    default:
      return '/';
  }
};