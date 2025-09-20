import API_CLIENT from "../config";

export const signupAsStudent = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/signup-student", data);
    return response.data;
  } catch (error) {
    console.error("Error during student signup:", error);
    throw error;
  }
};
export const loginStudent = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/login-student", data);
    return response.data;
  } catch (error) {
    console.error("Error during student signup:", error);
    throw error;
  }
};

export const signupAsEducator = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/signup-educator", data);
    return response.data;
  } catch (error) {
    console.error("Error during educator signup:", error);
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
      // If student login fails, try educator login
      if (studentError.response?.status === 400) {
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
          // If both fail, throw the educator error (likely more relevant)
          throw educatorError;
        }
      } else {
        // If it's not a 400 error, throw the original student error
        throw studentError;
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const loginEducator = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/login-educator", data);
    return response.data;
  } catch (error) {
    console.error("Error during educator login:", error);
    throw error;
  }
};
