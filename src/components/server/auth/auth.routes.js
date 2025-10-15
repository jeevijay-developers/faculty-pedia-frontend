import API_CLIENT from "../config";

export const signupAsStudent = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/signup-student", data);
    return response.data;
  } catch (error) {
    // Only log non-validation errors (network issues, server errors, etc.)
    const isValidationError = error.response?.status === 400 || error.response?.status === 409;
    if (!isValidationError) {
      console.error("Error during student signup:", error);
    }
    throw error;
  }
};

export const loginStudent = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/login-student", data);
    return response.data;
  } catch (error) {
    // Only log non-authentication errors
    const isAuthError = error.response?.status === 400 || error.response?.status === 401;
    if (!isAuthError) {
      console.error("Error during student login:", error);
    }
    throw error;
  }
};

export const signupAsEducator = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/signup-educator", data);
    return response.data;
  } catch (error) {
    // Only log non-validation errors
    const isValidationError = error.response?.status === 400 || error.response?.status === 409;
    if (!isValidationError) {
      console.error("Error during educator signup:", error);
    }
    throw error;
  }
};

// Generic login function that can handle both students and educators
export const loginUser = async (email, password) => {
  try {
    // First try to login as student
    try {
      const studentResponse = await API_CLIENT.post("/api/auth/login-student", {
        email,
        password,
      });
      
      return {
        ...studentResponse.data,
        userType: "student",
        userData: studentResponse.data.user,
      };
    } catch (studentError) {
      // If student login fails with 400/401 (invalid credentials), try educator login
      const isAuthError = studentError.response?.status === 400 || studentError.response?.status === 401;
      
      if (isAuthError) {
        try {
          const educatorResponse = await API_CLIENT.post("/api/auth/login-educator", {
            email,
            password,
          });
          
          return {
            ...educatorResponse.data,
            userType: "educator", 
            userData: educatorResponse.data.educator,
          };
        } catch (educatorError) {
          // Both failed - throw educator error (user is neither student nor educator)
          throw educatorError;
        }
      } else {
        // Network error or server error - throw immediately
        throw studentError;
      }
    }
  } catch (error) {
    // Only log non-authentication errors (network issues, server errors, etc.)
    const isAuthError = error.response?.status === 400 || error.response?.status === 401;
    if (!isAuthError) {
      console.error("Error during login:", error);
    }
    throw error;
  }
};

// Legacy functions for backward compatibility
export const loginEducator = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/login-educator", data);
    return response.data;
  } catch (error) {
    // Only log non-authentication errors
    const isAuthError = error.response?.status === 400 || error.response?.status === 401;
    if (!isAuthError) {
      console.error("Error during educator login:", error);
    }
    throw error;
  }
};
